import { Module } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { MeasurementsController } from './measurements.controller';
import { StationModule } from '../station/station.module';
import { OrganisationModule } from '../organisation/organisation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasurementRepository } from './measurement.repository';

@Module({
  imports: [StationModule, OrganisationModule, TypeOrmModule.forFeature([MeasurementRepository])],
  controllers: [MeasurementsController],
  providers: [MeasurementsService],
  exports: [MeasurementsService]
})
export class MeasurementsModule {}
