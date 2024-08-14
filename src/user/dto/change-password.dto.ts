import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @ApiProperty()
  newPassword: string;

  @IsString()
  @ApiProperty()
  token: string;
}
