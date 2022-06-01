import { CodeeContext } from '../../context';
import { Course, CourseActivity, Problem, ProblemResult, Runner, Test, User, UserPrivate } from '../types';
import { Calculated, New, NewWithDefaults, Update } from './dao-types';
import 'core-js/features/array/flat-map';
export { New, Update } from './dao-types';
interface Calculator<T> {
    condition: (data: Update<T>) => boolean;
    calculation: (data: NewWithDefaults<T>) => Partial<Calculated<T>>;
}
export declare class Dao {
    private readonly auth;
    private readonly db;
    private readonly FieldValue;
    private readonly getGuid;
    constructor({ auth, db, FieldValue, getGuid }: CodeeContext);
    private saveNew;
    private saveUpdate;
    private composeCalcs;
    private neededCalcs;
    createRunner(data: New<Runner>): Promise<void>;
    createUser(data: New<User>, id?: string): Promise<string>;
    createUserWithCourseSections(data: New<User>, courseSections: {
        [courseId: string]: string;
    }, id?: string): Promise<string>;
    createOrUpdateUserWithCourseSections(data: New<User>, courseSections: {
        [courseId: string]: string;
    }, email: string): Promise<string>;
    updateUser(id: string, data: Update<User>): Promise<unknown>;
    followUser(followerId: string, followingId: string, follow?: boolean): Promise<void>;
    updateAvatar(id: string, avatarUrl: string): Promise<void>;
    createUserPrivate(id: string, data: New<UserPrivate>): Promise<unknown>;
    updateUserPrivate(id: string, data: Update<UserPrivate>): Promise<unknown>;
    readNotificationsSocial(id: string): Promise<unknown>;
    readNotificationsStudy(id: string): Promise<unknown>;
    private userCalcName;
    userCalculators: Array<Calculator<User>>;
    createCourse(data: New<Course>): Promise<string>;
    updateCourse(id: string, data: Update<Course>): Promise<void>;
    private courseCalcSlugYearSem;
    private courseCalcRoles;
    courseCalculators: Array<Calculator<Course>>;
    createActivity(courseId: string, data: New<CourseActivity>): Promise<string>;
    updateActivity(courseId: string, activityId: string, data: Update<CourseActivity>): Promise<unknown>;
    private courseActivityCalcSlug;
    createProblems(activityId: string, problems: Array<New<Problem>>): Promise<void>;
    createProblem(activityId: string, data: New<Problem>): Promise<string>;
    updateProblem(activityId: string, problemId: string, data: Update<Problem>): Promise<unknown>;
    createTest(activityId: string, problemId: string, data: New<Test>): Promise<string>;
    updateTest(activityId: string, problemId: string, testId: string, data: Update<Test>): Promise<unknown>;
    deleteTest(activityId: string, problemId: string, testId: string): Promise<void>;
    createSubmission(courseId: string, activityId: string, userId: string, data: New<ProblemResult>): Promise<string>;
    private calcActivityResultId;
}
//# sourceMappingURL=dao.d.ts.map