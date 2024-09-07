import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import RoleGuard from '@auth/guards/role.guard';
import { Role } from '@common/enums/role.enum';
import { UserService } from '@user/user.service';
import { PageOptionsDto } from '@common/dtos/page-options.dto';
import { PageDto } from '@common/dtos/page.dto';
import { User } from '@user/entities/user.entity';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from '@auth/interfaces/requestWithUser.interface';
import { BufferedFile } from '@minio-client/file.model';
import { CreateUserDto } from '@user/dto/create-user.dto';

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

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDto })
  @ApiBody({
    description: 'A single image file with additional user data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Profile image file',
        },

        name: {
          type: 'string',
          description: 'Name of the user',
          example: 'Jiwoong',
        },

        email: {
          type: 'string',
          description: 'Email address of the user',
          example: 'dnd0311@naver.com',
        },

        // password: {
        //   type: 'string',
        //   description: 'Password of the user',
        //   example: 'password123@',
        // },
      },
    },
  })
  async updateUserByToken(
    @Req() req: RequestWithUser,
    @UploadedFile() profileImg?: BufferedFile,
    @Body() updateUserDto?: CreateUserDto,
  ) {
    return await this.userService.updateUserInfoByToken(
      req.user,
      profileImg,
      updateUserDto,
    );
  }
}
