import Vue from 'vue'
import Component from 'vue-class-component'

import { TokenRequestCallable, tokenRequestId } from '@codee-club/common/dist/api-callables'

import Routes from '@/router/routes'

@Component
export default class LoginCallback extends Vue {
  async mounted(): Promise<void> {
    const authCode = this.$route.query.code as string // not an array
    const redirectUri = window.location.origin + this.$route.path

    const authNUConnectToken: TokenRequestCallable = this.$functions.httpsCallable(tokenRequestId)
    let nuTokenResult
    try {
      nuTokenResult = await authNUConnectToken({ authCode, redirectUri })
    } catch {
      await this.$router.replace({
        name: Routes.UserLogin,
        query: { error: 'Failed to sign in (server error 1)' }
      })
      return
    }

    if (typeof nuTokenResult.data !== 'string') {
      console.error(nuTokenResult.data.error)
      await this.$router.replace({
        name: Routes.UserLogin,
        query: { error: 'Failed to sign in (server error 2)' }
      })
      return
    }

    await this.$auth.signInWithCustomToken(nuTokenResult.data)
    const currentUser = this.$auth.currentUser
    if (!currentUser) {
      await this.$router.replace({
        name: Routes.UserLogin,
        query: { error: 'Failed to sign in (server error 2)' }
      })
      return
    }

    await this.$store.dispatch('userChanged', { uid: currentUser.uid })
    await this.$router.replace({ name: Routes.MainHome })
  }
}
