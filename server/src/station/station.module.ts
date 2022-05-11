import { Module } from '@nestjs/common';
import { StationService } from './station.service';
import { StationController } from './station.controller';
import { OrganisationModule } from '../organisation/organisation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationRepository } from './station.repository';

@Module({
  imports: [
    OrganisationModule,
    TypeOrmModule.forFeature([StationRepository]),
  ],
  exports:[StationService],
  controllers: [StationController],
  providers: [StationService]
})
export class StationModule {}
