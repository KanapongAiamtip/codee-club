import firebase from 'firebase/app'
import moment, { Moment } from 'moment'

import { keys, values } from '../object-extensions'

import { deadline, fromNow, fromNowShort, logLong, logShort, monthYear, notiTime } from '.'

import 'firebase/firestore'
import 'jest-extended'
import '../test-extensions'

// #region Data
const toDate = (m: Moment): Date => m.toDate()
const toTimestamp = (m: Moment): firebase.firestore.Timestamp => firebase.firestore.Timestamp.fromDate(toDate(m))

const nowUnixMillis = moment().valueOf() - 100_000 // arbitrary date
const nowMoment = (): Moment => moment(nowUnixMillis) // new clone, respecting current locale

const getDatesKeyed = (): Record<string, Moment> => {
  // Before "now"
  const dateMinusYears = nowMoment().subtract(3, 'years')
  const dateMinusYear = nowMoment().subtract(1, 'years')
  const dateMinusMonths = nowMoment().subtract(3, 'months')
  const dateMinusMonth = nowMoment().subtract(1, 'months')
  const dateMinusWeeks = nowMoment().subtract(3, 'weeks')
  const dateMinusWeek = nowMoment().subtract(1, 'weeks')
  const dateMinusDays = nowMoment().subtract(10, 'days')
  const dateMinusDay = nowMoment().subtract(1, 'days')
  const dateMinusHours = nowMoment().subtract(14, 'hours')
  const dateMinusHour = nowMoment().subtract(1, 'hours')
  const dateMinusMinutes = nowMoment().subtract(40, 'minutes')
  const dateMinusMinute = nowMoment().subtract(1, 'minutes')
  const dateMinusSeconds = nowMoment().subtract(30, 'seconds')
  const dateMinusSecond = nowMoment().subtract(1, 'seconds')

  // After "now"
  const datePlusSecond = nowMoment().add(1, 'seconds')
  const datePlusSeconds = nowMoment().add(30, 'seconds')
  const datePlusMinute = nowMoment().add(1, 'minutes')
  const datePlusMinutes = nowMoment().add(40, 'minutes')
  const datePlusHour = nowMoment().add(1, 'hours')
  const datePlusHours = nowMoment().add(14, 'hours')
  const datePlusDay = nowMoment().add(1, 'days')
  const datePlusDays = nowMoment().add(10, 'days')
  const datePlusWeek = nowMoment().add(1, 'weeks')
  const datePlusWeeks = nowMoment().add(3, 'weeks')
  const datePlusMonth = nowMoment().add(1, 'months')
  const datePlusMonths = nowMoment().add(3, 'months')
  const datePlusYear = nowMoment().add(1, 'years')
  const datePlusYears = nowMoment().add(2, 'years')

  return { dateMinusYears, dateMinusYear, dateMinusMonths, dateMinusMonth, dateMinusWeeks, dateMinusWeek, dateMinusDays, dateMinusDay, dateMinusHours, dateMinusHour, dateMinusMinutes, dateMinusMinute, dateMinusSeconds, dateMinusSecond, datePlusSecond, datePlusSeconds, datePlusMinute, datePlusMinutes, datePlusHour, datePlusHours, datePlusDay, datePlusDays, datePlusWeek, datePlusWeeks, datePlusMonth, datePlusMonths, datePlusYear, datePlusYears }
}
const getDates = (): Moment[] => values(getDatesKeyed())

