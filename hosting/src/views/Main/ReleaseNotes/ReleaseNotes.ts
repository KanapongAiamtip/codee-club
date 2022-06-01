import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  metaInfo: {
    title: 'Release Notes'
  }
})
export default class ReleaseNotes extends Vue {
  get buildVersion(): string {
    return process.env.VUE_APP_BUILD_VERSION ?? 'local'
  }
}
