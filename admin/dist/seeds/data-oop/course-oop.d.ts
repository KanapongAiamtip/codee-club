import { Course, CourseActivity, New, Problem, User } from '@codee-club/common/dist/dao';
export declare const keyedTeachers: Array<{
    id: string;
    data: New<User>;
}>;
export declare const testStudents: {
    id: string;
    data: {
        nameFirst: string;
        nameLast: string;
        email: string;
    };
    sectionCode: string;
}[];
export declare const studentsWithSections: {
    id: string;
    data: New<User>;
    sectionId: string;
}[];
export declare const course: New<Course>;
export declare const activitiesAndProblems: Array<{
    activity: New<CourseActivity>;
    problems: Array<New<Problem>>;
}>;
//# sourceMappingURL=course-oop.d.ts.map