import keyBy from 'lodash/keyBy'

import { CourseActivity, New, Problem } from '@codee-club/common/dist/dao'
import { ActivityStatus, TestVisibility } from '@codee-club/common/dist/data-types/enums'
import { keys } from '@codee-club/common/dist/utils/object-extensions'

import admin, { Timestamp } from '~/firebase-admin-initialized'
import getGuid from '~/get-guid'

import { sections } from './course-section'

type TimestampType = admin.firestore.Timestamp

// Test visibility
const VISIBLE = TestVisibility.Visible
const HIDDEN = TestVisibility.Hidden

const warmupProblems: Array<New<Problem>> = [
  {
    seq: 1,
    name: 'Java misses you',
    description: 'Write a program that prints out "Hello world" on line 1 and "I miss you Java" on line 2',
    tests: keyBy([{ seq: 1, input: '', expected: 'Hello world\nI miss you Java', visibility: VISIBLE }], getGuid)
  },
  {
    seq: 2,
    name: 'SHOUT then whisper',
    description: 'Write a program that reads in a line of text and prints out the same text first in UPPERCASE and second in lowercase.',
    tests: keyBy(
      [
        { seq: 1, input: 'We LoVe jaVa', expected: 'WE LOVE JAVA\nwe love java', visibility: VISIBLE },
        { seq: 2, input: 'time TO program', expected: 'TIME TO PROGRAM\ntime to program', visibility: HIDDEN }
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
        { seq: 1, input: '1', expected: 'Yellow', visibility: VISIBLE },
        { seq: 2, input: '5', expected: 'Blue', visibility: VISIBLE },
        { seq: 3, input: '2', expected: 'Pink', visibility: HIDDEN },
        { seq: 4, input: '7', expected: 'Red', visibility: HIDDEN },
        { seq: 5, input: '4', expected: 'Orange', visibility: HIDDEN }
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
        { seq: 1, input: 'Monday', expected: 'Yellow', visibility: VISIBLE },
        { seq: 2, input: 'friDAY', expected: 'Blue', visibility: VISIBLE },
        { seq: 3, input: 'wednesday', expected: 'Green', visibility: HIDDEN },
        { seq: 4, input: 'Sunday', expected: 'Red', visibility: HIDDEN },
        { seq: 5, input: 'thursday', expected: 'Orange', visibility: HIDDEN }
      ],
      getGuid
    )
  }
]

function mapDeadlines(date?: TimestampType): { [id: string]: admin.firestore.Timestamp } {
  return Object.fromEntries(
    keys(sections).map((key, idx) => [
      key,
      date !== undefined ? date : Timestamp.fromMillis((Timestamp.now().seconds + (idx * 24 + 5) * 60 * 60) * 1000)
    ])
  )
}

export const activitiesAndProblems: Array<{ activity: New<CourseActivity>, problems: Array<New<Problem>> }> = [
  {
    activity: {
      seq: 1,
      name: 'Welcome Back and Warm Up',
      status: ActivityStatus.Published,
      sectionIds: keys(sections),
      deadlines: mapDeadlines()
    },
    problems: warmupProblems
  }
]
