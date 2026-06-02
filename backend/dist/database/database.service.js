"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pg_1 = require("pg");
const sqlite3 = __importStar(require("sqlite3"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let DatabaseService = DatabaseService_1 = class DatabaseService {
    configService;
    logger = new common_1.Logger(DatabaseService_1.name);
    pgPool = null;
    sqliteDb = null;
    isSqlite = false;
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        await this.initializeDatabase();
        await this.ensureAllergenAliasTable();
        await this.ensureAllergens();
        await this.seedAllergenAliases();
    }
    async onModuleDestroy() {
        if (this.pgPool) {
            await this.pgPool.end();
            this.logger.log('PostgreSQL pool closed.');
        }
        if (this.sqliteDb) {
            await new Promise((resolve, reject) => {
                this.sqliteDb.close((err) => {
                    if (err) {
                        this.logger.error(`Error closing SQLite DB: ${err.message}`);
                        reject(err);
                    }
                    else {
                        this.logger.log('SQLite database connection closed.');
                        resolve();
                    }
                });
            });
        }
    }
    async initializeDatabase() {
        const host = this.configService.get('DB_HOST', 'localhost');
        const port = this.configService.get('DB_PORT', 5432);
        const user = this.configService.get('DB_USER', 'allergy_admin');
        const password = this.configService.get('DB_PASSWORD', 'allergy_password');
        const database = this.configService.get('DB_NAME', 'allergyfree_db');
        try {
            this.logger.log(`Attempting to connect to PostgreSQL at ${host}:${port}...`);
            const pool = new pg_1.Pool({
                host,
                port,
                user,
                password,
                database,
                connectionTimeoutMillis: 2000,
            });
            await pool.query('SELECT NOW()');
            this.pgPool = pool;
            this.isSqlite = false;
            this.logger.log('Successfully connected to PostgreSQL database.');
        }
        catch (err) {
            this.logger.warn(`PostgreSQL connection failed: ${err.message}`);
            this.logger.log('Falling back to SQLite database...');
            await this.initializeSqlite();
        }
    }
    async initializeSqlite() {
        this.isSqlite = true;
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        const dbPath = path.join(dataDir, 'allergyfree.db');
        const isNewDb = !fs.existsSync(dbPath);
        this.sqliteDb = new sqlite3.Database(dbPath);
        await this.runSqliteQuery('PRAGMA foreign_keys = ON;');
        if (isNewDb) {
            this.logger.log('New SQLite database detected. Executing schema and seed scripts...');
            await this.loadSchemaAndSeed();
        }
        else {
            this.logger.log('Loaded existing SQLite database.');
        }
    }
    async loadSchemaAndSeed() {
        try {
            const rootDir = path.join(process.cwd(), '..');
            const schemaPath = path.join(rootDir, 'schema.sql');
            const seedPath = path.join(rootDir, 'seed.sql');
            if (fs.existsSync(schemaPath)) {
                this.logger.log(`Executing schema: ${schemaPath}`);
                const schemaSql = fs.readFileSync(schemaPath, 'utf8');
                await this.executeMultiStatementSqlite(this.translateToSqlite(schemaSql));
            }
            else {
                this.logger.error(`schema.sql not found at ${schemaPath}`);
            }
            if (fs.existsSync(seedPath)) {
                this.logger.log(`Executing seed data: ${seedPath}`);
                const seedSql = fs.readFileSync(seedPath, 'utf8');
                await this.executeMultiStatementSqlite(this.translateToSqlite(seedSql));
            }
            else {
                this.logger.error(`seed.sql not found at ${seedPath}`);
            }
        }
        catch (err) {
            this.logger.error(`Error during SQLite schema/seeding: ${err.message}`);
        }
    }
    translateToSqlite(sql) {
        return sql
            .replace(/BIGSERIAL PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
            .replace(/BIGINT REFERENCES/gi, 'INTEGER REFERENCES')
            .replace(/BIGINT/gi, 'INTEGER');
    }
    async executeMultiStatementSqlite(sql) {
        return new Promise((resolve, reject) => {
            this.sqliteDb.exec(sql, (err) => {
                if (err) {
                    this.logger.error(`SQLite Exec error: ${err.message}`);
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    async runSqliteQuery(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.sqliteDb.run(sql, params, function (err) {
                if (err)
                    reject(err);
                else
                    resolve({ lastID: this.lastID, changes: this.changes });
            });
        });
    }
    async query(sql, params = []) {
        if (!this.isSqlite) {
            const res = await this.pgPool.query(sql, params);
            return res.rows;
        }
        else {
            const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
            if (isSelect) {
                return new Promise((resolve, reject) => {
                    this.sqliteDb.all(sql, params, (err, rows) => {
                        if (err)
                            reject(err);
                        else
                            resolve(rows);
                    });
                });
            }
            else {
                const result = await this.runSqliteQuery(sql, params);
                return [result];
            }
        }
    }
    async ensureAllergens() {
        try {
            const standardAllergens = [
                { name: 'egg', display_name: '난류(계란)', severity: 3 },
                { name: 'milk', display_name: '우유', severity: 3 },
                { name: 'buckwheat', display_name: '메밀', severity: 3 },
                { name: 'peanut', display_name: '땅콩', severity: 3 },
                { name: 'soybean', display_name: '대두', severity: 3 },
                { name: 'wheat', display_name: '밀', severity: 3 },
                { name: 'shrimp', display_name: '새우', severity: 3 },
                { name: 'crab', display_name: '게', severity: 3 },
                { name: 'squid', display_name: '오징어', severity: 3 },
                { name: 'mackerel', display_name: '고등어', severity: 3 },
                { name: 'shellfish', display_name: '조개류 (굴, 전복, 홍합 등)', severity: 3 },
                { name: 'beef', display_name: '쇠고기', severity: 3 },
                { name: 'pork', display_name: '돼지고기', severity: 3 },
                { name: 'chicken', display_name: '닭고기', severity: 3 },
                { name: 'walnut', display_name: '호두', severity: 3 },
                { name: 'pine_nut', display_name: '잣', severity: 3 },
                { name: 'peach', display_name: '복숭아', severity: 3 },
                { name: 'tomato', display_name: '토마토', severity: 3 },
                { name: 'kiwi', display_name: '키위', severity: 3 },
                { name: 'sulfites', display_name: '아황산류 (보존제)', severity: 3 },
                { name: 'nuts', display_name: '견과류', severity: 2 },
                { name: 'seafood', display_name: '해산물', severity: 2 }
            ];
            for (const a of standardAllergens) {
                const sql = 'INSERT INTO allergens (name, display_name, severity) VALUES ($1, $2, $3) ON CONFLICT(name) DO NOTHING';
                await this.query(this.isSqlite ? sql.replace('$1', '?').replace('$2', '?').replace('$3', '?') : sql, [a.name, a.display_name, a.severity]);
            }
            this.logger.log('Standard allergens verified and inserted.');
        }
        catch (err) {
            this.logger.error(`Error ensuring standard allergens: ${err.message}`);
        }
    }
    async ensureAllergenAliasTable() {
        try {
            this.logger.log('Checking allergen_alias table...');
            let sql = '';
            if (this.isSqlite) {
                sql = `
          CREATE TABLE IF NOT EXISTS allergen_alias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            allergen_id INTEGER REFERENCES allergens(id) ON DELETE CASCADE,
            keyword VARCHAR(255) NOT NULL,
            UNIQUE (allergen_id, keyword)
          );
        `;
            }
            else {
                sql = `
          CREATE TABLE IF NOT EXISTS allergen_alias (
            id BIGSERIAL PRIMARY KEY,
            allergen_id BIGINT REFERENCES allergens(id) ON DELETE CASCADE,
            keyword VARCHAR(255) NOT NULL,
            UNIQUE (allergen_id, keyword)
          );
        `;
            }
            await this.query(sql);
            this.logger.log('allergen_alias table verified/created.');
        }
        catch (err) {
            this.logger.error(`Error ensuring allergen_alias table: ${err.message}`);
        }
    }
    async seedAllergenAliases() {
        try {
            const rows = await this.query('SELECT COUNT(*) as count FROM allergen_alias');
            const count = rows[0]?.count ?? rows[0]?.['count'] ?? rows[0]?.['COUNT(*)'] ?? 0;
            if (Number(count) > 0) {
                this.logger.log('allergen_alias already has data. Skipping seed.');
                return;
            }
            this.logger.log('Seeding allergen_alias table...');
            const aliases = [
                { name: 'egg', keywords: ['난류', '계란', '달걀', 'egg', '조류', '난황', '난백'] },
                { name: 'milk', keywords: ['우유', '탈지분유', '전지분유', '유당', '밀크', 'milk', '락토', '유청', '카제인'] },
                { name: 'buckwheat', keywords: ['메밀', 'buckwheat'] },
                { name: 'peanut', keywords: ['땅콩', 'peanut', '땅콩버터'] },
                { name: 'soybean', keywords: ['대두', '소이', '콩', 'soybean', '레시틴', '두유'] },
                { name: 'wheat', keywords: ['밀', '밀가루', '소맥', 'wheat', '글루텐', '호밀', '호밀가루', '귀리', '귀리액'] },
                { name: 'shrimp', keywords: ['새우', 'shrimp'] },
                { name: 'crab', keywords: ['게', '꽃게', 'crab'] },
                { name: 'squid', keywords: ['오징어', 'squid'] },
                { name: 'mackerel', keywords: ['고등어', 'mackerel'] },
                { name: 'shellfish', keywords: ['조개', '굴', '전복', '홍합', 'shellfish', '바지락', '꼬막', '조개류'] },
                { name: 'beef', keywords: ['쇠고기', '소고기', 'beef'] },
                { name: 'pork', keywords: ['돼지고기', '돈육', 'pork'] },
                { name: 'chicken', keywords: ['닭고기', '계육', 'chicken'] },
                { name: 'walnut', keywords: ['호두', 'walnut'] },
                { name: 'pine_nut', keywords: ['잣', 'pine_nut'] },
                { name: 'peach', keywords: ['복숭아', 'peach'] },
                { name: 'tomato', keywords: ['토마토', 'tomato'] },
                { name: 'kiwi', keywords: ['키위', 'kiwi'] },
                { name: 'sulfites', keywords: ['아황산', 'sulfite'] },
                { name: 'nuts', keywords: ['견과', '견과류', '넛'] },
                { name: 'seafood', keywords: ['해산물', '어패류'] }
            ];
            for (const item of aliases) {
                const findSql = `SELECT id FROM allergens WHERE name = $1 LIMIT 1`;
                const allergens = await this.query(this.isSqlite ? findSql.replace('$1', '?') : findSql, [item.name]);
                if (allergens.length === 0)
                    continue;
                const allergenId = allergens[0].id;
                for (const kw of item.keywords) {
                    const insertSql = `
            INSERT INTO allergen_alias (allergen_id, keyword)
            VALUES ($1, $2)
            ON CONFLICT (allergen_id, keyword) DO NOTHING
          `;
                    await this.query(this.isSqlite ? insertSql.replace('$1', '?').replace('$2', '?') : insertSql, [allergenId, kw]);
                }
            }
            this.logger.log('allergen_alias table seeded successfully.');
        }
        catch (err) {
            this.logger.error(`Error seeding allergen_alias: ${err.message}`);
        }
    }
    getIsSqlite() {
        return this.isSqlite;
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = DatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseService);
//# sourceMappingURL=database.service.js.map