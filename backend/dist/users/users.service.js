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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    dbService;
    constructor(dbService) {
        this.dbService = dbService;
    }
    async getProfile(userId) {
        const isSqlite = this.dbService.getIsSqlite();
        const userSql = `
      SELECT id, email, username, created_at, name, phone, 
             birthdate, gender, recipient_name, address, 
             detail_address, zipcode, contact_phone 
      FROM users WHERE id = $1 LIMIT 1
    `;
        const users = await this.dbService.query(isSqlite ? userSql.replace('$1', '?') : userSql, [userId]);
        if (users.length === 0) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        const user = users[0];
        const allergiesSql = `
      SELECT a.id, a.name, a.display_name, a.severity
      FROM user_allergies ua
      JOIN allergens a ON ua.allergen_id = a.id
      WHERE ua.user_id = $1
    `;
        const allergies = await this.dbService.query(isSqlite ? allergiesSql.replace('$1', '?') : allergiesSql, [userId]);
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            phone: user.phone,
            birthdate: user.birthdate,
            gender: user.gender,
            recipient_name: user.recipient_name,
            address: user.address,
            detail_address: user.detail_address,
            zipcode: user.zipcode,
            contact_phone: user.contact_phone,
            created_at: user.created_at,
            allergies: allergies.map((al) => ({
                id: al.id,
                name: al.name,
                display_name: al.display_name,
                severity: al.severity,
            })),
        };
    }
    async updateAllergies(userId, allergenDisplayNames) {
        const isSqlite = this.dbService.getIsSqlite();
        const deleteSql = 'DELETE FROM user_allergies WHERE user_id = $1';
        await this.dbService.query(isSqlite ? deleteSql.replace('$1', '?') : deleteSql, [userId]);
        for (const displayName of allergenDisplayNames) {
            if (!displayName.trim())
                continue;
            const selectSql = 'SELECT id FROM allergens WHERE display_name = $1 LIMIT 1';
            const existing = await this.dbService.query(isSqlite ? selectSql.replace('$1', '?') : selectSql, [displayName.trim()]);
            let allergenId;
            if (existing.length > 0) {
                allergenId = existing[0].id;
            }
            else {
                const nameKey = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
                const insertAllergenSql = 'INSERT INTO allergens (name, display_name, severity) VALUES ($1, $2, $3)';
                const insertRes = await this.dbService.query(isSqlite ? insertAllergenSql.replace('$1', '?').replace('$2', '?').replace('$3', '?') : insertAllergenSql, [nameKey, displayName.trim(), 2]);
                if (isSqlite) {
                    allergenId = insertRes[0].lastID;
                }
                else {
                    const retrieveSql = 'SELECT id FROM allergens WHERE display_name = $1 LIMIT 1';
                    const retrieved = await this.dbService.query(retrieveSql, [displayName.trim()]);
                    allergenId = retrieved[0].id;
                }
            }
            const insertUserAllergySql = 'INSERT INTO user_allergies (user_id, allergen_id) VALUES ($1, $2) ON CONFLICT DO NOTHING';
            await this.dbService.query(isSqlite ? insertUserAllergySql.replace('$1', '?').replace('$2', '?') : insertUserAllergySql, [userId, allergenId]);
        }
        return { message: '알레르기 설정이 성공적으로 저장되었습니다.' };
    }
    async updateProfile(userId, updateDto) {
        const isSqlite = this.dbService.getIsSqlite();
        const { email, currentPassword, newPassword, name, phone, birthdate, gender, recipient_name, address, detail_address, zipcode, contact_phone, } = updateDto;
        const checkSql = 'SELECT id FROM users WHERE email = $1 AND id != $2 LIMIT 1';
        const existing = await this.dbService.query(isSqlite ? checkSql.replace('$1', '?').replace('$2', '?') : checkSql, [email, userId]);
        if (existing.length > 0) {
            throw new common_1.NotFoundException('이미 사용 중인 이메일 주소입니다.');
        }
        let updateSql;
        let params;
        if (newPassword && newPassword.trim().length >= 6) {
            const userSql = 'SELECT password FROM users WHERE id = $1 LIMIT 1';
            const users = await this.dbService.query(isSqlite ? userSql.replace('$1', '?') : userSql, [userId]);
            if (users.length === 0) {
                throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
            }
            const dbPassword = users[0].password;
            const isPasswordValid = await bcrypt.compare(currentPassword || '', dbPassword);
            if (!isPasswordValid) {
                throw new common_1.BadRequestException('비밀번호가 틀렸습니다.');
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateSql = `
        UPDATE users SET 
          email = $1, password = $2, name = $3, phone = $4,
          birthdate = $5, gender = $6, recipient_name = $7,
          address = $8, detail_address = $9, zipcode = $10,
          contact_phone = $11
        WHERE id = $12
      `;
            params = [
                email,
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
                userId,
            ];
        }
        else {
            updateSql = `
        UPDATE users SET 
          email = $1, name = $2, phone = $3,
          birthdate = $4, gender = $5, recipient_name = $6,
          address = $7, detail_address = $8, zipcode = $9,
          contact_phone = $10
        WHERE id = $11
      `;
            params = [
                email,
                name,
                phone,
                birthdate || null,
                gender || null,
                recipient_name || null,
                address || null,
                detail_address || null,
                zipcode || null,
                contact_phone || null,
                userId,
            ];
        }
        await this.dbService.query(isSqlite ? updateSql.replace(/\$\d+/g, '?') : updateSql, params);
        return { message: '회원 정보가 성공적으로 수정되었습니다.' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map