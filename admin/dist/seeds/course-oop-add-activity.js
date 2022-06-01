"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mapValues_1 = __importDefault(require("lodash/mapValues"));
const moment_1 = __importDefault(require("moment"));
const dao_1 = require("@codee-club/common/dist/dao");
const object_extensions_1 = require("@codee-club/common/dist/utils/object-extensions");
const context_1 = require("~/context");
const firebase_admin_initialized_1 = __importStar(require("~/firebase-admin-initialized"));
const modes_1 = require("~/modes");
const course_oop_activity2_1 = require("./data-oop/course-oop-activity2");
const course_oop_activity3_1 = require("./data-oop/course-oop-activity3");
const course_oop_activity4_1 = require("./data-oop/course-oop-activity4");
const course_oop_activity5_1 = require("./data-oop/course-oop-activity5");
const allActivities = {
    2: course_oop_activity2_1.activityAndProblems,
    3: course_oop_activity3_1.activityAndProblems,
    4: course_oop_activity4_1.activityAndProblems,
    5: course_oop_activity5_1.activityAndProblems
};
const main = (args) => __awaiter(void 0, void 0, void 0, function* () {
    yield modes_1.productionWarning(__filename);
    const dao = new dao_1.Dao(context_1.context);
    const activityIndex = args[args.length - 1];
    const activityAndProblems = allActivities[activityIndex];
    if (!activityAndProblems) {
        return console.error(`Last argument should be a valid activity number. Options are: ${object_extensions_1.keys(allActivities).join(', ')}`);
    }
    const courseSnapshot = (yield firebase_admin_initialized_1.db.collection(dao_1.COURSES).where('code', '==', '254275').get()).docs[0];
    const courseId = courseSnapshot.id;
    const course = courseSnapshot.data();
    const { activity, problems, deadline } = activityAndProblems;
    activity.sectionIds = object_extensions_1.keys(course.sections);
    activity.deadlines = mapValues_1.default(course.sections, () => firebase_admin_initialized_1.default.firestore.Timestamp.fromDate(moment_1.default(deadline).toDate()));
    const activityId = yield dao.createActivity(courseId, activity);
    yield dao.createProblems(activityId, problems);
});
main(process.argv)
    .then(() => process.exit())
    .catch((error) => console.error(error));
//# sourceMappingURL=course-oop-add-activity.js.map