import { CourseActivity, New, Problem } from '@codee-club/common/dist/dao'

export interface ActivityAndProblems {
  activity: New<CourseActivity>
  problems: Array<New<Problem>>
  deadline: string
}