const formatStringsHumanDate = ['[Today]', '[Tomorrow]', '[Yesterday]', '[Last]', '[Next]']
const formatStringGroups = {
  ampm: ['A', 'a'],
  dayofmonth: ['D', 'Do', 'DD', ...formatStringsHumanDate],
  dayofweek: ['d', 'do', 'dd', 'ddd', 'dddd', 'e', 'E', ...formatStringsHumanDate],
  dayofyear: ['DDD', 'DDDo', 'DDDD', ...formatStringsHumanDate],
  era: ['N', 'NN', 'NNN', 'NNNN', 'NNNNN'],
  fractionalsecond: ['S', 'SS', 'SSS', 'SSSS', 'SSSSS', 'SSSSSS', 'SSSSSSS', 'SSSSSSSS', 'SSSSSSSSS'],
  hour: ['H', 'HH', 'h', 'hh', 'k', 'kk'],
  minute: ['m', 'mm'],
  month: ['M', 'Mo', 'MM', 'MMM', 'MMMM', ...formatStringsHumanDate],
  quarter: ['Q', 'Qo', ...formatStringsHumanDate],
  second: ['s', 'ss'],
  timezone: ['z', 'zz', 'Z', 'ZZ'],
  unix: ['X', 'x'],
  weekofyear: ['w', 'wo', 'ww', 'W', 'Wo', 'WW'],
  weekyear: ['gg', 'gggg', 'GG', 'GGGG'],
  year: ['YY', 'YYYY', 'YYYYYY', 'y', ...formatStringsHumanDate]
}
// #endregion Data

// #region Tests
const formatters = { deadline, fromNow, fromNowShort, logLong, logShort, monthYear, notiTime }
const formatterKeys = keys(formatters) as Array<keyof typeof formatters>

const locales = ['en-us'/*, 'th-th' */]

const originalLocale = moment.locale()
const originalNow = moment.now

afterAll(() => {
  moment.locale(originalLocale)
  moment.now = originalNow
})

describe.each(locales)('With %s locale...', (locale) => {
  beforeEach(() => {
    moment.locale(locale)
    moment.now = () => nowUnixMillis
  })

  /**
   * Date-type agnostic
   */
  test.each(formatterKeys)('%s should be date-type agnostic', (key) => {
    // Arrange
    const formatter = formatters[key]
    const { dateMinusDays, datePlusDays } = getDatesKeyed()
    const equivalentGroups = [
      [dateMinusDays, toDate(dateMinusDays), toTimestamp(dateMinusDays)],
      [datePlusDays, toDate(datePlusDays), toTimestamp(datePlusDays)]
    ]

    // Act
    equivalentGroups.forEach((group) => {
      const [first, ...rest] = group
      const firstResult = formatter(first)

      rest.forEach(equivalent => {
        const formatted = formatter(equivalent)

        // Assert
        expect(formatted).toEqual(firstResult)
      })
    })
  })

  /**
   * Length limit
   */
  const formatterLengthLimits = { fromNowShort: 8, logShort: 18 }
  const formatterLengthLimitKeys = keys(formatterLengthLimits) as Array<keyof typeof formatterLengthLimits>

  test.each(formatterLengthLimitKeys)('%s should respect length limit', (key) => {
    // Arange
    const formatter = formatters[key]
    const limit = formatterLengthLimits[key]

    // Act
    getDates().forEach(date => {
      const formatted = formatter(date)

      // Assert
      expect(formatted).toHaveLengthLessOrEqual(limit)
    })
  })

  /**
   * Require specific date information
   */
  const formatterRequiredGroups = {
    monthYear: ['month', 'year'],
    logLong: ['year', 'month', 'dayofmonth', 'hour', 'minute', 'second'],
    logShort: ['month', 'dayofmonth', 'hour', 'minute', 'second']
  }
  const formatterRequiredGroupKeys = keys(formatterRequiredGroups) as Array<keyof typeof formatterRequiredGroups>

  test.each(formatterRequiredGroupKeys)('%s should include required date-parts', (key) => {
    // Arrange
    const formatter = formatters[key]
    const requiredGroups = formatterRequiredGroups[key]

    // Act
    getDates().forEach(date => {
      const formatted = formatter(date)

      requiredGroups.forEach(group => {
        const formatStrings = formatStringGroups[group as keyof typeof formatStringGroups]
        const formattedParts = formatStrings.map(formatString => date.format(formatString))

        // Assert
        expect(formatted).toIncludeAny(formattedParts)
      })
    })
  })
})
// #endregion Tests
