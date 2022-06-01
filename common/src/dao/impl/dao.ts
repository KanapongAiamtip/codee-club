import firebase from 'firebase/app'
import mapKeys from 'lodash/mapKeys'
import { DeepRequired } from 'ts-essentials'

import { CodeeContext } from '../../context'
import { ProblemResultStatus } from '../../data-types/enums'
import { entries, keys, values } from '../../utils/object-extensions'
import { prop } from '../../utils/type-extensions'
import { urlify } from '../../utils/url-helpers'
import { ACTIVITY_PROBLEM_SETS, ACTIVITY_RESULTS, COURSES, RUNNERS, SUBMISSION_JOBS, USERS, USERS_PRIVATE } from '../firestore-schema'
import { ActivityProblemSet, ActivityResult, Course, CourseActivity, Problem, ProblemResult, Runner, SubmissionJob, Test, User, UserPrivate } from '../types'

import { Calculated, Defaults, New, NewComplete, NewWithDefaults, Update, UpdateComplete } from './dao-types'
import * as DEFAULTS from './defaults' // TODO: Import individually

import 'core-js/features/array/flat-map'

export { New, Update } from './dao-types'

// TODO Chaz: Compare vs URLs
// TODO Chaz: Update ActivityProblemSet sec when updating Course/CourseActivity
// TODO Chaz: Cherry-pick only writable values (ignore/remove extra fields)
// TODO Chaz: Disallow empty user nameFirst/nameLast (probably need a validation layer infront of the DAO)

type DocumentReference = firebase.firestore.DocumentReference

interface Calculator<T> {
  condition: (data: Update<T>) => boolean
  calculation: (data: NewWithDefaults<T>) => Partial<Calculated<T>>
}

/**
 * @description Manages saving data to Firestore, including updating computed values
 */
export class Dao {
  // @ts-expect-error - I use this in my branch!
  private readonly auth: firebase.auth.Auth
  private readonly db: firebase.firestore.Firestore
  private readonly FieldValue: typeof firebase.firestore.FieldValue
  private readonly getGuid: () => string

  constructor({ auth, db, FieldValue, getGuid }: CodeeContext) {
    this.auth = auth
    this.db = db
    this.FieldValue = FieldValue
    this.getGuid = getGuid
  }

  // #region Generic
  private async saveNew<T>(ref: DocumentReference, defaults: Defaults<T>, data: New<T>, getCalculated: (merged: NewWithDefaults<T>) => Calculated<T>): Promise<string> {
    const merged = { ...defaults, ...data }
    const complete: NewComplete<T> = { ...merged, ...getCalculated(merged) } // we save entire merged object

    await ref.set(complete, { merge: true })
    return ref.id
  }

  private async saveUpdate<T>(ref: DocumentReference, update: Update<T>, getCalculated?: (merged: NewWithDefaults<T>) => Partial<Calculated<T>>, deferCalcs = false): Promise<unknown> {
    if (!getCalculated) {
      // No calcs => just save
      return await ref.set(update, { merge: true })
    } else if (deferCalcs) {
      // Deferred calcs => save update then save calcs
      await this.db.runTransaction(async (t) => {
        // Check doc exists
        const snapshotCheck = await t.get(ref)
        if (!snapshotCheck.data()) throw new Error('Object does not exist')

        // Apply update (resolve FieldValue)
        t.set(ref, update, { merge: true })
      })
      return await this.db.runTransaction(async (t) => {
        // Get merged
        const snapshot = await t.get(ref)
        const merged = snapshot.data() as NewWithDefaults<T>

        // Save calculations
        const calcsOnly = getCalculated(merged) // we only save the new data
        t.set(ref, calcsOnly, { merge: true })
      })
    } else {
      // Calculations => run calcs before save
      return await this.db.runTransaction(async (t) => {
        // Get doc & check exists
        const snapshot = await t.get(ref)
        const existing = snapshot.data() as NewWithDefaults<T> | undefined
        if (!existing) throw new Error('Object does not exist')

        // Create merged
        const merged = { ...existing, ...update }

        // Apply calculations & save
        const complete = { ...update, ...getCalculated(merged) }
        t.set(ref, complete, { merge: true })
      })
    }
  }

