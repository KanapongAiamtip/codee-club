import firebase from 'firebase/app'
import moment from 'moment'

// URGENT: Disallow undefined -- UI should handle explicitly with v-if

type Timestamp = firebase.firestore.Timestamp
export type DateLike = Date | moment.Moment | Timestamp

function toMoment(date: DateLike): moment.Moment {
  if (moment.isMoment(date)) return date
  if (date instanceof Date) return moment(date)
  return moment.unix(date.seconds)
}

export function deadline(date?: DateLike): string {
  if (date === undefined) return ''
  const mom = toMoment(date)
  return mom.calendar({
    sameDay: '[Today @] hh:mm',
    nextDay: '[Tomorrow @] hh:mm',
    nextWeek: 'dddd [@] hh:mm',
    lastDay: '[Yesterday @] hh:mm',
    lastWeek: '[Last] dddd',
    sameElse: 'MMM-DD'
  })
}

export function fromNow(date?: DateLike): string {
  if (date === undefined) return ''
  const mom = toMoment(date)
  return mom.fromNow()
}

export function fromNowShort(date?: DateLike): string {
  if (date === undefined) return ''
  const mom = toMoment(date)
  return mom.fromNow(true)
    .replace(/a few seconds/g, 'seconds')
    .replace(/ seconds/g, 'seconds')
    .replace(/a minute/g, '1 min')
    .replace(/minutes/g, 'min')
    .replace(/an hour/g, '1 hour')
    .replace(/a month/g, 'months')
    .replace(/\d+ months/g, 'months')
    .replace(/a year/g, 'years')
    .replace(/\d+ years/g, 'years')
}

export function logLong(date?: DateLike): string {
  if (date === undefined) return ''
  const mom = toMoment(date)

  const logFormat = 'MMM-DD, yyyy @ hh:mm:ss'
  return mom.calendar({
    sameDay: '[Today @] hh:mm:ss',
    nextDay: '[Tomorrow @] hh:mm:ss',
    nextWeek: logFormat,
    lastDay: '[Yesterday @] hh:mm:ss',
    lastWeek: logFormat,
    sameElse: logFormat
  })
}

export function logShort(date?: DateLike): string {
  if (date === undefined) return ''
  const mom = toMoment(date)
  return mom.format('MMM-DD @ hh:mm:ss')
}

export function monthYear(date?: DateLike): string {
  if (date === undefined) return ''
  const mom = toMoment(date)
  return `${mom.format('MMM YYYY')}`
}

export function notiTime(date?: DateLike): string {
  if (date === undefined) return ''
  const mom = toMoment(date)
  const now = moment()

  const diffHours = mom.diff(now, 'hours', true)
  if (diffHours < 12) return mom.fromNow()
  if (diffHours < 24) return mom.calendar()
  return mom.format('MMM ddd')
}
