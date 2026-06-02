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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const database_service_1 = require("../database/database.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = AuthService_1 = class AuthService {
    dbService;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(dbService, jwtService) {
        this.dbService = dbService;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const isSqlite = this.dbService.getIsSqlite();
        const sql = isSqlite
            ? 'SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1'
            : 'SELECT * FROM users WHERE email = $1 OR username = $2 LIMIT 1';
        const users = await this.dbService.query(sql, [email, email]);
        if (users.length === 0) {
            throw new common_1.UnauthorizedException('이메일/아이디 또는 비밀번호가 올바르지 않습니다.');
        }
        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('이메일/아이디 또는 비밀번호가 올바르지 않습니다.');
        }
        const payload = { sub: user.id, email: user.email, username: user.username };
        const token = await this.jwtService.signAsync(payload);
        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name,
            },
        };
    }
    async register(registerDto) {
        const { email, username, password, name, phone, birthdate, gender, recipient_name, address, detail_address, zipcode, contact_phone, } = registerDto;
        const checkSql = 'SELECT id FROM users WHERE email = $1 OR username = $2 LIMIT 1';
        const existingUsers = await this.dbService.query(this.dbService.getIsSqlite() ? checkSql.replace('$1', '?').replace('$2', '?') : checkSql, [email, username]);
        if (existingUsers.length > 0) {
            throw new common_1.ConflictException('이미 존재하는 이메일 또는 아이디입니다.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const isSqlite = this.dbService.getIsSqlite();
        const insertSql = `
      INSERT INTO users (
        email, username, password, name, phone, 
        birthdate, gender, recipient_name, address, 
        detail_address, zipcode, contact_phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `;
        await this.dbService.query(isSqlite ? insertSql.replace(/\$\d+/g, '?') : insertSql, [
            email,
            username,
            hashedPassword,
            name,
            phone,
            birthdate || null,
            gender || null,
            recipient_name || null,
            address || null,
            detail_address || null,
            zipcode || null,
            contact_phone || null,
        ]);
        return this.login({ email, password });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map