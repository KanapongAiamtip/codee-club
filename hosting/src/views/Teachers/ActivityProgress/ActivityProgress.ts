import { DeepRequired } from 'ts-essentials'
import Vue from 'vue'
import Component from 'vue-class-component'

import { ACTIVITY_PROBLEM_SETS, ACTIVITY_RESULTS, ActivityProblemSet, ActivityResult, Course, CourseActivity, CourseSection, User, USERS, VueFire } from '@codee-club/common/dist/dao'
import { entries, keys, length, values } from '@codee-club/common/dist/utils/object-extensions'

import { NotFound } from '@/views'
import { cssClass } from '~/themes'

class StudentAndResult {
  code: string
  name: string
  totalPercent: number
  lastSub: Date | undefined
  lastImp: Date | undefined
  percentProbs: { [percentN: string]: number }

  constructor(activity: VueFire<ActivityProblemSet> | null, student: VueFire<User>, result: VueFire<ActivityResult> | undefined) {
    this.code = student.code
    this.name = student.name
    this.totalPercent = result?.totalPercent ?? 0

    const bestResults = values(result?.problemResults)?.filter((pr) => pr.isFirstBest)
    const problemsToSeq: Map<string, number> = new Map(entries(activity?.problems)?.map(([key, value]) => [key, value.seq ?? -1]))

    this.lastSub =
      bestResults.length === 0
        ? undefined
        : values(result?.problemResults)
          ?.sort((pr1, pr2) => pr2.date.seconds - pr1.date.seconds)?.[0]
          .date.toDate()

    this.lastImp =
      bestResults.length === 0
        ? undefined
        : bestResults?.sort((pr1, pr2) => pr2.date.seconds - pr1.date.seconds)?.[0].date.toDate()

    const percentProbsEmpty: { [percentN: string]: number } = {}
    this.percentProbs =
      bestResults?.reduce((acc, pr) => { // eslint-disable-line unicorn/no-array-reduce -- TBD in separate branch
        acc[problemsToSeq.get(pr.problemId) ?? -1] = pr.percent
        return acc
      }, percentProbsEmpty) ?? percentProbsEmpty
  }
}

@Component({
  metaInfo(this: ActivityProgress) {
    return {}
  },
  components: { NotFound }
})
export default class ActivityProgress extends Vue {
  sectionIndex = -1
  students: Array<VueFire<User>> = []
  problemSet: VueFire<ActivityProblemSet> | null = null
  results: Array<VueFire<ActivityResult>> = []

  // TODO Ant - not actually using the activity loading status yet
  // TODO Need a consistent way of doing loading across the app
  loading: { results: boolean, activity: boolean } = { results: true, activity: true }

  async mounted(): Promise<void> {
    if (this.activityId) {
      await Promise.all([
        this.$bind('students', this.$db.collection(USERS).where('courseIds', 'array-contains', this.course.id)),
        this.$bind('problemSet', this.$db.collection(ACTIVITY_PROBLEM_SETS).doc(this.activityId)).then(() => { this.loading.activity = false }),
        this.$bind('results', this.$db.collection(ACTIVITY_RESULTS).where('activityId', '==', this.activityId)).then(() => { this.loading.results = false })
      ])
    }
  }

  get course(): VueFire<Course> {
    return this.$store.getters.findCourseBySlug(this.$route.params.courseSlug)
  }

  get themeCssClass(): string {
    return cssClass(this.course.theme)
  }

  get activityId(): string | undefined {
    const activitySlug = this.$route.params.activitySlug
    return keys(this.course.activities).find(id => this.course.activities[id].slug === activitySlug)
  }

  get activity(): DeepRequired<CourseActivity> | undefined {
    return this.activityId ? this.course.activities[this.activityId] : undefined
  }

  get sectionsSorted(): CourseSection[] {
    return values(this.course.sections).sort((s1, s2) => s1.code.localeCompare(s2.code))
  }

  get sectionCount(): number {
    return length(this.course.sections)
  }

  get section(): CourseSection {
    return this.sectionIndex === -1 ? { code: 'ALL', studentIds: [] } : this.sectionsSorted[this.sectionIndex]
  }

  get studentsForSection(): Array<VueFire<User>> {
    return this.sectionIndex === -1 ? this.students : this.students.filter((student) => this.section.studentIds?.includes(student.id))
  }

  get resultsKeyed(): Map<string, VueFire<ActivityResult>> {
    return new Map(this.results.map((result) => [result.userId, result]))
  }

  get studentsAndResults(): StudentAndResult[] {
    if (this.problemSet === null || this.resultsKeyed.size === 0) {
      return []
    }
    return this.studentsForSection
      .map((student) => (new StudentAndResult(this.problemSet, student, this.resultsKeyed.get(student.id))))
  }

  get problemsLength(): number {
    return length(this.problemSet?.problems)
  }

  incSection(): void {
    if (this.sectionIndex === this.sectionCount - 1) this.sectionIndex = -1
    else this.sectionIndex += 1
  }

  decSection(): void {
    if (this.sectionIndex === -1) this.sectionIndex = this.sectionCount - 1
    else this.sectionIndex -= 1
  }
}
