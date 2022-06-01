import { DeepRequired } from 'ts-essentials'

import { ActivityResult, ConfigLanguages, Course, User, UserPrivate, VueFire } from '@codee-club/common/dist/dao'

export interface CodeeVuexState {
  configLanguages: DeepRequired<ConfigLanguages> | null
  currentUser: VueFire<User> | null
  currentUserPrivate: VueFire<UserPrivate> | null
  myCourses: Array<VueFire<Course>>
  myResults: Array<VueFire<ActivityResult>>
}

export const GETTERS = {
  findCourseByUid: 'findCourseByUid'
}

export const ACTIONS = {
  userChanged: 'userChanged'
}
