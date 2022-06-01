// import type { Initial, Course, Activity, Problem, Test } from '@codee-club/common/dist/dao'
// import keyBy from 'lodash/keyBy'
// import titleGen from 'passport-title-generator'
// import * as textGen from 'txtgen'
// import firebase from '@codee-club/common/dist/firebase-initialized'
// import { randomIntBetween, randomElement } from '@codee-club/common/dist/utils/random'
// import { teachers, students, sections231370, sections231374, sections231370Map, sections231374Map } from './users'
// import getGuid from '~/get-guid'

// function createTests(): { [guid: string]: Test } {
//   const visiblities = ['VISIBLE', 'HIDDEN'] // TODO Chaz: Use enum once defined

//   const tests: Array<Test> = Array.from({ length: randomIntBetween(1, 6) }, (_, idx) => ({
//     guid: getGuid(),
//     seq: idx + 1,
//     input: textGen.sentence(),
//     expected: textGen.sentence(),
//     visibility: randomElement(visiblities)
//   }))

//   return keyBy(tests, 'guid')
// }

// function createProblems(): { [guid: string]: Problem } {
//   const problems: Array<Problem> = Array.from({ length: randomIntBetween(2, 10) }, (_, idx) => ({
//     guid: getGuid(),
//     seq: idx + 1,
//     name: titleGen().join(' '),
//     description: textGen.article(randomIntBetween(0, 2)).replace('\n', '<br />'),
//     tests: createTests()
//   }))

//   return keyBy(problems, 'guid')
// }

// export const courses: Map<Initial<Course>, Array<Initial<Activity>>> = new Map([
//   [
//     {
//       code: '231370',
//       year: 2019,
//       semester: 2,
//       name: 'Web Servers & Services',
//       ownerGuids: [teachers[0].guid],
//       editorGuids: [teachers[2].guid, students[8].guid],
//       sections: sections231370Map
//     },
//     [
//       {
//         seq: 1,
//         name: 'U1 What is a Web Server?',
//         status: 'LOCKED',
//         sectionGuids: sections231370.map((s) => s.guid),
//         problems: createProblems()
//       },
//       {
//         seq: 2,
//         name: 'U2 Requests',
//         status: 'LOCKED',
//         sectionGuids: sections231370.map((s) => s.guid),
//         problems: createProblems()
//       },
//       {
//         seq: 3,
//         name: 'U3 Responses',
//         status: 'RELEASED',
//         sectionGuids: [sections231370[0].guid],
//         problems: createProblems()
//       },
//       {
//         seq: 4,
//         name: 'U4 Database & REST',
//         status: 'RELEASED',
//         sectionGuids: [sections231370[0].guid],
//         problems: createProblems()
//       },
//       {
//         seq: 5,
//         name: 'U5 Views & Templates',
//         status: 'DRAFT',
//         sectionGuids: [],
//         problems: createProblems()
//       },
//       {
//         seq: 6,
//         name: 'U6 Reactive Web Apps',
//         status: 'DRAFT',
//         sectionGuids: []
//       },
//       {
//         seq: 7,
//         name: 'U7 Reactive Web Routing & State',
//         status: 'DRAFT',
//         sectionGuids: []
//       },
//       {
//         seq: 8,
//         name: 'U8 Serverless: FaaS & BaaS',
//         status: 'DRAFT',
//         sectionGuids: []
//       }
//     ]
//   ],
//   [
//     {
//       code: '231374',
//       year: 2019,
//       semester: 2,
//       name: 'Concurrent & Function Programming',
//       ownerGuids: [teachers[0].guid, teachers[1].guid],
//       editorGuids: [],
//       sections: sections231374Map
//     },
//     [
//       {
//         seq: 1,
//         name: 'U1 Introduction to Scala',
//         status: 'LOCKED',
//         sectionGuids: sections231374.map((s) => s.guid),
//         problems: createProblems()
//       },
//       {
//         seq: 2,
//         name: 'U2 Pure Functions & Immutability',
//         status: 'LOCKED',
//         sectionGuids: sections231374.map((s) => s.guid),
//         problems: createProblems()
//       },
//       {
//         seq: 3,
//         name: 'U3 Lists & Recursion',
//         status: 'LOCKED',
//         sectionGuids: sections231374.map((s) => s.guid),
//         problems: createProblems()
//       },
//       {
//         seq: 4,
//         name: 'U4 First-Class Functions',
//         status: 'LOCKED',
//         sectionGuids: sections231374.map((s) => s.guid),
//         problems: createProblems()
//       },
//       {
//         seq: 5,
//         name: 'U5 Higher-Order Functions',
//         status: 'RELEASED',
//         sectionGuids: sections231374.map((s) => s.guid),
//         problems: createProblems()
//       },
//       {
//         seq: 6,
//         name: 'U6 Introduction to Concurrency',
//         status: 'RELEASED',
//         sectionGuids: sections231374.map((s) => s.guid),
//         problems: createProblems()
//       },
//       {
//         seq: 7,
//         name: 'U7 Synchronization',
//         status: 'RELEASED',
//         sectionGuids: sections231374.map((s) => s.guid),
//         problems: createProblems()
//       },
//       {
//         seq: 8,
//         name: 'U8 Concurrent Data Types',
//         status: 'DRAFT',
//         sectionGuids: []
//       },
//       { seq: 9, name: 'U9 Actors', status: 'DRAFT', sectionGuids: [] },
//       {
//         seq: 10,
//         name: 'U10 Async: Promises & Rx',
//         status: 'DRAFT',
//         sectionGuids: []
//       }
//     ]
//   ]
// ])
