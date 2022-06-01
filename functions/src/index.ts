
import { RUNNERS, SUBMISSION_JOBS, USERS } from '@codee-club/common/dist/dao'

import functions from './_services/firebase-functions-initialized'
import { getToken, getUrl } from './auth'
import { courseUserImport as courseUserImportHandler } from './courses'
import { sendDeadlineReminders } from './deadlines'
import { onCreateRunner } from './runners/new-runner'
import { onCreateSubmission } from './runners/new-submission'
import { onUpdateUser } from './users'

// HTTPS Callable
export const authNUConnectURL: unknown = functions.https.onCall(getUrl)
export const authNUConnectToken: unknown = functions.https.onCall(getToken)
export const courseUserImport: unknown = functions.https.onCall(courseUserImportHandler)

// Firestore
export const userUpdate: unknown = functions.firestore.document(`${USERS}/{userId}`).onUpdate(onUpdateUser)
export const runnerUpdate: unknown = functions.firestore.document(`${RUNNERS}/{runnerId}`).onCreate(onCreateRunner)
export const submissionCreate: unknown = functions.firestore.document(`${SUBMISSION_JOBS}/{submissionId}`).onCreate(onCreateSubmission)

// Cron (scheduled functions)
export const everyDay: unknown = functions.pubsub.schedule('every day 08:00').timeZone('Asia/Bangkok').onRun(sendDeadlineReminders)
export const everyDayTest: unknown = functions.https.onCall(sendDeadlineReminders)
