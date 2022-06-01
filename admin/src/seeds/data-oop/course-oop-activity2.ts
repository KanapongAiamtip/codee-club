import keyBy from 'lodash/keyBy'

import { New, Problem } from '@codee-club/common/dist/dao'
import { ActivityStatus, TestVisibility } from '@codee-club/common/dist/data-types/enums'

import getGuid from '~/get-guid'
import { ActivityAndProblems } from '../types/activity-types'

// Test visibility
const VISIBLE = TestVisibility.Visible
const HIDDEN = TestVisibility.Hidden

const problems: Array<New<Problem>> = [
  {
    seq: 1,
    name: 'Your age on Venus',
    description: 'Venus takes 224.70 Earth days to complete one orbit around the Sun (compared to Earth which takes 365.25 days). The program should input your age on Earth (integer) and output your age on Venus to 2 decimal places.',
    tests: keyBy(
      [
        {
          seq: 1,
          input: '20',
          expected: '32.51',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: '55',
          expected: '89.40',
          visibility: HIDDEN
        },
        {
          seq: 3,
          input: '100',
          expected: '162.55',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: '99',
          expected: '160.92',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  },
  {
    seq: 2,
    name: 'Planet names',
    description: 'Write a program that takes a planet name and outputs information about that planet. The program should accept input in any case (e.g. “Mars” == “mars” == “MARS”).',
    tests: keyBy(
      [
        {
          seq: 1,
          input: 'Mars',
          expected: 'Mars is the 4th planet from the Sun.',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: 'Venus',
          expected: 'Venus is the 2nd planet from the Sun.',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: 'Saturn',
          expected: 'Saturn is the 6th planet from the Sun.',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: 'EARTH',
          expected: 'Earth is the 3rd planet from the Sun.',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  },
  {
    seq: 3,
    name: 'Multiples of seven',
    description: 'Write a program that prints out multiples of 7. The number of multiples to print out is the input to the program.',
    tests: keyBy(
      [
        {
          seq: 1,
          input: '4',
          expected: '7, 14, 21, 28,',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: '8',
          expected: '7, 14, 21, 28, 35, 42, 49, 56,',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: '10',
          expected: '7, 14, 21, 28, 35, 42, 49, 56, 63, 70,',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: '12',
          expected: '7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84,',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  },
  {
    seq: 4,
    name: 'Quadmin',
    description: 'Write a program that inputs 4 numbers and returns the smallest.',
    tests: keyBy(
      [
        {
          seq: 1,
          input: '10 3 45 28',
          expected: '3',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: '22 188 76 15',
          expected: '15',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: '22 188 76 55',
          expected: '22',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: '78 188 76 77',
          expected: '76',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  },
  {
    seq: 5,
    name: 'Sum to one',
    description: 'Write a program that inputs a number x and generates the sum of x + (x-1) + … + 1. The number x is greater than zero.',
    tests: keyBy(
      [
        {
          seq: 1,
          input: '3',
          expected: '3 + 2 + 1 = 6',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: '6',
          expected: '6 + 5 + 4 + 3 + 2 + 1 = 21',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: '4',
          expected: '4 + 3 + 2 + 1 = 10',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: '8',
          expected: '8 + 7 + 6 + 5 + 4 + 3 + 2 + 1 = 36',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  },
  {
    seq: 6,
    name: 'Word count the sequel',
    description: 'Write a program that reads in many lines of text and counts the number of words and punctuation marks (including: ,.?!). The input ends with the line <code>***</code>.',
    tests: keyBy(
      [
        {
          seq: 1,
          input: 'Where would you like\nto go today?\n***',
          expected: '7 words\n1 punctuation mark',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: 'Today... Well, I need a\ncoffee and a bar of\nchocolate!\n***',
          expected: '11 words\n5 punctuation marks',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: 'There\nare never\ntoo\nmany lines,\nyou know!\n***',
          expected: '8 words\n2 punctuation marks',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: 'Enough!?!\n***',
          expected: '1 word\n3 punctuation marks',
          visibility: HIDDEN
        },
        {
          seq: 5,
          input: '...\nlet us test the\npunctuation!\nshould we?\nyes, i think\nso.\n***',
          expected: '11 words\n7 punctuation marks',
          visibility: HIDDEN
        },
        {
          seq: 6,
          input: 'lines\n  starting\n    with\n        spaces!\n***',
          expected: '4 words\n1 punctuation mark',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  }
]

export const activityAndProblems: ActivityAndProblems = {
  activity: {
    seq: 2,
    name: 'Loops and Conditionals',
    status: ActivityStatus.Published,
    sectionIds: [],
    deadlines: {}
  },
  problems: problems,
  deadline: '2020-12-17T05:00:00Z'
}
