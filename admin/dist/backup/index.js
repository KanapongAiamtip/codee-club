"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const description = process.argv[2];
const projectAlias = process.argv[3];
if (!projectAlias || !description) {
    console.info('USAGE: yarn backup "SHORT DESCRIPTION" [ALIAS]');
    process.exit(1);
}
const pathToRoot = '../../../';
const firebaseRcPath = path_1.default.resolve(__dirname, pathToRoot, '.firebaserc');
const projects = JSON.parse(fs_1.default.readFileSync(firebaseRcPath, { encoding: 'utf8' })).projects;
const selectedProject = projects[projectAlias];
if (!selectedProject) {
    console.error(`No project for alias ${projectAlias}`);
    process.exit(1);
}
const buckets = {
    production: 'codee-club-backups',
    dev: 'codee-club-dev.appspot.com/backups'
};
const selectedBucket = buckets[projectAlias];
if (!selectedBucket) {
    console.error(`No backup bucket for ${projectAlias}`);
    process.exit(1);
}
const folder = (new Date()).toISOString().slice(0, 19).replace(/[:T]/g, '-') +
    '-' + description.replace(/[\W_]+/g, '-').toLowerCase();
const storageUrl = `gs://${selectedBucket}/${folder}`;
console.info(`Backing up ${selectedProject} to: ${storageUrl}`);
child_process_1.default.execSync(`gcloud firestore export ${storageUrl} --project ${selectedProject}`);
//# sourceMappingURL=index.js.map