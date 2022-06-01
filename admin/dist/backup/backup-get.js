"use strict";
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
const fs_1 = __importDefault(require("fs"));
const inquirer_1 = __importDefault(require("inquirer"));
const lodash_1 = require("lodash");
const path_1 = __importDefault(require("path"));
const tasuku_1 = __importDefault(require("tasuku"));
const object_extensions_1 = require("@codee-club/common/dist/utils/object-extensions");
const firebase_admin_initialized_1 = require("~/firebase-admin-initialized");
const modes_1 = require("~/modes");
const pathToRoot = '../../../';
const pathBackupDirectory = path_1.default.resolve(__dirname, pathToRoot, 'backups');
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield modes_1.productionWarning(__filename);
    fs_1.default.mkdirSync(pathBackupDirectory, { recursive: true });
    const backupsLocal = new Set(fs_1.default.readdirSync(pathBackupDirectory, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name));
    const bucket = 'codee-club-backups';
    const [files] = yield firebase_admin_initialized_1.storage.bucket(bucket).getFiles();
    const backupsCloudFiles = lodash_1.groupBy(files, file => file.name.split('/')[0]);
    const backupsCloud = new Set(object_extensions_1.keys(backupsCloudFiles));
    const results = yield inquirer_1.default.prompt([{
            name: 'selectedBackups',
            message: 'Select backups to download (newest first)',
            type: 'checkbox',
            choices: [
                ...[...backupsCloud].sort().reverse().map(name => ({ name, checked: backupsLocal.has(name), disabled: backupsLocal.has(name) ? 'already downloaded' : false })),
                new inquirer_1.default.Separator()
            ]
        }]);
    const selectedBackups = results.selectedBackups;
    if (selectedBackups.length === 0)
        return console.log('No backups selected (press space to select)');
    const filesToDownload = selectedBackups
        .flatMap((selectedBackup) => backupsCloudFiles[selectedBackup])
        .map((file) => [file.name, path_1.default.resolve(pathBackupDirectory, file.name)]);
    const destinationDirectories = new Set(filesToDownload.map(pair => path_1.default.dirname(pair[1])));
    destinationDirectories.forEach(destinationDirectory => fs_1.default.mkdirSync(destinationDirectory, { recursive: true }));
    const downloadTasks = yield tasuku_1.default.group(task => filesToDownload.map(pair => task(`Downloading: ${pair[0]}`, () => __awaiter(void 0, void 0, void 0, function* () {
        return yield firebase_admin_initialized_1.storage.bucket(bucket)
            .file(pair[0])
            .download({ destination: pair[1] });
    }))), { concurrency: 5 });
    downloadTasks.clear();
    console.log(`Download complete (${selectedBackups.length} backups; ${filesToDownload.length} files)`);
    const latestNewBackup = selectedBackups[0];
    const emulatorJson = {
        version: '8.4.2',
        firestore: {
            version: '1.11.4',
            path: latestNewBackup,
            metadata_file: `${latestNewBackup}/${latestNewBackup}.overall_export_metadata`
        }
    };
    fs_1.default.writeFileSync(path_1.default.resolve(pathBackupDirectory, 'firebase-export-metadata.json'), JSON.stringify(emulatorJson, null, 2));
    console.log(`Updated default: ${latestNewBackup}`);
});
main().catch(error => console.error(error));
//# sourceMappingURL=backup-get.js.map