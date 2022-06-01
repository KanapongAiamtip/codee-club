"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("firebase/app"));
const moment_1 = __importDefault(require("moment"));
const object_extensions_1 = require("../object-extensions");
const _1 = require(".");
require("firebase/firestore");
require("jest-extended");
require("../test-extensions");
const toDate = (m) => m.toDate();
const toTimestamp = (m) => app_1.default.firestore.Timestamp.fromDate(toDate(m));
const nowUnixMillis = (0, moment_1.default)().valueOf() - 100000;
const nowMoment = () => (0, moment_1.default)(nowUnixMillis);
const getDatesKeyed = () => {
    const dateMinusYears = nowMoment().subtract(3, 'years');
    const dateMinusYear = nowMoment().subtract(1, 'years');
    const dateMinusMonths = nowMoment().subtract(3, 'months');
    const dateMinusMonth = nowMoment().subtract(1, 'months');
    const dateMinusWeeks = nowMoment().subtract(3, 'weeks');
    const dateMinusWeek = nowMoment().subtract(1, 'weeks');
    const dateMinusDays = nowMoment().subtract(10, 'days');
    const dateMinusDay = nowMoment().subtract(1, 'days');
    const dateMinusHours = nowMoment().subtract(14, 'hours');
    const dateMinusHour = nowMoment().subtract(1, 'hours');
    const dateMinusMinutes = nowMoment().subtract(40, 'minutes');
    const dateMinusMinute = nowMoment().subtract(1, 'minutes');
    const dateMinusSeconds = nowMoment().subtract(30, 'seconds');
    const dateMinusSecond = nowMoment().subtract(1, 'seconds');
    const datePlusSecond = nowMoment().add(1, 'seconds');
    const datePlusSeconds = nowMoment().add(30, 'seconds');
    const datePlusMinute = nowMoment().add(1, 'minutes');
    const datePlusMinutes = nowMoment().add(40, 'minutes');
    const datePlusHour = nowMoment().add(1, 'hours');
    const datePlusHours = nowMoment().add(14, 'hours');
    const datePlusDay = nowMoment().add(1, 'days');
    const datePlusDays = nowMoment().add(10, 'days');
    const datePlusWeek = nowMoment().add(1, 'weeks');
    const datePlusWeeks = nowMoment().add(3, 'weeks');
    const datePlusMonth = nowMoment().add(1, 'months');
    const datePlusMonths = nowMoment().add(3, 'months');
    const datePlusYear = nowMoment().add(1, 'years');
    const datePlusYears = nowMoment().add(2, 'years');
    return { dateMinusYears, dateMinusYear, dateMinusMonths, dateMinusMonth, dateMinusWeeks, dateMinusWeek, dateMinusDays, dateMinusDay, dateMinusHours, dateMinusHour, dateMinusMinutes, dateMinusMinute, dateMinusSeconds, dateMinusSecond, datePlusSecond, datePlusSeconds, datePlusMinute, datePlusMinutes, datePlusHour, datePlusHours, datePlusDay, datePlusDays, datePlusWeek, datePlusWeeks, datePlusMonth, datePlusMonths, datePlusYear, datePlusYears };
};
const getDates = () => (0, object_extensions_1.values)(getDatesKeyed());
const formatStringsHumanDate = ['[Today]', '[Tomorrow]', '[Yesterday]', '[Last]', '[Next]'];
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
};
const formatters = { deadline: _1.deadline, fromNow: _1.fromNow, fromNowShort: _1.fromNowShort, logLong: _1.logLong, logShort: _1.logShort, monthYear: _1.monthYear, notiTime: _1.notiTime };
const formatterKeys = (0, object_extensions_1.keys)(formatters);
const locales = ['en-us'];
const originalLocale = moment_1.default.locale();
const originalNow = moment_1.default.now;
afterAll(() => {
    moment_1.default.locale(originalLocale);
    moment_1.default.now = originalNow;
});
describe.each(locales)('With %s locale...', (locale) => {
    beforeEach(() => {
        moment_1.default.locale(locale);
        moment_1.default.now = () => nowUnixMillis;
    });
    test.each(formatterKeys)('%s should be date-type agnostic', (key) => {
        const formatter = formatters[key];
        const { dateMinusDays, datePlusDays } = getDatesKeyed();
        const equivalentGroups = [
            [dateMinusDays, toDate(dateMinusDays), toTimestamp(dateMinusDays)],
            [datePlusDays, toDate(datePlusDays), toTimestamp(datePlusDays)]
        ];
        equivalentGroups.forEach((group) => {
            const [first, ...rest] = group;
            const firstResult = formatter(first);
            rest.forEach(equivalent => {
                const formatted = formatter(equivalent);
                expect(formatted).toEqual(firstResult);
            });
        });
    });
    const formatterLengthLimits = { fromNowShort: 8, logShort: 18 };
    const formatterLengthLimitKeys = (0, object_extensions_1.keys)(formatterLengthLimits);
    test.each(formatterLengthLimitKeys)('%s should respect length limit', (key) => {
        const formatter = formatters[key];
        const limit = formatterLengthLimits[key];
        getDates().forEach(date => {
            const formatted = formatter(date);
            expect(formatted).toHaveLengthLessOrEqual(limit);
        });
    });
    const formatterRequiredGroups = {
        monthYear: ['month', 'year'],
        logLong: ['year', 'month', 'dayofmonth', 'hour', 'minute', 'second'],
        logShort: ['month', 'dayofmonth', 'hour', 'minute', 'second']
    };
    const formatterRequiredGroupKeys = (0, object_extensions_1.keys)(formatterRequiredGroups);
    test.each(formatterRequiredGroupKeys)('%s should include required date-parts', (key) => {
        const formatter = formatters[key];
        const requiredGroups = formatterRequiredGroups[key];
        getDates().forEach(date => {
            const formatted = formatter(date);
            requiredGroups.forEach(group => {
                const formatStrings = formatStringGroups[group];
                const formattedParts = formatStrings.map(formatString => date.format(formatString));
                expect(formatted).toIncludeAny(formattedParts);
            });
        });
    });
});
//# sourceMappingURL=index.test.js.map