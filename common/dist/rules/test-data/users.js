"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clare = exports.bertha = exports.alice = void 0;
const rules_unit_testing_1 = require("@firebase/rules-unit-testing");
exports.alice = {
    nameFirst: 'Alice',
    nameLast: 'Arrawadee',
    name: 'Alice Arrawadee',
    createdAt: rules_unit_testing_1.firestore.FieldValue.serverTimestamp(),
    followerIds: []
};
exports.bertha = {
    nameFirst: 'Bertha',
    nameLast: 'Bridgewater',
    name: 'Bertha Bridgewater',
    createdAt: rules_unit_testing_1.firestore.FieldValue.serverTimestamp(),
    followerIds: []
};
exports.clare = {
    nameFirst: 'Clare',
    nameLast: 'Clutterhouse',
    name: 'Clare Clutterhouse',
    createdAt: rules_unit_testing_1.firestore.FieldValue.serverTimestamp(),
    followerIds: []
};
//# sourceMappingURL=users.js.map