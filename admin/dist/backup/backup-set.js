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
const promises_1 = __importDefault(require("fs/promises"));
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const pathToRoot = '../../..';
    const pathBackupDirectory = path_1.default.resolve(__dirname, pathToRoot, 'backups');
    yield promises_1.default.mkdir(pathBackupDirectory, { recursive: true });
    const configFilename = 'firebase-export-metadata.json';
    const configPath = path_1.default.resolve(pathBackupDirectory, configFilename);
    const currentBackup = yield promises_1.default.readFile(configPath).then(data => JSON.parse(data.toString()).firestore.path).catch(() => '');
    const directoryNames = (yield promises_1.default.readdir(pathBackupDirectory))
        .filter(name => !name.endsWith('.json'))
        .sort()
        .reverse();
    if (directoryNames.length === 0) {
        console.warn('No backups found. Use either:\n- cd admin && yarn backup-get --mode=production\n- yarn emu --export-on-exit="./backups/my-local-backup"');
        process.exit(1);
    }
    const metaPaths = directoryNames.map(name => [name, path_1.default.resolve(pathBackupDirectory, name, `${name}.overall_export_metadata`)]);
    const metaPathsAndConfig = currentBackup.length > 0 ? [[configFilename, configPath], ...metaPaths] : metaPaths;
    const stats = yield Promise.all(metaPathsAndConfig.map((nameAndPath) => __awaiter(void 0, void 0, void 0, function* () { return [nameAndPath[0], yield promises_1.default.stat(nameAndPath[1])]; })));
    const mostRecent = stats.sort((f1, f2) => f2[1].mtime.getTime() - f1[1].mtime.getTime())[0];
    const suggestedBackup = (mostRecent[0].endsWith(configFilename))
        ? currentBackup
        : mostRecent[0];
    const results = yield inquirer_1.default.prompt([{
            name: 'selectedBackup',
            message: 'Pick the backup to import',
            type: 'list',
            choices: directoryNames.map(name => currentBackup === name ? `${name} (current)` : (suggestedBackup === name ? `${name} (latest)` : name)),
            default: directoryNames.indexOf(suggestedBackup)
        }]);
    const selectedBackup = results.selectedBackup.replace(' (latest)', '').replace(' (current)', '');
    if (selectedBackup === currentBackup)
        return;
    const emulatorJson = {
        version: '8.4.2',
        firestore: {
            version: '1.11.4',
            path: selectedBackup,
            metadata_file: `${selectedBackup}/${selectedBackup}.overall_export_metadata`
        }
    };
    yield promises_1.default.writeFile(path_1.default.resolve(pathBackupDirectory, configFilename), JSON.stringify(emulatorJson, null, 2));
});
main().catch(error => console.error(error));
//# sourceMappingURL=backup-set.js.map