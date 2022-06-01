import Vue from 'vue'
import Component from 'vue-class-component'

import { CONFIG, CONFIG_STATISTICS, ConfigStatistics, VueFire } from '@codee-club/common/dist/dao'

@Component({})
export default class Statistics extends Vue {
  statistics: VueFire<ConfigStatistics> | null = null

  async mounted(): Promise<void> {
    await this.$bind('statistics', this.$db.collection(CONFIG).doc(CONFIG_STATISTICS))
  }
}
