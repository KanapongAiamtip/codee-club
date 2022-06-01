import inverted from 'lodash/invert'
import keyBy from 'lodash/keyBy'
import mapValues from 'lodash/mapValues'
import { DeepRequired } from 'ts-essentials'

import { Course, CourseSection, New } from '@codee-club/common/dist/dao'

import getGuid from '~/get-guid'

import { keyedStudents, keyedTeachers } from './user'

export const sections: { [id: string]: DeepRequired<CourseSection> } = keyBy(
  ['1', '2', '3', '4', '5', '6']
    .map(code => ({
      code,
      studentIds: keyedStudents
        .filter((student) => student.sectionCode === code)
        .map((student) => student.id)
    })),
  getGuid
)

const sectionCodeToId = inverted(mapValues(sections, (section: DeepRequired<CourseSection>) => section.code))
export const studentsWithSections = keyedStudents.map(({ id, data, email, sectionCode }) => ({ id, data, email, sectionId: sectionCodeToId[sectionCode] }))

export const course: New<Course> = {
  code: '254275',
  year: 2020,
  semester: 2,
  name: 'Object Oriented Programming',
  ownerIds: [keyedTeachers[0].id, keyedTeachers[1].id],
  editorIds: [keyedTeachers[2].id],
  sections: sections
}
