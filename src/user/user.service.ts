import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PageOptionsDto } from '@common/dtos/page-options.dto';
import { PageDto } from '@common/dtos/page.dto';
import { PageMetaDto } from '@common/dtos/page-meta.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async changePasswordWithToken(changePasswordDto: ChangePasswordDto) {
    const { email } = this.jwtService.verify(changePasswordDto.token, {
      secret: this.configService.get('FIND_PASSWORD_TOKEN_SECRET'),
    });
    const user = await this.getUserByEmail(email);
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userRepository.update(user.id, {
      password: hashedPassword,
    });
    return 'Updated Password successfully';
  }

  async getAllUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder
      .orderBy('user.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }
}
