import admin from 'firebase-admin'

admin.initializeApp()
console.info(`Using project: ${process.env.FUNCTIONS_EMULATOR ? 'codee-club-emu' : process.env.GCLOUD_PROJECT ?? ''}`)

export default admin
export const auth = admin.auth()
export const db = admin.firestore()
export const FieldValue = admin.firestore.FieldValue
export const Timestamp = admin.firestore.Timestamp
