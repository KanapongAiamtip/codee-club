<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import {
  UrlRequestCallable,
  urlRequestId
} from '@codee-club/common/dist/api-callables'

import Routes from '@/router/routes'

@Component
export default class NuConnectButton extends Vue {
  async attemptNUConnectLogin(): Promise<void> {
    const callbackPath = this.$router.resolve({
      name: Routes.UserLoginCallback
    }).href
    const redirectUri = window.location.origin + callbackPath
    const authNUConnectURL: UrlRequestCallable = this.$functions.httpsCallable(
      urlRequestId
    )
    const result = await authNUConnectURL({ redirectUri })
    window.location.href = result.data
  }
}
</script>

<template>
  <!-- TODO: Suggest we pass the color in as a "prop" -->
  <b-button
    type="is-primary is-outlined"
    size="is-large"
    @click="attemptNUConnectLogin"
  >
    <img src="@/assets/nu-logo.png">
    Free with NU account
  </b-button>
</template>

<style scoped>
img {
  display: inline;
  width: 42px;
  height: 42px;
  margin-top: -4px;
  margin-bottom: -12px;
  margin-left: -6px;
  margin-right: 6px;
}
</style>
