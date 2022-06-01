"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemResultStatus = exports.TestResultStatus = exports.ActivityStatus = exports.TestVisibility = void 0;
var TestVisibility;
(function (TestVisibility) {
    TestVisibility["Visible"] = "VISIBLE";
    TestVisibility["Hidden"] = "HIDDEN";
})(TestVisibility = exports.TestVisibility || (exports.TestVisibility = {}));
var ActivityStatus;
(function (ActivityStatus) {
    ActivityStatus["Draft"] = "DRAFT";
    ActivityStatus["Published"] = "PUBLISHED";
    ActivityStatus["Locked"] = "LOCKED";
})(ActivityStatus = exports.ActivityStatus || (exports.ActivityStatus = {}));
var TestResultStatus;
(function (TestResultStatus) {
    TestResultStatus["Pass"] = "PASS";
    TestResultStatus["Fail"] = "FAIL";
    TestResultStatus["Error"] = "ERROR";
    TestResultStatus["Timeout"] = "TIMEOUT";
})(TestResultStatus = exports.TestResultStatus || (exports.TestResultStatus = {}));
var ProblemResultStatus;
(function (ProblemResultStatus) {
    ProblemResultStatus["Evaluating"] = "EVALUATING";
    ProblemResultStatus["Pass"] = "PASS";
    ProblemResultStatus["Fail"] = "FAIL";
    ProblemResultStatus["Invalid"] = "INVALID";
    ProblemResultStatus["Timeout"] = "TIMEOUT";
    ProblemResultStatus["Error"] = "ERROR";
})(ProblemResultStatus = exports.ProblemResultStatus || (exports.ProblemResultStatus = {}));
//# sourceMappingURL=enums.js.map