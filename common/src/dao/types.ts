import firebase from 'firebase/app'

import { ActivityStatus, ProblemResultStatus, TestResultStatus, TestVisibility } from '../data-types/enums'
import { Notification } from '../notifications'

type Timestamp = firebase.firestore.Timestamp

/**
 * Types of property
 *   readonly  = managed by the DAO (calculated or set in conjunction with other fields)
 *   ?:        = optional during creation (default value used if not provided)
 *   other     = must be explicitly set at creation
 *
 * Note: all properties are optional during update (readonly are still managed by DAO)
 */

// ID = GUID (from Auth)
export interface User {
  nameFirst: string
  nameLast: string
  readonly name: string // Charles Allen :: ${nameFirst} ${nameLast}
  code?: string // 60123123 (optional)
  avatarUrl?: string
  bio?: string
  links?: { [network: string]: string } // github, linkedin, facebook
  followingIds?: string[] // users who I am following
  followerIds?: string[] // users who follow me
  readonly courseIds: string[] // to get users in a course
  readonly courseAndSectionIds: string[] // to get users in a section
  readonly createdAt: Timestamp
  roles?: string[] // TODO: This should be readonly (seeder should call custom DAO method)
}

export interface UserPrivate {
  email?: string // TODO: Shouldn't this be required?
  nuConnectToken?: unknown
  notifications?: Notification[]
  readonly notificationsSocialLastViewed: Timestamp
  readonly notificationsStudyLastViewed: Timestamp
}

// ID = GUID
export interface CourseSection {
  code: string
  studentIds?: string[]
}

// ID = GUID
export interface CourseActivity {
  readonly slug: string
  seq: number
  name: string
  status?: ActivityStatus
  sectionIds?: string[]
  deadlines: { [sectionId: string]: Timestamp }
}

// ID = GUID
export interface Course { // TODO: Why doesn't Course have `status`?
  readonly slug: string // 231374-19s2 :: ${code}-${year.toString().slice(-2)}s${semester}
  readonly yearSem: number // 201902 :: year & semester (for sorting)
  code: string // 231374
  name?: string // Concurrent & Functional Programming
  year: number // 2019
  semester: number // 2
  sections?: { [id: string]: CourseSection }
  activities?: { [id: string]: CourseActivity }
  theme?: string
  allowedLanguages?: string[]
  // RBAC
  ownerIds: string[]
  editorIds?: string[]
  readonly roleView: string[]
  readonly roleEdit: string[]
}

// ID = GUID
// TODO Chaz: We might want to store secret tests in a private collection
export interface Test {
  seq?: number
  input?: string
  expected?: string
  visibility?: TestVisibility
}

// ID = GUID
export interface Problem {
  seq?: number
  name?: string
  description?: string
  tests?: { [id: string]: Test }
}

// ID = activityId
export interface ActivityProblemSet {
  courseId: string
  readonly activitySlug: string
  problems?: { [id: string]: Problem }
  // RBAC
  readonly roleSubmit: string[]
  readonly roleView: string[]
}

export interface TestResult {
  readonly testId: string
  status: TestResultStatus
  actual: string
  error: string
}

// ID = GUID
// TODO Chaz: Maybe add problem weights
export interface ProblemResult {
  problemId: string
  readonly date: Timestamp
  language: string
  fileRefs: string[]
  readonly status: ProblemResultStatus
  readonly errorOutput: string
  readonly percent: number // aggregate of TestResults
  readonly isFirstBest: boolean // for leaderboards
  readonly testResults: TestResult[]
  readonly testCount: number
  readonly passCount: number
  readonly failCount: number
}

// ID = activityId_userId
export interface ActivityResult {
  readonly userId: string
  readonly userName: string
  readonly userAvatarUrl: string
  readonly activityId: string
  readonly courseId: string
  readonly courseAndSectionId: string
  readonly totalScore: number
  readonly totalPercent: number
  readonly isComplete: boolean // to aid multi-column sorting
  readonly lastImprovement: Timestamp
  problemResults?: { [id: string]: ProblemResult } // must set via DAO
}

export interface SubmissionJob {
  readonly activityId: string
  readonly problemId: string
  readonly userId: string
  readonly activityResultId: string
  readonly problemResultId: string
  readonly originalDate: Timestamp
  readonly language: string
  readonly fileRefs: string[]
}

/**
 * Keyed by user's email
 */
export interface Invite {
  sectionGuids?: string[]
}

export interface RunnerLanguage {
  name: string // java, kotlin
  version: string // 15, 1.4
  path: string // /java, /kotlin14
}

export interface Runner {
  url: string
  readonly languages: RunnerLanguage[]
}

export interface ConfigLanguage {
  name: string
  version: string
  label: string
  url: string
}

export interface ConfigLanguages {
  [key: string]: ConfigLanguage
}

export interface ConfigStatistics {
  members: number
  submissionSuccesses: number
  submissionCompileFailures: number
  submissionTestFailures: number
}
