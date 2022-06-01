import { DeepRequired } from 'ts-essentials'

import { ACTIVITY_RESULTS, ActivityResult, CONFIG, CONFIG_STATISTICS, ConfigStatistics, USERS } from '@codee-club/common/dist/dao'
import { UpdateComplete } from '@codee-club/common/dist/dao/impl/dao-types'
import { values } from '@codee-club/common/dist/utils/object-extensions'

import admin from '~/firebase-admin-initialized'
import { productionWarning } from '~/modes'

const db = admin.firestore()

const main = async (): Promise<void> => {
  await productionWarning(__filename)

  // Count members
  const usersSnapshot = await db.collection(USERS).get()
  const members = usersSnapshot.size

  // Count submissions
  const resultsSnapshot = await db.collection(ACTIVITY_RESULTS).get()
  let submissionSuccesses = 0
  let submissionCompileFailures = 0
  let submissionTestFailures = 0
  resultsSnapshot.forEach((doc) => {
    const result = doc.data() as DeepRequired<ActivityResult>
    const problemResults = values(result.problemResults)
    submissionSuccesses += problemResults.filter((pr) => pr.status === 'PASS').length
    submissionCompileFailures += problemResults.filter((pr) => pr.status === 'INVALID').length
    submissionTestFailures += problemResults.filter((pr) => pr.status === 'FAIL').length
  })

  const update: UpdateComplete<ConfigStatistics> = { members, submissionSuccesses, submissionCompileFailures, submissionTestFailures }
  await db.collection(CONFIG).doc(CONFIG_STATISTICS).set(update, { merge: true })
  console.info('Complete')
}

main()
  .then(() => process.exit())
  .catch((error) => console.error(error))
