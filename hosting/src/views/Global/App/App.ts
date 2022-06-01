import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'

import { User, VueFire } from '@codee-club/common/dist/dao'
import { Notification } from '@codee-club/common/dist/notifications'

import Routes from '@/router/routes'

@Component({
  metaInfo: {
    title: 'Learn to code',
    titleTemplate: '%s | Codee.Club'
  }
})
export default class App extends Vue {
  showMenu = false
  showSignIn = !!process.env.VUE_APP_EMU_PORT_AUTH

  // TODO Prefer to use this over watch $route (see: https://class-component.vuejs.org/guide/additional-hooks.html)
  // beforeRouteUpdate(_to: Route, _from: Route, next: NavigationGuardNext): void {
  //   this.showMenu = false
  //   next()
  // }

  @Watch('$route', { immediate: true, deep: true })
  onRouteChange(_newVal: Route): void { this.showMenu = false }

  get user(): VueFire<User> | undefined {
    return this.$store.state.currentUser
  }

  get notificationsSocialLast10(): Notification[] {
    return this.$store.getters.notificationsSocial.slice(0, 10).reverse()
  }

  get notificationsStudyLast10(): Notification[] {
    return this.$store.getters.notificationsStudy.slice(0, 10).reverse()
  }

  get hasBadgeSocial(): boolean {
    if (this.notificationsSocialLast10.length === 0) return false
    const lastView = this.$store.state.currentUserPrivate?.notificationsSocialLastViewed
    if (lastView === null) return false // Vuex temporarily sets it to null during update
    if (lastView === undefined) return true // never seen
    return this.notificationsSocialLast10[this.notificationsSocialLast10.length - 1].date.seconds > lastView.seconds
  }

  get hasBadgeStudy(): boolean {
    if (this.notificationsStudyLast10.length === 0) return false
    const lastView = this.$store.state.currentUserPrivate?.notificationsStudyLastViewed
    if (lastView === null) return false // Vuex temporarily sets it to null during update
    if (lastView === undefined) return true // never seen
    return this.notificationsStudyLast10[this.notificationsStudyLast10.length - 1].date.seconds > lastView.seconds
  }

  async viewedSocial(): Promise<void> {
    if (this.hasBadgeSocial) await this.$dao.readNotificationsSocial(this.$store.state.currentUser.id)
  }

  async viewedStudy(): Promise<void> {
    if (this.hasBadgeStudy) await this.$dao.readNotificationsStudy(this.$store.state.currentUser.id)
  }

  get buildVersion(): string {
    return process.env.VUE_APP_BUILD_VERSION ?? 'local'
  }

  async signout(): Promise<void> {
    await this.$auth.signOut()
    if (this.$route.path !== '/') await this.$router.push({ name: Routes.MainHome })
  }
}