  private composeCalcs<T, U, V>(c1: (merged: NewWithDefaults<T>) => U, c2: (merged: NewWithDefaults<T>) => V): (merged: NewWithDefaults<T>) => U & V {
    return (merged: NewWithDefaults<T>): U & V => ({ ...c1(merged), ...c2(merged) })
  }

  private neededCalcs<T>(calculators: Array<Calculator<T>>, data: Update<T>): (merged: NewWithDefaults<T>) => Partial<Calculated<T>> {
    // eslint-disable-next-line unicorn/no-array-reduce -- TBD in separate branch
    return (merged: NewWithDefaults<T>): Partial<Calculated<T>> => calculators.filter((cs) => cs.condition(data)).reduce((acc, el) => ({ ...acc, ...el.calculation(merged) }), {})
  }
  // #endregion Generic

  // #region Runner
  async createRunner(data: New<Runner>): Promise<void> {
    const ref = this.db.collection(RUNNERS).doc()
    await this.saveNew(ref, {}, data, () => ({ languages: [] }))
  }
  // #endregion Runner

  // #region User
  async createUser(data: New<User>, id?: string): Promise<string> {
    const ref = id ? this.db.collection(USERS).doc(id) : this.db.collection(USERS).doc()
    return await this.saveNew(
      ref,
      DEFAULTS.userDefaults,
      data,
      this.composeCalcs(this.userCalcName, () => ({ courseIds: [], courseAndSectionIds: [], createdAt: this.FieldValue.serverTimestamp() }))
    )
  }

  // TODO Chaz: I don't like this; it saves hundreds of writes in the seeder, but it assumes users don't exist already
  async createUserWithCourseSections(data: New<User>, courseSections: { [courseId: string]: string }, id?: string): Promise<string> {
    const ref = id ? this.db.collection(USERS).doc(id) : this.db.collection(USERS).doc()
    return await this.saveNew(
      ref,
      DEFAULTS.userDefaults,
      data,
      this.composeCalcs(this.userCalcName, () => ({ courseIds: keys(courseSections), courseAndSectionIds: entries(courseSections).map(([courseId, sectionId]) => `${courseId}_${sectionId}`), createdAt: this.FieldValue.serverTimestamp() }))
    )
  }

  async createOrUpdateUserWithCourseSections(data: New<User>, courseSections: { [courseId: string]: string }, email: string): Promise<string> {
    const id = await this.db.collection(USERS_PRIVATE).where('email', '==', email).get().then(snapshot => snapshot.empty ? undefined : snapshot.docs[0].id)
    if (id === undefined) {
      const createdId = await this.createUserWithCourseSections(data, courseSections)
      await this.createUserPrivate(createdId, { email })
      return createdId
    }
    const courseIds = Object.keys(courseSections)
    const courseAndSectionIds = Object.entries(courseSections).map(([courseId, sectionId]) => `${courseId}_${sectionId}`)
    await this.db.collection(USERS).doc(id).update({
      courseIds: this.FieldValue.arrayUnion(...courseIds),
      courseAndSectionIds: this.FieldValue.arrayUnion(...courseAndSectionIds)
    })
    return id
  }

  async updateUser(id: string, data: Update<User>): Promise<unknown> {
    const ref = this.db.collection(USERS).doc(id)
    return await this.saveUpdate(ref, data, this.neededCalcs(this.userCalculators, data))
  }

