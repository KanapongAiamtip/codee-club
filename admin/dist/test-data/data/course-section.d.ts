import { DeepRequired } from 'ts-essentials';
import { Course, CourseSection, New } from '@codee-club/common/dist/dao';
export declare const sections: {
    [id: string]: DeepRequired<CourseSection>;
};
export declare const studentsWithSections: {
    id: string;
    data: New<import("@codee-club/common/dist/dao").User>;
    email: string;
    sectionId: string;
}[];
export declare const course: New<Course>;
//# sourceMappingURL=course-section.d.ts.map