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
    name: 'Hello doubles',
    description:
      '<p>Read in two doubles, multiply them and print out the result.</p>',
    tests: keyBy(
      [
        {
          seq: 1,
          input: '2.5\n5.0',
          expected: '12.5',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: '4.75\n3.25',
          expected: '15.4375',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: '1.125\n8.0',
          expected: '9.0',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: '1.234\n5.678',
          expected: '7.006652',
          visibility: HIDDEN
        },
        {
          seq: 5,
          input: '10.5\n11.975',
          expected: '125.7375',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  },
  {
    seq: 2,
    name: 'Elephants and kangaroos',
    description: '<p>Write a program that reads two lines and returns whether they are equal length or not.</p><p><i>Hint: use <code>.length()</code> to get the length of a string.</i></p>',
    tests: keyBy(
      [
        {
          seq: 1,
          input: 'elephant\nkangaroo',
          expected: 'EQUAL',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: 'tiger\npenguin',
          expected: 'NOT EQUAL',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: 'bear\nfrog',
          expected: 'EQUAL',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: 'elephant\noctopus',
          expected: 'NOT EQUAL',
          visibility: HIDDEN
        },
        {
          seq: 5,
          input: 'giraffe\noctopus',
          expected: 'EQUAL',
          visibility: HIDDEN
        },
        {
          seq: 6,
          input: 'giraffe\ntiger',
          expected: 'NOT EQUAL',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  },
  {
    seq: 3,
    name: 'Underlined and overlined titles',
    description: '<p>Read in a line. Print it out with equal length <code>===</code> above and below.</p><p><i>Hint: a loop (or 2) might help</i></p>',
    tests: keyBy(
      [
        {
          seq: 1,
          input: 'Mini Test 1',
          expected: '===========\nMini Test 1\n===========',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: 'I Am A Very Long Title',
          expected: '======================\nI Am A Very Long Title\n======================',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: 'Going to the zoo',
          expected: '================\nGoing to the zoo\n================',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: 'Welcome',
          expected: '=======\nWelcome\n=======',
          visibility: HIDDEN
        },
        {
          seq: 5,
          input: 'Once upon a time',
          expected: '================\nOnce upon a time\n================',
          visibility: HIDDEN
        },
        {
          seq: 6,
          input: 'Short',
          expected: '=====\nShort\n=====',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  },
  {
    seq: 4,
    name: 'Bedrooms and toilets',
    description: '<p>A house has a living room, a kitchen, <em>X</em> bedrooms and <em>Y</em> toilets. Complete the <code>House</code> class by writing 3 methods:\n<ul>\n<li><code>getBedrooms</code> returns the number of bedrooms <em>X</em></li>\n<li><code>getToilets</code> returns the number of toilets <em>Y</em></li>\n<li><code>getTotal</code> returns the total number of rooms (<em>X</em> + <em>Y</em> + 2)</li>\n</ul><br>\n<strong>Template:</strong>\n</p>\n<pre>\nclass House {\n    private int bedrooms;\n    private int toilets;\n\n    public House(int bedrooms, int toilets) {\n        this.bedrooms = bedrooms;\n        this.toilets = toilets;\n    }\n\n    // TODO: add methods here\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        House h = new House(sc.nextInt(), sc.nextInt());\n        System.out.println("My house has " + h.getTotal() + " rooms including "\n          + h.getBedrooms() + " bedrooms and " + h.getToilets() + " toilets.");\n    }\n}\n</pre>',
    tests: keyBy(
      [
        {
          seq: 1,
          input: '2\n1',
          expected: 'My house has 5 rooms including 2 bedrooms and 1 toilets.',
          visibility: VISIBLE
        },
        {
          seq: 2,
          input: '3\n3',
          expected: 'My house has 8 rooms including 3 bedrooms and 3 toilets.',
          visibility: VISIBLE
        },
        {
          seq: 3,
          input: '4\n5',
          expected: 'My house has 11 rooms including 4 bedrooms and 5 toilets.',
          visibility: HIDDEN
        },
        {
          seq: 4,
          input: '6\n3',
          expected: 'My house has 11 rooms including 6 bedrooms and 3 toilets.',
          visibility: HIDDEN
        }
      ],
      getGuid
    )
  }
]

export const activityAndProblems: ActivityAndProblems = {
  activity: {
    seq: 4,
    name: 'Mini Test 1',
    status: ActivityStatus.Published,
    sectionIds: [],
    deadlines: {}
  },
  problems: problems,
  deadline: '2021-01-07T09:30:00Z'
}