  async followUser(followerId: string, followingId: string, follow = true): Promise<void> {
    const operation = follow ? this.FieldValue.arrayUnion : this.FieldValue.arrayRemove

    const batch = this.db.batch()
    batch.update(this.db.collection(USERS).doc(followerId), { followingIds: operation(followingId) })
    batch.update(this.db.collection(USERS).doc(followingId), { followerIds: operation(followerId) })
    await batch.commit()
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<void> {
    const resultsSnap = await this.db.collection(ACTIVITY_RESULTS).where(prop<ActivityResult>('userId'), '==', id).get()

    const batch = this.db.batch()

    const update: UpdateComplete<User> = { avatarUrl }
    batch.set(this.db.collection(USERS).doc(id), update, { merge: true })

    resultsSnap.docs.forEach((doc) => {
      const ref = this.db.collection(ACTIVITY_RESULTS).doc(doc.id)
      const data: UpdateComplete<ActivityResult> = { userAvatarUrl: avatarUrl }
      batch.set(ref, data, { merge: true })
    })

    await batch.commit()
  }

  async createUserPrivate(id: string, data: New<UserPrivate>): Promise<unknown> {
    const complete: NewComplete<UserPrivate> = { ...DEFAULTS.userPrivateDefaults, ...data, notificationsSocialLastViewed: this.FieldValue.serverTimestamp(), notificationsStudyLastViewed: this.FieldValue.serverTimestamp() }
    return await this.db.collection(USERS_PRIVATE).doc(id).set(complete, { merge: true })
  }

  async updateUserPrivate(id: string, data: Update<UserPrivate>): Promise<unknown> {
    return await this.db.collection(USERS_PRIVATE).doc(id).set(data, { merge: true })
  }

  async readNotificationsSocial(id: string): Promise<unknown> {
    const data: UpdateComplete<UserPrivate> = { notificationsSocialLastViewed: this.FieldValue.serverTimestamp() }
    return await this.db.collection(USERS_PRIVATE).doc(id).set(data, { merge: true })
  }

  async readNotificationsStudy(id: string): Promise<unknown> {
    const data: UpdateComplete<UserPrivate> = { notificationsStudyLastViewed: this.FieldValue.serverTimestamp() }
    return await this.db.collection(USERS_PRIVATE).doc(id).set(data, { merge: true })
  }

  private userCalcName(merged: NewWithDefaults<User>): Pick<User, 'name'> {
    return { name: `${merged.nameFirst} ${merged.nameLast}` }
  }

  userCalculators: Array<Calculator<User>> = [
    { calculation: this.userCalcName, condition: (data): boolean => !!data.nameFirst || !!data.nameLast }
  ]
  // #endregion User

  // #region Course
  async createCourse(data: New<Course>): Promise<string> {
    const ref = this.db.collection(COURSES).doc()
    return await this.saveNew(ref, DEFAULTS.courseDefaults, data, this.composeCalcs(this.courseCalcSlugYearSem, this.courseCalcRoles))
  }

  async updateCourse(id: string, data: Update<Course>): Promise<void> {
    const ref = this.db.collection(COURSES).doc(id)
    await this.saveUpdate(ref, data, this.neededCalcs(this.courseCalculators, data), !!data.ownerIds || !!data.editorIds)
  }

  private courseCalcSlugYearSem(merged: NewWithDefaults<Course>): Pick<Course, 'slug' | 'yearSem'> {
    return {
      slug: `${merged.code}-${merged.year.toString().slice(-2)}s${merged.semester}`,
      yearSem: Number.parseInt(`${merged.year}${merged.semester.toString().padStart(2, '0')}`)
    }
  }

  private courseCalcRoles(merged: NewWithDefaults<Course>): Pick<Course, 'roleEdit' | 'roleView'> {
    const studentIds = values(merged.sections).flatMap((section) => section?.studentIds ?? [])
    return {
      roleEdit: [...new Set([...merged.ownerIds, ...merged.editorIds])],
      roleView: [...new Set([...merged.ownerIds, ...merged.editorIds, ...studentIds])]
    }
  }

  courseCalculators: Array<Calculator<Course>> = [
    { calculation: this.courseCalcSlugYearSem, condition: (data): boolean => 'code' in data || 'year' in data || 'semester' in data },
    { calculation: this.courseCalcRoles, condition: (data): boolean => !!data.ownerIds || !!data.editorIds }
  ]
  // #endregion Course

  // #region Activity
  async createActivity(courseId: string, data: New<CourseActivity>): Promise<string> {
    return await this.db.runTransaction(async (t) => {
      // Read Course (to get RBAC)
      const courseRef = this.db.collection(COURSES).doc(courseId)
      const courseSnap = await t.get(courseRef)
      const course = courseSnap.data() as DeepRequired<Course> | undefined
      if (!course) throw new Error('Course does not exist')

      // CourseActivity
      const activityMerged = { ...DEFAULTS.courseActivityDefaults, ...data }
      const activityComplete = { ...activityMerged, ...this.courseActivityCalcSlug(activityMerged) }
      const activityId = this.getGuid()

      const courseUpdate: UpdateComplete<Course> = mapKeys(activityComplete, (_value, key) => `activities.${activityId}.${key}`)
      t.update(courseRef, courseUpdate)

      // ActivityProblemSet
      const aps: NewComplete<ActivityProblemSet> = {
        courseId: courseId,
        activitySlug: activityComplete.slug,
        problems: {},
        roleSubmit: course.roleEdit, // Just teachers in DRAFT
        roleView: course.roleView
      }

      const apsRef = this.db.collection(ACTIVITY_PROBLEM_SETS).doc(activityId)
      t.set(apsRef, aps, { merge: true })

      return activityId
    })
  }

  // TODO Chaz: We could probably also write a generic method for creating/updating child data
  async updateActivity(courseId: string, activityId: string, data: Update<CourseActivity>): Promise<unknown> {
    const complete = data.name ? { ...data, ...this.courseActivityCalcSlug({ name: data.name }) } : data

    const courseUpdate: UpdateComplete<Course> = mapKeys(complete, (_value, key) => `activities.${activityId}.${key}`)
    const courseRef = this.db.collection(COURSES).doc(courseId)
    return courseRef.update(courseUpdate)
  }

  private courseActivityCalcSlug(merged: Pick<CourseActivity, 'name'>): Pick<CourseActivity, 'slug'> {
    return {
      slug: urlify(merged.name)
    }
  }
  // #endregion Activity

  // #region Problem
  async createProblems(activityId: string, problems: Array<New<Problem>>): Promise<void> {
    const problemSetParts = problems.map((data) => {
      const complete: NewComplete<Problem> = { ...DEFAULTS.problemDefaults, ...data }
      const problemId = this.getGuid()
      return mapKeys(complete, (_value, key) => `problems.${problemId}.${key}`)
    })

    const apsUpdate: UpdateComplete<ActivityProblemSet> = Object.assign({}, ...problemSetParts) // multiple-object merge
    const apsRef = this.db.collection(ACTIVITY_PROBLEM_SETS).doc(activityId)
    await apsRef.update(apsUpdate)
  }

  async createProblem(activityId: string, data: New<Problem>): Promise<string> {
    const complete: NewComplete<Problem> = { ...DEFAULTS.problemDefaults, ...data }
    const problemId = this.getGuid()

    const apsUpdate: UpdateComplete<ActivityProblemSet> = mapKeys(complete, (_value, key) => `problems.${problemId}.${key}`)
    const apsRef = this.db.collection(ACTIVITY_PROBLEM_SETS).doc(activityId)
    await apsRef.update(apsUpdate)
    return problemId
  }

  async updateProblem(activityId: string, problemId: string, data: Update<Problem>): Promise<unknown> {
    const apsUpdate: UpdateComplete<ActivityProblemSet> = mapKeys(data, (_value, key) => `problems.${problemId}.${key}`)
    const apsRef = this.db.collection(ACTIVITY_PROBLEM_SETS).doc(activityId)
    return apsRef.update(apsUpdate)
  }
  // #endregion Problem

  // #region Test
  // TODO Chaz: This is very similar to newProblem / updateProblem (could be extracted to a generic version)
  async createTest(activityId: string, problemId: string, data: New<Test>): Promise<string> {
    const complete: NewComplete<Test> = { ...DEFAULTS.testDefaults, ...data }
    const testId = this.getGuid()

    const apsUpdate: UpdateComplete<ActivityProblemSet> = mapKeys(complete, (_value, key) => `problems.${problemId}.tests.${testId}.${key}`)
    const apsRef = this.db.collection(ACTIVITY_PROBLEM_SETS).doc(activityId)
    await apsRef.update(apsUpdate)
    return testId
  }

  async updateTest(activityId: string, problemId: string, testId: string, data: Update<Test>): Promise<unknown> {
    const apsUpdate: UpdateComplete<ActivityProblemSet> = mapKeys(data, (_value, key) => `problems.${problemId}.tests.${testId}.${key}`)
    const apsRef = this.db.collection(ACTIVITY_PROBLEM_SETS).doc(activityId)
    return apsRef.update(apsUpdate)
  }

  async deleteTest(activityId: string, problemId: string, testId: string): Promise<void> {
    const apsUpdate: UpdateComplete<ActivityProblemSet> = {
      [`problems.${problemId}.tests.${testId}`]: this.FieldValue.delete()
    }
    // TODO: Also update seqs for latter tests
    const apsRef = this.db.collection(ACTIVITY_PROBLEM_SETS).doc(activityId)
    return await apsRef.update(apsUpdate)
  }
  // #endregion Test

  // #region ProblemResult & SubmissionJob
  async createSubmission(courseId: string, activityId: string, userId: string, data: New<ProblemResult>): Promise<string> {
    return await this.db.runTransaction(async (t) => {
      // ProblemResult
      const mergedProblemResult: NewWithDefaults<ProblemResult> = { ...DEFAULTS.problemResultDefaults, ...data }
      const completeProblemResult: NewComplete<ProblemResult> = { ...mergedProblemResult, date: this.FieldValue.serverTimestamp(), status: ProblemResultStatus.Evaluating, errorOutput: '', percent: 0, isFirstBest: false, testResults: [], testCount: 0, passCount: 0, failCount: 0 }
      const problemResultId = this.getGuid()

      // ActivityResult
      const activityResultId = this.calcActivityResultId(activityId, userId)
      const activityResultRef = this.db.collection(ACTIVITY_RESULTS).doc(activityResultId)
      const activityResultSnap = await t.get(activityResultRef)
      const activityResult = activityResultSnap.data() as NewComplete<ActivityResult> | undefined
      if (activityResult) {
        // Just merge PR
        const activityResultUpdate: UpdateComplete<ActivityResult> = mapKeys(completeProblemResult, (_value, key) => `problemResults.${problemResultId}.${key}`)
        t.update(activityResultRef, activityResultUpdate)
      } else {
        // Get the user's name & course-section
        const userSnap = await t.get(this.db.collection(USERS).doc(userId))
        const user = userSnap.data() as DeepRequired<User> | undefined
        if (!user) throw new Error('User does not exist')

        // Find courseSectionId (or empty for teachers/TAs)
        const courseAndSectionId = user.courseAndSectionIds.find((csid) => csid.startsWith(courseId)) ?? ''

        // New AR including PR
        const activityResultNew: NewComplete<ActivityResult> = { ...DEFAULTS.activityResultDefaults, userId, userName: user.name, userAvatarUrl: user.avatarUrl, activityId, courseId, courseAndSectionId, problemResults: { [problemResultId]: completeProblemResult }, totalScore: 0, totalPercent: 0, isComplete: false, lastImprovement: this.FieldValue.serverTimestamp() }
        t.set(activityResultRef, activityResultNew, { merge: true })
      }

      // SubmissionJob
      const submissionJob: NewComplete<SubmissionJob> = {
        activityId,
        problemId: completeProblemResult.problemId,
        userId,
        activityResultId,
        problemResultId,
        originalDate: this.FieldValue.serverTimestamp(),
        language: completeProblemResult.language,
        fileRefs: completeProblemResult.fileRefs
      }
      const submissionRef = this.db.collection(SUBMISSION_JOBS).doc()
      t.set(submissionRef, submissionJob)

      return problemResultId
    })
  }

  private calcActivityResultId(activityId: string, userId: string): string {
    return `${activityId}_${userId}`
  }
  // #endregion ProblemResult & SubmissionJob
}
