import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일은 필수 입력값입니다.' })
  email!: string;

  @IsNotEmpty({ message: '아이디는 필수 입력값입니다.' })
  username!: string;

  @IsNotEmpty({ message: '비밀번호는 필수 입력값입니다.' })
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  password!: string;

  @IsNotEmpty({ message: '이름은 필수 입력값입니다.' })
  name!: string;

  @IsNotEmpty({ message: '휴대전화 번호는 필수 입력값입니다.' })
  phone!: string;

  @IsOptional()
  birthdate?: string;

  @IsOptional()
  gender?: string;

  // Delivery details (optional during register, but can be provided)
  @IsOptional()
  recipient_name?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  detail_address?: string;

  @IsOptional()
  zipcode?: string;

  @IsOptional()
  contact_phone?: string;
}
