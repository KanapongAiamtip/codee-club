"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notiTime = exports.monthYear = exports.logShort = exports.logLong = exports.fromNowShort = exports.fromNow = exports.deadline = void 0;
const moment_1 = __importDefault(require("moment"));
function toMoment(date) {
    if (moment_1.default.isMoment(date))
        return date;
    if (date instanceof Date)
        return (0, moment_1.default)(date);
    return moment_1.default.unix(date.seconds);
}
function deadline(date) {
    if (date === undefined)
        return '';
    const mom = toMoment(date);
    return mom.calendar({
        sameDay: '[Today @] hh:mm',
        nextDay: '[Tomorrow @] hh:mm',
        nextWeek: 'dddd [@] hh:mm',
        lastDay: '[Yesterday @] hh:mm',
        lastWeek: '[Last] dddd',
        sameElse: 'MMM-DD'
    });
}
exports.deadline = deadline;
function fromNow(date) {
    if (date === undefined)
        return '';
    const mom = toMoment(date);
    return mom.fromNow();
}
exports.fromNow = fromNow;
function fromNowShort(date) {
    if (date === undefined)
        return '';
    const mom = toMoment(date);
    return mom.fromNow(true)
        .replace(/a few seconds/g, 'seconds')
        .replace(/ seconds/g, 'seconds')
        .replace(/a minute/g, '1 min')
        .replace(/minutes/g, 'min')
        .replace(/an hour/g, '1 hour')
        .replace(/a month/g, 'months')
        .replace(/\d+ months/g, 'months')
        .replace(/a year/g, 'years')
        .replace(/\d+ years/g, 'years');
}
exports.fromNowShort = fromNowShort;
function logLong(date) {
    if (date === undefined)
        return '';
    const mom = toMoment(date);
    const logFormat = 'MMM-DD, yyyy @ hh:mm:ss';
    return mom.calendar({
        sameDay: '[Today @] hh:mm:ss',
        nextDay: '[Tomorrow @] hh:mm:ss',
        nextWeek: logFormat,
        lastDay: '[Yesterday @] hh:mm:ss',
        lastWeek: logFormat,
        sameElse: logFormat
    });
}
exports.logLong = logLong;
function logShort(date) {
    if (date === undefined)
        return '';
    const mom = toMoment(date);
    return mom.format('MMM-DD @ hh:mm:ss');
}
exports.logShort = logShort;
function monthYear(date) {
    if (date === undefined)
        return '';
    const mom = toMoment(date);
    return `${mom.format('MMM YYYY')}`;
}
exports.monthYear = monthYear;
function notiTime(date) {
    if (date === undefined)
        return '';
    const mom = toMoment(date);
    const now = (0, moment_1.default)();
    const diffHours = mom.diff(now, 'hours', true);
    if (diffHours < 12)
        return mom.fromNow();
    if (diffHours < 24)
        return mom.calendar();
    return mom.format('MMM ddd');
}
exports.notiTime = notiTime;
//# sourceMappingURL=index.js.map