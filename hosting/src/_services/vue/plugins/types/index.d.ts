import firebase from 'firebase/app'

import { CodeeContext } from '@codee-club/common/dist/context'
import { Dao } from '@codee-club/common/dist/dao'
import { StorageDao } from '@codee-club/common/dist/storage'

declare module 'vue/types/vue' {
  interface Vue {
    $auth: firebase.auth.Auth
    $context: CodeeContext
    $db: firebase.firestore.Firestore
    $functions: firebase.functions.Functions
    $storage: firebase.storage.Storage
    $dao: Dao
    $storageDao: StorageDao
  }
}
