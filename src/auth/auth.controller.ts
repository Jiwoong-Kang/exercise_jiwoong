import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUpUser(@Body() createdUserDto: CreateUserDto) {
    return await this.authService.signUpUser(createdUserDto);
  }

  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }
}
