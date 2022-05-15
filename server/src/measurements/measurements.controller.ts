import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, Req } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { StationService } from '../station/station.service';
import { OrganisationService } from '../organisation/organisation.service';
import { Measurement } from './entities/measurement.entity';
import { GetMeasurement } from './decorators/get-measurement.decorator';

@Controller('measurements')
export class MeasurementsController {
    private logger = new Logger('MeasurementsController');

    constructor(
        private measurementsService: MeasurementsService,
        private stationService: StationService,
        private organisationService: OrganisationService,
    ) {
    }

    @Post()
    async create(@GetMeasurement() measurement: Measurement): Promise<Measurement> {
        this.logger.verbose(`Adding new measurement. Data : ${JSON.stringify(measurement)}`);
        return this.measurementsService.create(measurement);
    }

    @Get()
    findAll(): Promise<Measurement[]> {
        this.logger.verbose(`Retrieving all Measurements`);
        return this.measurementsService.findAll();
    }

    @Get('/:organisation/:station')
    async getMeasurementsByOrgAndStation(
        @Param('organisation') organisation: string,
        @Param('station') station: string,
        @Req() req,
    ): Promise<Measurement> {
        this.logger.verbose(`Retrieving Measurements from station ${station}, org ${organisation}`);
        let userOrganisations = await this.organisationService.getAllOrganisations(req.body.ownerId);
        let userStations = [];
        for (const org of userOrganisations) {
            for (const station of await org.stations) {
                userStations.push(station);
            }
        }
        return this.measurementsService.getMeasurementsByOrgAndStation(
            organisation,
            station,
            userOrganisations,
            userStations,
        );
    }

    @Patch()
    async updateMeasurements(@Req() req) {
        for (const mes of req.body.measurements) {
            await this.measurementsService.update(mes.id, { ...mes, minted: true });
        }
    }

}
