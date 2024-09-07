import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Consent } from '@consent/entities/consent.entity';
import { Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { CreateConsentDto } from '@consent/dto/create-consent.dto';
import { UserService } from '@user/user.service';

@Injectable()
export class ConsentService {
  constructor(
    @InjectRepository(Consent)
    private readonly consentRepository: Repository<Consent>,
    private readonly userService: UserService,
  ) {}

  async createConsent(user: User, createConsentDto: CreateConsentDto) {
    const newConsent = await this.consentRepository.create({
      ...createConsentDto,
      user,
    });
    await this.consentRepository.save(newConsent);
    return newConsent;
  }

  async updateConsentByUser(user: User, createConsentDto: CreateConsentDto) {
    const userInfo = await this.userService.getUserById(user.id);
    await this.consentRepository.update(
      { id: userInfo.consent.id },
      createConsentDto,
    );
  }
}
