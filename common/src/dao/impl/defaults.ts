import { ActivityStatus, TestVisibility } from '../../data-types/enums'
import { ActivityResult, Course, CourseActivity, CourseSection, Problem, ProblemResult, Test, User, UserPrivate } from '../types'

import { Defaults } from './dao-types'

export const userDefaults: Defaults<User> = {
  code: '',
  bio: '',
  avatarUrl: '',
  links: {},
  followingIds: [],
  followerIds: [],
  roles: []
}

export const userPrivateDefaults: Defaults<UserPrivate> = {
  email: '',
  nuConnectToken: {},
  notifications: []
}

export const courseDefaults: Defaults<Course> = {
  name: 'New Course',
  sections: {},
  activities: {},
  editorIds: [],
  theme: '',
  allowedLanguages: []
}

export const courseSectionDefaults: Defaults<CourseSection> = {
  studentIds: []
}

export const courseActivityDefaults: Defaults<CourseActivity> = {
  status: ActivityStatus.Draft,
  sectionIds: []
}

export const problemDefaults: Defaults<Problem> = {
  seq: 100,
  name: 'New problem',
  description: '',
  tests: {}
}

export const testDefaults: Defaults<Test> = {
  seq: 100,
  input: '',
  expected: '',
  visibility: TestVisibility.Visible
}

export const activityResultDefaults: Defaults<ActivityResult> = {
  problemResults: {}
}

export const problemResultDefaults: Defaults<ProblemResult> = {}
