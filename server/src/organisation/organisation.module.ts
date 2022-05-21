import { Module } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationController } from './organisation.controller';
import { OrganisationRepository } from './organisation.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrganisationRepository]), UserModule],
  controllers: [OrganisationController],
  providers: [OrganisationService],
  exports: [OrganisationService]
})
export class OrganisationModule {}
