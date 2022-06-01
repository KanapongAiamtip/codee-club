import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import { ActivityResult, Course, CourseActivity, VueFire } from '@codee-club/common/dist/dao'
import { ActivityStatus } from '@codee-club/common/dist/data-types/enums'
import { valuesWithIds } from '@codee-club/common/dist/utils/object-extensions'

import { cssClass, iconName } from '~/themes'

@Component
export default class HomeCourse extends Vue {
  @Prop() course!: VueFire<Course>
  @Prop() keyedResults!: { [activityId: string]: VueFire<ActivityResult> }

  get themeIcon(): string {
    return iconName(this.course.theme)
  }

  get themeCssClass(): string {
    return cssClass(this.course.theme)
  }

  get activities(): Array<VueFire<CourseActivity>> {
    const course: VueFire<Course> = this.$props.course
    const activities = course.activities
    return valuesWithIds(activities)
      .filter((a) => a.status === ActivityStatus.Published || a.status === ActivityStatus.Locked)
      .sort((a1, a2) => a1.seq - a2.seq)
  }
}
