"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const object_extensions_1 = require("@codee-club/common/dist/utils/object-extensions");
const string_cases_1 = require("@codee-club/common/dist/utils/string-cases");
const projectAlias = process.argv[2];
if (!projectAlias) {
    console.info('USAGE: yarn config:deploy PROJECT_ALIAS');
    process.exit(1);
}
const mode = projectAlias;
const pathToRoot = '../../../';
const configPath = path_1.default.join(__dirname, pathToRoot, `configs/functions.${mode}.json`);
if (mode === 'emu') {
    if (!fs_1.default.existsSync(configPath)) {
        const examplePath = path_1.default.join(__dirname, pathToRoot, 'configs/functions.example.json');
        fs_1.default.copyFileSync(examplePath, configPath);
    }
    const destinationPath = path_1.default.join(__dirname, pathToRoot, 'functions/.runtimeconfig.json');
    fs_1.default.copyFileSync(configPath, destinationPath);
    console.info('Copied emu config to functions/.runtimeconfig.json');
    process.exit(0);
}
const configString = fs_1.default.readFileSync(configPath, { encoding: 'utf8' });
const collectConfigLines = (config, pathPrefix, configLines) => {
    pathPrefix = pathPrefix || '';
    for (const key of object_extensions_1.keys(config)) {
        const path = pathPrefix + key;
        if (typeof config[key] === 'object') {
            collectConfigLines(config[key], path + '.', configLines);
        }
        else if (config[key] !== undefined) {
            configLines.push(`${path}=${JSON.stringify(config[key])}`);
        }
    }
};
const configSnaked = string_cases_1.camelToSnake(JSON.parse(configString), 3);
const configLines = [];
collectConfigLines(configSnaked, '', configLines);
const configKeyValuePairs = configLines.join(' ');
console.info(`Deploying config to ${projectAlias}: ${configKeyValuePairs}`);
child_process_1.default.execSync(`firebase -P ${projectAlias} functions:config:set ${configKeyValuePairs}`);
//# sourceMappingURL=functions-deploy.js.map