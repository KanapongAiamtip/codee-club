import firebase from 'firebase/app'
import keyBy from 'lodash/keyBy'
import mapValues from 'lodash/mapValues'
import Vue from 'vue'
import Component from 'vue-class-component'

import { ACTIVITY_RESULTS, ActivityResult, Course, CourseActivity, User, VueFire } from '@codee-club/common/dist/dao'
import { ActivityStatus } from '@codee-club/common/dist/data-types/enums'
import { valuesWithIds } from '@codee-club/common/dist/utils/object-extensions'

import Routes from '@/router/routes'
import { NotFound } from '@/views'
import { cssClass } from '~/themes'

@Component({
  metaInfo(this: CourseView) {
    return this.course === undefined ? {} : { title: this.course.name }
  },
  components: { NotFound }
})
export default class CourseView extends Vue {
  activityResults: Array<VueFire<ActivityResult>> = []

  loadingResults = true

  async mounted(): Promise<void> {
    if (this.course === undefined) {
      await this.$router.push({ name: Routes.MainHome })
      return
    }
    await this.$bind('activityResults', this.$db.collection(ACTIVITY_RESULTS).where('userId', '==', this.user.id).where('courseId', '==', this.course.id)).then(() => (this.loadingResults = false))
  }

  get user(): VueFire<User> {
    return this.$store.state.currentUser
  }

  get course(): VueFire<Course> | undefined {
    return this.$store.getters.findCourseBySlug(this.$route.params.courseSlug)
  }

  get themeCssClass(): string {
    return cssClass(this.course?.theme)
  }

  get activities(): Array<VueFire<CourseActivity>> {
    const isEditor = this.course?.roleEdit.includes(this.user.id) ?? false
    return valuesWithIds(this.course?.activities)
      ?.filter((a) => isEditor || a.status === ActivityStatus.Published || a.status === ActivityStatus.Locked)
      .sort((p1, p2) => p1.seq - p2.seq)
  }

  get activityResultsKeyed(): { [activityId: string]: ActivityResult } {
    return keyBy(this.activityResults, 'activityId')
  }

  get deadlinesKeyed(): { [activityId: string]: firebase.firestore.Timestamp } {
    const course = this.course
    if (course === undefined) return {}

    // Get section
    const user: VueFire<User> = this.user
    const sectionId = user.courseAndSectionIds.find((cs) => cs.startsWith(course.id))?.split('_')[1]
    if (sectionId === undefined) return {}

    // Get deadlines for section
    return mapValues(this.course?.activities, (activity) => activity?.deadlines[sectionId])
  }
}
