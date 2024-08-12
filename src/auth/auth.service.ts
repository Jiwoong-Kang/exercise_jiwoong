import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signUpUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(loginUserDto.email);
    const isMatched = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isMatched) {
      throw new HttpException('Passwords do not match', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
