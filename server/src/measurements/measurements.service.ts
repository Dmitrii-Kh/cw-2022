import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { MeasurementRepository } from './measurement.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Measurement } from './entities/measurement.entity';
import { Organisation } from '../organisation/entities/organisation.entity';
import { Station } from '../station/entities/station.entity';
import { StationService } from '../station/station.service';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class MeasurementsService {
    private logger = new Logger('MeasurementService');

    constructor(
        @InjectRepository(MeasurementRepository)
        private measurementRepository: MeasurementRepository,
        private stationService: StationService
    ) {
    }

    public async create(measurementDto: Measurement): Promise<Measurement> {
        let measurement;
        try {
            measurement = await this.measurementRepository
                .createQueryBuilder()
                .insert()
                .into(Measurement)
                .values({
                    ...measurementDto,
                })
                .execute();
        } catch (e) {
            this.logger.error(`Failed to create new measurement: `, e.stack);
            throw new InternalServerErrorException();
        }
        return measurement.raw;
    }

    public async findAll(): Promise<Measurement[]> {
        const query = this.measurementRepository.createQueryBuilder('measurement');
        try {
            return await query.getMany();
        } catch (error) {
            this.logger.error(`Failed to get all measurements: `, error.stack);
            throw new InternalServerErrorException();
        }
    }

    public async getMeasurementsByOrgAndStation(
        organisationRegistryNumber: number,
        stationName: string,
        ownerId: number
    ): Promise<Measurement> {
        const query = this.measurementRepository.createQueryBuilder('measurement');
        let found;
        try {
           let station = await this.stationService.getStationById(organisationRegistryNumber, stationName, ownerId);
           found = await station.measurements;
        } catch (error) {
            this.logger.error(
                `Failed to get measurements from station ${stationName}, org ${organisationRegistryNumber} `,
                error.stack,
            );
            throw new InternalServerErrorException();
        }
        if (!found) {
            throw new NotFoundException(
                `Measurements from station ${stationName}, org ${organisationRegistryNumber} not found`,
            );
        }
        return found;
    }

    public async update(id: number, measurement: Measurement) {
        try {
            await this.measurementRepository
                .createQueryBuilder()
                .update(Measurement)
                .set(measurement)
                .where('id = :id', { id })
                .execute();
        } catch (e) {
            this.logger.error(`Failed to update measurement ${id}`, e.stack);
        }
    }
}
