import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private dbService: DatabaseService) {}

  async getProfile(userId: number) {
    const isSqlite = this.dbService.getIsSqlite();
    
    // 1. Get user info
    const userSql = `
      SELECT id, email, username, created_at, name, phone, 
             birthdate, gender, recipient_name, address, 
             detail_address, zipcode, contact_phone 
      FROM users WHERE id = $1 LIMIT 1
    `;
    const users = await this.dbService.query<any>(
      isSqlite ? userSql.replace('$1', '?') : userSql,
      [userId]
    );

    if (users.length === 0) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const user = users[0];

    // 2. Get user allergies
    const allergiesSql = `
      SELECT a.id, a.name, a.display_name, a.severity
      FROM user_allergies ua
      JOIN allergens a ON ua.allergen_id = a.id
      WHERE ua.user_id = $1
    `;
    const allergies = await this.dbService.query<any>(
      isSqlite ? allergiesSql.replace('$1', '?') : allergiesSql,
      [userId]
    );

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

  async updateAllergies(userId: number, allergenDisplayNames: string[]) {
    const isSqlite = this.dbService.getIsSqlite();

    // 1. Delete all current mapping for this user in user_allergies
    const deleteSql = 'DELETE FROM user_allergies WHERE user_id = $1';
    await this.dbService.query(
      isSqlite ? deleteSql.replace('$1', '?') : deleteSql,
      [userId]
    );

    // 2. Loop through each allergen display name
    for (const displayName of allergenDisplayNames) {
      if (!displayName.trim()) continue;

      // Check if it exists in allergens table
      const selectSql = 'SELECT id FROM allergens WHERE display_name = $1 LIMIT 1';
      const existing = await this.dbService.query<any>(
        isSqlite ? selectSql.replace('$1', '?') : selectSql,
        [displayName.trim()]
      );

      let allergenId: number;

      if (existing.length > 0) {
        allergenId = existing[0].id;
      } else {
        // Insert new custom allergen
        const nameKey = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const insertAllergenSql = 'INSERT INTO allergens (name, display_name, severity) VALUES ($1, $2, $3)';
        const insertRes = await this.dbService.query<any>(
          isSqlite ? insertAllergenSql.replace('$1', '?').replace('$2', '?').replace('$3', '?') : insertAllergenSql,
          [nameKey, displayName.trim(), 2]
        );
        
        // Retrieve the newly inserted allergen ID
        if (isSqlite) {
          allergenId = insertRes[0].lastID;
        } else {
          const retrieveSql = 'SELECT id FROM allergens WHERE display_name = $1 LIMIT 1';
          const retrieved = await this.dbService.query<any>(
            retrieveSql,
            [displayName.trim()]
          );
          allergenId = retrieved[0].id;
        }
      }

      // Link to user in user_allergies
      const insertUserAllergySql = 'INSERT INTO user_allergies (user_id, allergen_id) VALUES ($1, $2) ON CONFLICT DO NOTHING';
      await this.dbService.query(
        isSqlite ? insertUserAllergySql.replace('$1', '?').replace('$2', '?') : insertUserAllergySql,
        [userId, allergenId]
      );
    }

    return { message: '알레르기 설정이 성공적으로 저장되었습니다.' };
  }

  async updateProfile(userId: number, updateDto: any) {
    const isSqlite = this.dbService.getIsSqlite();
    const {
      email,
      currentPassword,
      newPassword,
      name,
      phone,
      birthdate,
      gender,
      recipient_name,
      address,
      detail_address,
      zipcode,
      contact_phone,
    } = updateDto;

    // Check if email already in use by another user
    const checkSql = 'SELECT id FROM users WHERE email = $1 AND id != $2 LIMIT 1';
    const existing = await this.dbService.query<any>(
      isSqlite ? checkSql.replace('$1', '?').replace('$2', '?') : checkSql,
      [email, userId]
    );
    if (existing.length > 0) {
      throw new NotFoundException('이미 사용 중인 이메일 주소입니다.');
    }

    let updateSql: string;
    let params: any[];

    if (newPassword && newPassword.trim().length >= 6) {
      // Verify current password first
      const userSql = 'SELECT password FROM users WHERE id = $1 LIMIT 1';
      const users = await this.dbService.query<any>(
        isSqlite ? userSql.replace('$1', '?') : userSql,
        [userId]
      );
      if (users.length === 0) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      
      const dbPassword = users[0].password;
      const isPasswordValid = await bcrypt.compare(currentPassword || '', dbPassword);
      if (!isPasswordValid) {
        throw new BadRequestException('비밀번호가 틀렸습니다.');
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
    } else {
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

    await this.dbService.query(
      isSqlite ? updateSql.replace(/\$\d+/g, '?') : updateSql,
      params
    );

    return { message: '회원 정보가 성공적으로 수정되었습니다.' };
  }
}
