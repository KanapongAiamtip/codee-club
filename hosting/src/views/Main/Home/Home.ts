import groupBy from 'lodash/groupBy'
import keyBy from 'lodash/keyBy'
import Vue from 'vue'
import Component from 'vue-class-component'

import { ActivityResult, Course, User, VueFire } from '@codee-club/common/dist/dao'
import { values } from '@codee-club/common/dist/utils/object-extensions'

import HomeCourse from './HomeCourse/HomeCourse.vue'
import Landing from './Landing/Landing.vue'
import Statistics from './Statistics/Statistics.vue'

@Component({ components: { HomeCourse, Landing, Statistics } })
export default class Home extends Vue {
  get user(): VueFire<User> {
    return this.$store.state.currentUser
  }

  get coursesBySemester(): Array<{ yearSem: number, year: number, semester: number, courses: Array<VueFire<Course>> }> {
    const grouped = groupBy(this.$store.state.myCourses, (c) => c.yearSem) as { [yearSem: number]: Array<VueFire<Course>> }
    return values(grouped)
      .map((groupOfCourses) => {
        const { yearSem, year, semester } = groupOfCourses[0]
        return { yearSem, year, semester, courses: groupOfCourses }
      })
      .sort((a, b) => b.yearSem - a.yearSem)
  }

  get keyedResults(): { [activityId: string]: VueFire<ActivityResult> } {
    const myResults: Array<VueFire<ActivityResult>> = this.$store.state.myResults
    return keyBy(myResults, 'activityId')
  }
}
