<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class NotFound extends Vue {
  @Prop() item?: string
}
</script>

<template>
  <div class="block">
    <span v-if="item">{{ item | capitalize }}</span>
    <span v-else>Page</span>
    not found.
  </div>
</template>
