import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class EmailVerificationDto {
  @ApiProperty({ example: 'dnd0311@naver.com' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  code: string;
}
