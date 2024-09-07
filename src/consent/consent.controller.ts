import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ConsentService } from './consent.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RequestWithUser } from '@auth/interfaces/requestWithUser.interface';
import { CreateConsentDto } from '@consent/dto/create-consent.dto';

@ApiBearerAuth()
@ApiTags('Consent')
@Controller('consent')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createConsent(
    @Req() req: RequestWithUser,
    @Body() createConsentDto: CreateConsentDto,
  ) {
    return await this.consentService.createConsent(req.user, createConsentDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateConsentByUser(
    @Req() req: RequestWithUser,
    @Body() createConsentDto: CreateConsentDto,
  ) {
    return await this.consentService.updateConsentByUser(
      req.user,
      createConsentDto,
    );
  }
}
