import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import RoleGuard from '@auth/guards/role.guard';
import { Role } from '@common/enums/role.enum';
import { UserService } from '@user/user.service';
import { PageOptionsDto } from '@common/dtos/page-options.dto';
import { PageDto } from '@common/dtos/page.dto';
import { User } from '@user/entities/user.entity';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RoleGuard(Role.ADMIN))
  @Get('/all')
  async getAllUsers(pageOptions: PageOptionsDto): Promise<PageDto<User>> {
    return await this.userService.getAllUsers(pageOptions);
  }
}
