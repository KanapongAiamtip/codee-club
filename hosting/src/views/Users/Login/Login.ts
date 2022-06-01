import Vue from 'vue'
import Component from 'vue-class-component'

import Routes from '@/router/routes'
import { NuConnectButton } from '@/views'

@Component({
  metaInfo: {
    title: 'Login'
  },
  components: { NuConnectButton }
})
export default class Login extends Vue {
  credentials = { email: '', password: '' }
  fail = false

  mounted(): void {
    const email = this.$refs.email as HTMLElement
    email.focus()
  }

  async attemptUsernameLogin(): Promise<void> {
    this.fail = false

    // Lazy login (prefill for devs)
    if (process.env.VUE_APP_EMU_PORT_AUTH) {
      if (this.credentials.email.length === 0) this.credentials.email = 'arya@codee.club'
      else if (!this.credentials.email.includes('@')) this.credentials.email = this.credentials.email + '@nu.ac.th'

      if (this.credentials.password.length === 0) this.credentials.password = '123456'
    }

    // Email/password login
    // TODO: If user doesn't exist in Firestore, create it
    const email = this.credentials.email
    const password = this.credentials.password
    try {
      await this.$auth.signInWithEmailAndPassword(email, password)
      await this.$router.push({ name: Routes.MainHome })
    } catch (error) {
      if (error.code !== 'auth/user-not-found') console.error(error)
      this.fail = true
    }
  }
}
