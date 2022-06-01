import Buefy from 'buefy'
import Vue from 'vue'
import { firestorePlugin as VueFire } from 'vuefire'

import router from '@/router'
import store from '@/store'
import { App } from '@/views'
import { auth } from '~/firebase-initialized'
import { VueCodee } from '~/vue/plugins'

import { ACTIONS } from './store/vuex-api'

import '~/vue/filters'
import '~/vue/mixins'
import '@mdi/font/css/materialdesignicons.css'
import 'buefy/dist/buefy.css'
import '@/scss/main.scss'

// Configure Vue
Vue.config.productionTip = false
Vue.use(Buefy)
Vue.use(VueFire) // TODO Chaz: VueFire => I think we should change the reset value for a single object from null to undefined (but I'm not sure how to write the function)
Vue.use(VueCodee)

// Initialize
let app: Vue | undefined
auth.onAuthStateChanged(async (user) => {
  await store.dispatch(ACTIONS.userChanged, user)
  if (!app) {
    app = new Vue({ router, store, render: (h) => h(App) })
      .$mount('#app')
  }
})
