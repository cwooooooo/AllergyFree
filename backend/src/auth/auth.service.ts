import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private dbService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Fetch user from DB by email or username
    const isSqlite = this.dbService.getIsSqlite();
    const sql = isSqlite 
      ? 'SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1'
      : 'SELECT * FROM users WHERE email = $1 OR username = $2 LIMIT 1';
    const users = await this.dbService.query<any>(sql, [email, email]);

    if (users.length === 0) {
      throw new UnauthorizedException('이메일/아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    const user = users[0];

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일/아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    // Generate JWT
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

  async register(registerDto: RegisterDto) {
    const {
      email,
      username,
      password,
      name,
      phone,
      birthdate,
      gender,
      recipient_name,
      address,
      detail_address,
      zipcode,
      contact_phone,
    } = registerDto;

    // Check if user already exists
    const checkSql = 'SELECT id FROM users WHERE email = $1 OR username = $2 LIMIT 1';
    const existingUsers = await this.dbService.query<any>(
      this.dbService.getIsSqlite() ? checkSql.replace('$1', '?').replace('$2', '?') : checkSql,
      [email, username]
    );

    if (existingUsers.length > 0) {
      throw new ConflictException('이미 존재하는 이메일 또는 아이디입니다.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const isSqlite = this.dbService.getIsSqlite();
    const insertSql = `
      INSERT INTO users (
        email, username, password, name, phone, 
        birthdate, gender, recipient_name, address, 
        detail_address, zipcode, contact_phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `;
    
    await this.dbService.query<any>(
      isSqlite ? insertSql.replace(/\$\d+/g, '?') : insertSql,
      [
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
      ]
    );

    // Automatically log in
    return this.login({ email, password });
  }
}
