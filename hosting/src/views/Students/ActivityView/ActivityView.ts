import firebase from 'firebase/app'
import cloneDeep from 'lodash/cloneDeep'
import keyBy from 'lodash/keyBy'
import Vue from 'vue'
import Component from 'vue-class-component'

import { ACTIVITY_PROBLEM_SETS, ACTIVITY_RESULTS, ActivityProblemSet, ActivityResult, Course, CourseActivity, Problem, ProblemResult, User, VueFire } from '@codee-club/common/dist/dao'
import { entries, values, valuesWithIds } from '@codee-club/common/dist/utils/object-extensions'

import { NotFound } from '@/views'
import { cssClass } from '~/themes'

const LEADERBOARD_SIZE = 10

@Component({
  metaInfo(this: ActivityView) {
    return this.activity ? { title: this.activity.name } : {}
  },
  components: { NotFound }
})
export default class ActivityView extends Vue {
  activityProblemSet: VueFire<ActivityProblemSet> | null = null
  activityResults: Array<VueFire<ActivityResult>> = []

  loadingActivity = true
  loadingResults = true
  activeLeaderboardTab = 1

  async mounted(): Promise<void> {
    if (this.activity) {
      await Promise.all([
        this.$bind('activityProblemSet', this.$db.collection(ACTIVITY_PROBLEM_SETS).doc(this.activity.id)).then(() => (this.loadingActivity = false)),
        this.$bind('activityResults', this.$db.collection(ACTIVITY_RESULTS).where('activityId', '==', this.activity.id)).then(() => (this.loadingResults = false))
      ])
    }
  }

  get user(): VueFire<User> {
    return this.$store.state.currentUser
  }

  get sectionId(): string | undefined {
    return this.user.courseAndSectionIds.find((cs) => cs.startsWith(this.course.id))?.split('_')[1]
  }

  get course(): VueFire<Course> {
    return this.$store.getters.findCourseBySlug(this.$route.params.courseSlug)
  }

  get themeCssClass(): string {
    return cssClass(this.course.theme)
  }

  // TODO Ant - I think this is making unnecessary calls to get course twice when we could search for the activity in the course
  get activity(): VueFire<CourseActivity> | undefined {
    return this.$store.getters.findActivityBySlugs(this.$route.params.courseSlug, this.$route.params.activitySlug)
  }

  get deadline(): firebase.firestore.Timestamp | undefined {
    const sectionId = this.sectionId
    if (!sectionId) return

    return entries(this.activity?.deadlines).find(([key, _value]) => key === sectionId)?.[1]
  }

  get problemsSorted(): Array<VueFire<Problem>> {
    return valuesWithIds(this.activityProblemSet?.problems)?.sort((p1, p2) => p1.seq - p2.seq)
  }

  private get activityResultsSorted(): Array<VueFire<ActivityResult>> {
    return this.activityResults.sort((ar1, ar2) => (ar2.totalPercent !== ar1.totalPercent ? ar2.totalPercent - ar1.totalPercent : ar1.lastImprovement.seconds - ar2.lastImprovement.seconds))
  }

  private get activityResultsGlobal(): Array<VueFire<ActivityResult & { rank: number }>> {
    const ignoredIds = new Set([...this.course.editorIds, ...this.course.ownerIds])
    // Without the deep clone the array contents is mutated causing incorrect ranking numbers
    return cloneDeep(this.activityResultsSorted.filter((ar) => !ignoredIds.has(ar.userId))).map((ar, index) => ({ ...ar, rank: index + 1 }))
  }

  private get activityResultsSection(): Array<VueFire<ActivityResult & { rank: number }>> {
    const myCourseSectionId = this.user.courseAndSectionIds.find((csid) => csid.startsWith(this.course.id)) ?? ''
    return cloneDeep(this.activityResultsSorted.filter((ar) => ar.courseAndSectionId === myCourseSectionId)).map((ar, index) => ({ ...ar, rank: index + 1 }))
  }

  private get activityResultsFriends(): Array<VueFire<ActivityResult & { rank: number }>> {
    return cloneDeep(this.activityResultsSorted.filter((ar) => this.user.id === ar.userId || this.user.followingIds.includes(ar.userId))).map((ar, index) => ({ ...ar, rank: index + 1 }))
  }

  get myActivityResult(): VueFire<ActivityResult> | undefined {
    const myResults = this.activityResults.filter((ar) => ar.userId === this.user.id)
    return myResults.length > 0 ? myResults[0] : undefined
  }

  get myBestProblemResultsKeyed(): { [problemId: string]: ProblemResult } {
    const myBestProblemResults = values(this.myActivityResult?.problemResults).filter((pr) => pr.isFirstBest)
    return keyBy(myBestProblemResults, 'problemId')
  }

  private get myActivityResultGlobal(): VueFire<ActivityResult & { rank: number }> | undefined {
    return this.activityResultsGlobal.find((ar) => ar.userId === this.user.id)
  }

  private get myActivityResultSection(): VueFire<ActivityResult & { rank: number }> | undefined {
    return this.activityResultsSection.find((ar) => ar.userId === this.user.id)
  }

  private get myActivityResultFriends(): VueFire<ActivityResult & { rank: number }> | undefined {
    return this.activityResultsFriends.find((ar) => ar.userId === this.user.id)
  }

  get leaderboards(): Array<{ data: Array<VueFire<ActivityResult & { rank: number }>>, myActivityResult: VueFire<ActivityResult & { rank: number }> | undefined, label: string, icon: string }> {
    const topGlobal = this.activityResultsGlobal.slice(0, LEADERBOARD_SIZE)
    const topSection = this.activityResultsSection.slice(0, LEADERBOARD_SIZE)
    const topFriends = this.activityResultsFriends.slice(0, LEADERBOARD_SIZE)
    return [
      { data: topGlobal, myActivityResult: this.myActivityResultGlobal, label: 'Global', icon: 'earth' },
      { data: topSection, myActivityResult: this.myActivityResultSection, label: 'Section', icon: 'briefcase' },
      { data: topFriends, myActivityResult: this.myActivityResultFriends, label: 'Friends', icon: 'account-multiple' }
    ]
  }

  get leaderboardSize(): number {
    return LEADERBOARD_SIZE
  }
}
