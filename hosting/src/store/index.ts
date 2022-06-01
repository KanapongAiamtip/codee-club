import { User as FirebaseUser } from '@firebase/auth-types'
import { DeepRequired } from 'ts-essentials'
import Vue from 'vue'
import Vuex from 'vuex'
import { firestoreAction, vuexfireMutations } from 'vuexfire'

import { ACTIVITY_RESULTS, CONFIG, CONFIG_LANGUAGES, CourseActivity, COURSES, USERS, USERS_PRIVATE } from '@codee-club/common/dist/dao'
import { Notification, NOTIFICATIONS_TYPES_STUDY } from '@codee-club/common/dist/notifications'
import { entries, valuesWithIds, valueWithId } from '@codee-club/common/dist/utils/object-extensions'

import { db } from '~/firebase-initialized'

import { CodeeVuexState } from './vuex-api'

Vue.use(Vuex)

// Private (use type: CodeeVuexState)
const STATE = {
  configLanguages: 'configLanguages',
  currentUser: 'currentUser',
  currentUserPrivate: 'currentUserPrivate',
  myCourses: 'myCourses',
  myResults: 'myResults'
}

// Private (call actions not mutations)
// const MUTATIONS = {}

export default new Vuex.Store<CodeeVuexState>({
  state: {
    configLanguages: null,
    currentUser: null,
    currentUserPrivate: null,
    myCourses: [],
    myResults: []
  },
  getters: {
    notifications: (state) => state.currentUserPrivate?.notifications?.reverse() ?? [],
    notificationsSocial: (_state, getters) => getters.notifications.filter((notification: Notification) => !NOTIFICATIONS_TYPES_STUDY.includes(notification.notificationType)),
    notificationsStudy: (_state, getters) => getters.notifications.filter((notification: Notification) => NOTIFICATIONS_TYPES_STUDY.includes(notification.notificationType)),
    allLanguages: (state) => valuesWithIds(state.configLanguages ?? {}).sort((l1, l2) => l1.label.localeCompare(l2.label)),
    findCourseBySlug: (state) => (slug: string) => state.myCourses.find((course) => course.slug === slug),
    findActivityBySlugs: (_state, getters) => (courseSlug: string, activitySlug: string) => {
      const course = getters.findCourseBySlug(courseSlug)
      const activities: { [id: string]: DeepRequired<CourseActivity> } | undefined = course?.activities
      const activityAndId = entries(activities)?.find(([_id, activity]) => activity.slug === activitySlug)
      return valueWithId(activityAndId)
    }
  },
  mutations: {
    ...vuexfireMutations
  },
  actions: {
    userChanged: firestoreAction(({ state, bindFirestoreRef, unbindFirestoreRef }, user: FirebaseUser | { uid: string } | undefined) => {
      const uid = user?.uid
      if (uid === state.currentUser?.id) return

      return uid
        ? Promise.all([
          bindFirestoreRef(STATE.configLanguages, db.collection(CONFIG).doc(CONFIG_LANGUAGES)),
          bindFirestoreRef(STATE.currentUser, db.collection(USERS).doc(uid)),
          bindFirestoreRef(STATE.currentUserPrivate, db.collection(USERS_PRIVATE).doc(uid)),
          bindFirestoreRef(STATE.myCourses, db.collection(COURSES).where('roleView', 'array-contains', uid)),
          bindFirestoreRef(STATE.myResults, db.collection(ACTIVITY_RESULTS).where('userId', '==', uid))
        ])
        : new Promise<void>((resolve) => {
          unbindFirestoreRef(STATE.configLanguages)
          unbindFirestoreRef(STATE.currentUser)
          unbindFirestoreRef(STATE.currentUserPrivate)
          unbindFirestoreRef(STATE.myCourses)
          unbindFirestoreRef(STATE.myResults)
          resolve()
        })
    })
  },
  modules: {}
})
