import firebase from 'firebase/app';
import { ActivityStatus, ProblemResultStatus, TestResultStatus, TestVisibility } from '../data-types/enums';
import { Notification } from '../notifications';
declare type Timestamp = firebase.firestore.Timestamp;
export interface User {
    nameFirst: string;
    nameLast: string;
    readonly name: string;
    code?: string;
    avatarUrl?: string;
    bio?: string;
    links?: {
        [network: string]: string;
    };
    followingIds?: string[];
    followerIds?: string[];
    readonly courseIds: string[];
    readonly courseAndSectionIds: string[];
    readonly createdAt: Timestamp;
    roles?: string[];
}
export interface UserPrivate {
    email?: string;
    nuConnectToken?: unknown;
    notifications?: Notification[];
    readonly notificationsSocialLastViewed: Timestamp;
    readonly notificationsStudyLastViewed: Timestamp;
}
export interface CourseSection {
    code: string;
    studentIds?: string[];
}
export interface CourseActivity {
    readonly slug: string;
    seq: number;
    name: string;
    status?: ActivityStatus;
    sectionIds?: string[];
    deadlines: {
        [sectionId: string]: Timestamp;
    };
}
export interface Course {
    readonly slug: string;
    readonly yearSem: number;
    code: string;
    name?: string;
    year: number;
    semester: number;
    sections?: {
        [id: string]: CourseSection;
    };
    activities?: {
        [id: string]: CourseActivity;
    };
    theme?: string;
    allowedLanguages?: string[];
    ownerIds: string[];
    editorIds?: string[];
    readonly roleView: string[];
    readonly roleEdit: string[];
}
export interface Test {
    seq?: number;
    input?: string;
    expected?: string;
    visibility?: TestVisibility;
}
export interface Problem {
    seq?: number;
    name?: string;
    description?: string;
    tests?: {
        [id: string]: Test;
    };
}
export interface ActivityProblemSet {
    courseId: string;
    readonly activitySlug: string;
    problems?: {
        [id: string]: Problem;
    };
    readonly roleSubmit: string[];
    readonly roleView: string[];
}
export interface TestResult {
    readonly testId: string;
    status: TestResultStatus;
    actual: string;
    error: string;
}
export interface ProblemResult {
    problemId: string;
    readonly date: Timestamp;
    language: string;
    fileRefs: string[];
    readonly status: ProblemResultStatus;
    readonly errorOutput: string;
    readonly percent: number;
    readonly isFirstBest: boolean;
    readonly testResults: TestResult[];
    readonly testCount: number;
    readonly passCount: number;
    readonly failCount: number;
}
export interface ActivityResult {
    readonly userId: string;
    readonly userName: string;
    readonly userAvatarUrl: string;
    readonly activityId: string;
    readonly courseId: string;
    readonly courseAndSectionId: string;
    readonly totalScore: number;
    readonly totalPercent: number;
    readonly isComplete: boolean;
    readonly lastImprovement: Timestamp;
    problemResults?: {
        [id: string]: ProblemResult;
    };
}
export interface SubmissionJob {
    readonly activityId: string;
    readonly problemId: string;
    readonly userId: string;
    readonly activityResultId: string;
    readonly problemResultId: string;
    readonly originalDate: Timestamp;
    readonly language: string;
    readonly fileRefs: string[];
}
export interface Invite {
    sectionGuids?: string[];
}
export interface RunnerLanguage {
    name: string;
    version: string;
    path: string;
}
export interface Runner {
    url: string;
    readonly languages: RunnerLanguage[];
}
export interface ConfigLanguage {
    name: string;
    version: string;
    label: string;
    url: string;
}
export interface ConfigLanguages {
    [key: string]: ConfigLanguage;
}
export interface ConfigStatistics {
    members: number;
    submissionSuccesses: number;
    submissionCompileFailures: number;
    submissionTestFailures: number;
}
export {};
//# sourceMappingURL=types.d.ts.map