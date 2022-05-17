import { Controller, Get, Post, Body, Param, Delete, Logger, ValidationPipe, Req, UseGuards } from '@nestjs/common';
import { StationService } from './station.service';
import { CreateStationDto } from './dto/create-station.dto';
import { Station } from './entities/station.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('station')
export class StationController {
    private logger = new Logger('StationController');

    constructor(
        private stationService: StationService,
    ) {
    }

    @Get()
    async getAllStations(@Req() req): Promise<Station[]> {
        this.logger.verbose(`Retrieving all Stations`);
        return this.stationService.getAllStations(req.user.id);
    }

    @Get('/:organisation/:name')
    async getStationById(
        @Param('organisation') organisationRegistryNumber: number,
        @Param('name') name: string,
        @Req() req,
    ): Promise<Station> {
        this.logger.verbose(`Retrieving Station by name ${name}`);
        return this.stationService.getStationById(organisationRegistryNumber, name, req.user.id);
    }

    @Post()
    async createStation(
        @Body(ValidationPipe) createStationDto: CreateStationDto,
        @Req() req,
    ): Promise<Station> {
        this.logger.verbose(`Creating new Station. Data : ${JSON.stringify(createStationDto)}`);
        return this.stationService.createStation(createStationDto, req.user.id);
    }

    @Delete('/:organisation/:name')
    async deleteStation(
        @Param('organisation') organisationRegistryNumber: number,
        @Param('name') name: string,
        @Req() req,
    ): Promise<void> {
        this.logger.verbose(`Deleting Station by name   + ${name}`);
        return this.stationService.deleteStation(organisationRegistryNumber, name, req.user.id);
    }
}
