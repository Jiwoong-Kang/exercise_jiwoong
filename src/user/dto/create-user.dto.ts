import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Provider } from '@nestjs/common';
import { CreateConsentDto } from '@consent/dto/create-consent.dto';
import { Consent } from '@consent/entities/consent.entity';
import { CreateProfileDto } from 'profile/dto/create-profile.dto';
import { Profile } from 'passport';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Jiwoong' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'dnd0311@naver.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)
  @ApiProperty({ example: 'password123@' })
  password?: string;

  @IsString()
  profileImg?: string;

  @IsString()
  provider?: Provider;

  @ApiProperty({ type: CreateConsentDto })
  consent?: Consent;
}
