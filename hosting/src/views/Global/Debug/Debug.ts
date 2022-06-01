import Vue from 'vue'
import Component from 'vue-class-component'

import { User, VueFire } from '@codee-club/common/dist/dao'
@Component
export default class Debug extends Vue {
  get user(): VueFire<User> {
    return this.$store.state.currentUser
  }
}
