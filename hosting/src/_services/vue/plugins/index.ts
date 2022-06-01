import firebase from 'firebase/app'
import _Vue from 'vue'

import { CodeeContext } from '@codee-club/common/dist/context'
import { Dao } from '@codee-club/common/dist/dao'
import { StorageDao } from '@codee-club/common/dist/storage'

import { auth, db, functions, storage } from '~/firebase-initialized'

const context = new CodeeContext(auth, db, firebase.firestore.FieldValue)

const dao = new Dao(context)
const storageBucket = process.env.VUE_APP_FIREBASE_STORAGE_BUCKET ?? ''
const storageDao = new StorageDao(context, dao, storage, storageBucket)

export function VueCodee(Vue: typeof _Vue): void {
  Vue.prototype.$auth = auth
  Vue.prototype.$context = context
  Vue.prototype.$db = db
  Vue.prototype.$functions = functions
  Vue.prototype.$storage = storage
  Vue.prototype.$dao = dao
  Vue.prototype.$storageDao = storageDao
}
