import { Controller, Get, Post, Param, Logger, Req, UseGuards } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { Measurement } from './entities/measurement.entity';
import { GetMeasurement } from './decorators/get-measurement.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('measurements')
export class MeasurementsController {
    private logger = new Logger('MeasurementsController');

    constructor(
        private measurementsService: MeasurementsService
    ) {
    }

    @Post()
    async create(@GetMeasurement() measurement: Measurement): Promise<Measurement> {
        this.logger.verbose(`Adding new measurement. Data : ${JSON.stringify(measurement)}`);
        return this.measurementsService.create(measurement);
    }

    // @Get()
    // findAll(): Promise<Measurement[]> {
    //     this.logger.verbose(`Retrieving all Measurements`);
    //     return this.measurementsService.findAll();
    // }

    @UseGuards(JwtAuthGuard)
    @Get('/:organisation/:station')
    async getMeasurementsByOrgAndStation(
        @Param('organisation') organisation: number,
        @Param('station') station: string,
        @Req() req,
    ): Promise<Measurement> {
        this.logger.verbose(`Retrieving Measurements from station ${station}, org ${organisation}`);
        return this.measurementsService.getMeasurementsByOrgAndStation(
            organisation,
            station,
            req.user.id
        );
    }

    // @Patch()
    // async updateMeasurements(@Req() req) {
    //     for (const mes of req.body.measurements) {
    //         await this.measurementsService.update(mes.id, { ...mes, minted: true });
    //     }
    // }

}
