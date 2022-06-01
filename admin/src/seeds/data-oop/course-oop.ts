import inverted from 'lodash/invert'
import keyBy from 'lodash/keyBy'
import mapValues from 'lodash/mapValues'
import moment from 'moment'
import { DeepRequired } from 'ts-essentials'

import { Course, CourseActivity, CourseSection, New, Problem, User } from '@codee-club/common/dist/dao'
import { ActivityStatus, TestVisibility } from '@codee-club/common/dist/data-types/enums'
import { keys } from '@codee-club/common/dist/utils/object-extensions'

import admin from '~/firebase-admin-initialized'
import getGuid from '~/get-guid'

import students from './students-oop.json'
import teachers from './teachers.json'

// Test visibility
const VISIBLE = TestVisibility.Visible
const HIDDEN = TestVisibility.Hidden

const teachersTyped: Array<New<User>> = teachers
export const keyedTeachers: Array<{ id: string, data: New<User> }> = teachersTyped.map((data) => ({ id: getGuid(), data }))

export const testStudents = [
  { id: getGuid(), data: { nameFirst: 'Ayra', nameLast: 'Stark', email: 'arya@codee.club' }, sectionCode: '5' },
  { id: getGuid(), data: { nameFirst: 'Sansa', nameLast: 'Stark', email: 'sansa@codee.club' }, sectionCode: '4' }
]

const studentsTyped: Array<New<User> & { sectionCode: string }> = students
const keyedStudents: Array<{ id: string, data: New<User>, sectionCode: string }> = [...testStudents, ...studentsTyped.map(({ sectionCode, ...data }) => ({ id: getGuid(), data, sectionCode }))]

const sections: { [id: string]: DeepRequired<CourseSection> } = keyBy(
  ['1', '2', '3', '4', '5'].map(code => ({ code, studentIds: keyedStudents.filter(student => student.sectionCode === code).map(student => student.id) })),
  getGuid
)

const sectionCodeToId = inverted(mapValues(sections, (section: DeepRequired<CourseSection>) => section.code))
export const studentsWithSections = keyedStudents.map(({ id, data, sectionCode }) => ({ id, data, sectionId: sectionCodeToId[sectionCode] }))

export const course: New<Course> = {
  code: '254275',
  year: 2020,
  semester: 2,
  name: 'Object Oriented Programming',
  ownerIds: [keyedTeachers[0].id, keyedTeachers[1].id],
  editorIds: [keyedTeachers[2].id],
  sections: sections
}

const warmupProblems: Array<New<Problem>> = [
  {
    seq: 1,
    name: 'Java misses you',
    description: 'Write a program that prints out "Hello world" on line 1 and "I miss you Java" on line 2',
    tests: keyBy(
      [
        {
          seq: 1,
          input: '',
          expected: 'Hello world\nI miss you Java',
          visibility: VISIBLE
        }
      ],
      getGuid
    )
  },
  {
    seq: 2,
    name: 'SHOUT then whisper',
    description: 'Write a program that reads in a line of text and prints out the same text first in UPPERCASE and second in lowercase.',
    tests: keyBy(
      [
        {
          seq: 1,
          input: 'We LoVe jaVa',
          expected: 'WE LOVE JAVA\nwe love java',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: 'time TO program',
          expected: 'TIME TO PROGRAM\ntime to program',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  },
  {
    seq: 3,
    name: 'What colour to wear',
    description: 'Write a program that reads in a number for the day of week (1-7) and prints out the recommended colour to wear according to Thai culture.',
    tests: keyBy(
      [
        {
          seq: 1,
          input: '1',
          expected: 'Yellow',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: '5',
          expected: 'Blue',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: '2',
          expected: 'Pink',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: '7',
          expected: 'Red',
          visibility: HIDDEN
        },
        {
          seq: 5,
          input: '4',
          expected: 'Orange',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  },
  {
    seq: 4,
    name: 'Still choosing a colour',
    description: 'Write a program that reads in a string for the day of the week and prints out the recommended colour to wear. It should accept any case.',
    tests: keyBy(
      [
        {
          seq: 1,
          input: 'Monday',
          expected: 'Yellow',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: 'friDAY',
          expected: 'Blue',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: 'wednesday',
          expected: 'Green',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: 'Sunday',
          expected: 'Red',
          visibility: HIDDEN
        },
        {
          seq: 5,
          input: 'thursday',
          expected: 'Orange',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  }
]

function mapDeadlines(date: string): { [id: string]: admin.firestore.Timestamp } {
  return mapValues(sections, () => admin.firestore.Timestamp.fromDate(moment(date).toDate()))
}

export const activitiesAndProblems: Array<{ activity: New<CourseActivity>, problems: Array<New<Problem>> }> = [
  {
    activity: {
      seq: 1,
      name: 'Welcome Back and Warm Up',
      status: ActivityStatus.Published,
      sectionIds: keys(sections),
      deadlines: mapDeadlines('2020-12-10T05:00:00Z')
    },
    problems: warmupProblems
  }
]
