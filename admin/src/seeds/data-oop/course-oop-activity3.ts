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
    name: 'Hello arrays',
    description:
      '<p>Write a method to the sum of an array of integers.</p>\n<p>Template</p>\n<pre>class TaskA {\n\n    public static void main(String[] args) {\n        int[] numbers = inputIntArray();\n        int result = sum(numbers);\n        System.out.println(result);\n    }\n\n    public static int sum(int[] numbers) {\n        // TODO: Your answer here\n    }\n\n    private static int[] inputIntArray() {\n        Scanner reader = new Scanner(System.in);\n        String input = reader.nextLine();\n        String[] parts = input.split(",");\n\n        int[] result = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) {\n            result[i] = Integer.parseInt(parts[i]);\n        }\n        return result;\n    }\n}</pre>\n',
    tests: keyBy(
      [
        {
          seq: 1,
          input: '2,4,5',
          expected: '11',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: '3,1,6,10,8',
          expected: '28',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: '1,1,1,1,1,1,1,1,1,1,1,1,1',
          expected: '13',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: '100,200,300',
          expected: '600',
          visibility: HIDDEN
        },
        {
          seq: 5,
          input: '1,2,8,4,16,32,64',
          expected: '127',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  },
  {
    seq: 2,
    name: 'Looking for a long word',
    description: '<p>Given an array of strings, return the first word that is longer than 6 letters. If no such word is found then print nothing.</p>\n<p>Template</p>\n<pre>class TaskB {\n\n    public static void main(String[] args) {\n        String[] words = inputStringArray();\n        String result = longWord(words);\n        System.out.println(result);\n    }\n\n    private static String[] inputStringArray() {\n        Scanner reader = new Scanner(System.in);\n        String input = reader.nextLine();\n        String[] result = input.split(",");\n        return result;\n    }\n\n    // TODO: Your answer here\n}</pre>',
    tests: keyBy(
      [
        {
          seq: 1,
          input: 'find,what,you,are,looking,for',
          expected: 'looking',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: 'the,longest,and,the,furthest',
          expected: 'longest',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: 'what,may,be,the,oldest,is,the,wisest',
          expected: '',
          visibility: VISIBLE
        },
        {
          seq: 4,
          input: 'delicious,treats,await',
          expected: 'delicious',
          visibility: HIDDEN
        },
        {
          seq: 5,
          input: 'what,may,be,the,oldest,always,hurts,the,same,keep,searching',
          expected: 'searching',
          visibility: HIDDEN
        },
        {
          seq: 6,
          input: 'treats,delicious,await',
          expected: 'delicious',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  },
  {
    seq: 3,
    name: 'All are equal',
    description: 'Given an array of integers, return true if all integers in the array are equal.',
    tests: keyBy(
      [
        {
          seq: 1,
          input: '1,1,2,1',
          expected: 'false',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: '2,2,2',
          expected: 'true',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: '3,2,2,2,2,2',
          expected: 'false',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: '99',
          expected: 'true',
          visibility: HIDDEN
        },
        {
          seq: 5,
          input: '1000,1000,1000,1000,1000',
          expected: 'true',
          visibility: HIDDEN
        },
        {
          seq: 6,
          input: '1,1,1,1,1,1,1,1,1,1,2',
          expected: 'false',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  },
  {
    seq: 4,
    name: 'All the long ones',
    description: 'Given an array of strings, return all the words that are longer than 6 letters. Print one per line.',
    tests: keyBy(
      [
        {
          seq: 1,
          input: 'jumped,over,the,lazy,sleeping',
          expected: 'sleeping',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: 'unconscious,with,shallow,breath',
          expected: 'unconscious\nshallow',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: 'One,of,President,Xi,closest,advisers',
          expected: 'President\nclosest\nadvisers',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: 'takes,control,of,China,economic,policies,and,financial,issues',
          expected: 'control\neconomic\npolicies\nfinancial',
          visibility: HIDDEN
        },
        {
          seq: 5,
          input: 'aaaaaaaaaaaa',
          expected: 'aaaaaaaaaaaa',
          visibility: HIDDEN
        },
        {
          seq: 6,
          input: 'aaaaaaaa,bbbbbbbbb,ccccccccc,ddddddddd,eeeeeeee,fffffffff',
          expected: 'aaaaaaaa\nbbbbbbbbb\nccccccccc\nddddddddd\neeeeeeee\nfffffffff',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  }
]

export const activityAndProblems: ActivityAndProblems = {
  activity: {
    seq: 3,
    name: 'Arrays',
    status: ActivityStatus.Published,
    sectionIds: [],
    deadlines: {}
  },
  problems: problems,
  deadline: '2021-01-10T05:00:00Z'
}
