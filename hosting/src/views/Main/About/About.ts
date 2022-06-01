import Vue from 'vue'
import Component from 'vue-class-component'

import { User, USERS, VueFire } from '@codee-club/common/dist/dao'

@Component({
  metaInfo: {
    title: 'About'
  }
})
export default class About extends Vue {
  loadingContributors = true
  contributors: Array<VueFire<User>> = []

  async mounted(): Promise<void> {
    await this.$bind('contributors', this.$db.collection(USERS).where('roles', 'array-contains', 'contributor')).then(() => (this.loadingContributors = false))
  }

  get contributorsSorted(): Array<VueFire<User>> {
    return this.contributors.sort((c1, c2) => c1.name.localeCompare(c2.name))
  }
}
