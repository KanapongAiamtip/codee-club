import { New, User } from '@codee-club/common/dist/dao';
export declare const keyedTeachers: Array<{
    id: string;
    email: string;
    data: New<User>;
}>;
export declare const keyedStudents: Array<{
    id: string;
    data: New<User>;
    email: string;
    sectionCode: string;
}>;
export declare const keyedTestStudents: {
    id: string;
    data: New<User>;
    email: string;
    sectionCode: string;
}[];
//# sourceMappingURL=user.d.ts.map