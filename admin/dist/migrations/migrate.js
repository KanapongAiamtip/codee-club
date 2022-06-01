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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dao_1 = require("@codee-club/common/dist/dao");
const object_extensions_1 = require("@codee-club/common/dist/utils/object-extensions");
const firebase_admin_initialized_1 = __importDefault(require("~/firebase-admin-initialized"));
const modes_1 = require("~/modes");
const db = firebase_admin_initialized_1.default.firestore();
const migrationsRef = db.collection(dao_1.CONFIG).doc(dao_1.CONFIG_MIGRATIONS);
function scanMigrations() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => {
            fs_1.default.readdir(__dirname, function (err, files) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(files
                    .filter(f => /^\d{3}-.*\.ts$/.test(f))
                    .map(f => f.replace(/\.ts$/, '')));
            });
        });
    });
}
function readMigration(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const fullPath = path_1.default.join(__dirname, `${name}.ts`);
        return yield Promise.resolve().then(() => __importStar(require(fullPath))).then((migration) => {
            if ('up' in migration) {
                return migration;
            }
            throw new Error('Badly formed migration');
        });
    });
}
function getCompletedMigrations() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const migrationsSnap = yield migrationsRef.get();
        const migrations = (_a = migrationsSnap.data()) !== null && _a !== void 0 ? _a : {};
        return object_extensions_1.keys(migrations).filter(m => migrations[m] === true);
    });
}
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.argv.includes('--yes')) {
        yield modes_1.productionWarning(__filename);
    }
    const foundMigrations = yield scanMigrations();
    const completedMigrations = yield getCompletedMigrations();
    const neededMigrations = foundMigrations
        .filter(m => !completedMigrations.includes(m))
        .sort((a, b) => a.localeCompare(b));
    if (neededMigrations.length === 0) {
        return console.info('\nMigrations up-to-date already');
    }
    for (const migrationName of neededMigrations) {
        console.info(`Migration: ${migrationName}`);
        const migration = yield readMigration(migrationName);
        yield migration.up(db);
        yield migrationsRef.set({ [migrationName]: true }, { merge: true });
        console.info(`Migration: ${migrationName} ✅`);
    }
    console.info('Complete');
});
exports.default = main;
//# sourceMappingURL=migrate.js.map