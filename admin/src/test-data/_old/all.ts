// import { Dao, RESULTS, INVITES } from '@codee-club/common/dist/dao'
// import { values } from '@codee-club/common/dist/utils/object-extensions'
// import { randomBool } from '@codee-club/common/dist/utils/random'
// import firebase from '@codee-club/common/dist/firebase-initialized'
// import firebaseAdmin from '~/firebase-admin-initialized'
// import { users, invites } from './data-random/users'
// import { courses } from './data-random/courses'
// import { createActivityResult } from './data-random/results'

// const studentSections: Array<{
//   studentGuid: string
//   sectionGuids: Array<string>
// }> = Array.from(users).map(([authUser, user]) => ({
//   studentGuid: authUser.uid,
//   sectionGuids: user?.sectionGuids ?? []
// }))

// async function seedCoursesAndActivities() {
//   await Promise.all(
//     Array.from(courses).map(async ([course, activities]) => {
//       // Create course
//       const courseGuid = await dao.createCourse(course)
//       process.stdout.write(`\n\n[${courseGuid}] ${course.code} ${course.name} `)

//       // Push course GUID into users
//       users.forEach((initial, authUser, _map) => {
//         if (course.ownerGuids.includes(authUser.uid) || course.editorGuids?.includes(authUser.uid) || values(course.sections)?.filter((section) => initial.sectionGuids?.includes(section.guid)).length !== 0) {
//           initial.courseGuids?.push(courseGuid)
//         }
//       })

//       // Pretend we downloaded the course
//       // TODO Chaz: Only pass in GUID (DAO should download the latest data)
//       const parentCourse = {
//         id: courseGuid,
//         ownerGuids: course.ownerGuids,
//         editorGuids: course.editorGuids || [],
//         sections: course.sections || {}
//       }

//       await Promise.all(
//         Array.from(activities).map(async (activity) => {
//           const activityGuid = await dao.createActivity(parentCourse, activity)
//           process.stdout.write(`\n- [${activityGuid}] ${activity.name}`)

//           const problems = values(activity.problems)
//           if (problems) {
//             const activitySectionGuids: Array<string> = activity?.sectionGuids ?? []
//             const studentGuids: Array<string> = studentSections.filter((ss) => ss.sectionGuids.filter((sectionGuid) => activitySectionGuids.includes(sectionGuid)).length > 0).map((ss) => ss.studentGuid)

//             const userGuids = [...course.ownerGuids, ...(course?.editorGuids ?? []), ...studentGuids]
//             await Promise.all(
//               Array.from(userGuids).map(async (studentGuid) => {
//                 if (activity.status !== 'DRAFT' && randomBool(80)) {
//                   const activityResult = createActivityResult(studentGuid, activityGuid, problems)
//                   // dao.createResult() // TODO Chaz: Add DAO methods for results
//                   const resRef = db.collection(RESULTS).doc()
//                   await resRef.set(activityResult, { merge: true })
//                   process.stdout.write(`\n-- [${resRef.id}] Results for student ${studentGuid}`)
//                 }
//               })
//             )
//           }
//         })
//       )
//     })
//   )
// }

// async function seedUsers() {
//   process.stdout.write('\n\nUsers: ')
//   await Promise.all(
//     Array.from(users).map(async ([authUser, initial]) => {
//       const userGuid = await dao.createUser(authUser, initial)
//       if (authUser.email) {
//         const createUserRequest = {
//           uid: authUser.uid,
//           email: authUser.email,
//           password: '123456',
//           displayName: initial.nameFirst + ' ' + initial.nameLast
//         }
//         await firebaseAdmin.auth().createUser(createUserRequest)
//       }
//       process.stdout.write(`\n- [${userGuid}] ${authUser.email} `)
//     })
//   )
// }

// async function seedInvites() {
//   // TODO Chaz: Add DAO methods for invites
//   process.stdout.write('\n\nInvites: ')
//   await Promise.all(
//     Array.from(invites).map(async ([email, invite]) => {
//       const ref = db.collection(INVITES).doc(email)
//       await ref.set(invite, { merge: true })
//       process.stdout.write(`\n- [${ref.id}] Invites for ${email}`)
//     })
//   )
// }

// const main = async () => {
//   await productionWarning()
//   await seedCoursesAndActivities()
//   await seedUsers()
//   await seedInvites()
// }

// main()
//   .then(() => process.exit())
//   .catch((e) => console.error(e))
