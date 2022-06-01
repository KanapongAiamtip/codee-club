import Vue from 'vue'

import { deadline, fromNow, fromNowShort, logLong, logShort, monthYear, notiTime } from '@codee-club/common/dist/utils/datetime'
import { shortscale } from '@codee-club/common/dist/utils/math'
import { capitalize } from '@codee-club/common/dist/utils/string-cases'

// Dates
Vue.filter('deadline', deadline)
Vue.filter('fromNow', fromNow)
Vue.filter('fromNowShort', fromNowShort)
Vue.filter('logLong', logLong)
Vue.filter('logShort', logShort)
Vue.filter('monthYear', monthYear)
Vue.filter('notiTime', notiTime)

// Strings
Vue.filter('capitalize', capitalize)

// Numbers
Vue.filter('shortscale', shortscale)
