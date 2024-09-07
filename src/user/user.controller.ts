import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import RoleGuard from '@auth/guards/role.guard';
import { Role } from '@common/enums/role.enum';
import { UserService } from '@user/user.service';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RoleGuard(Role.ADMIN))
  @Get('/all')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}
