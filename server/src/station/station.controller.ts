import { Controller, Get, Post, Body, Param, Delete, Logger, ValidationPipe, Req } from '@nestjs/common';
import { StationService } from './station.service';
import { CreateStationDto } from './dto/create-station.dto';
import { OrganisationService } from '../organisation/organisation.service';
import { Station } from './entities/station.entity';

@Controller('station')
export class StationController {
    private logger = new Logger('StationController');

    constructor(
        private stationService: StationService,
        private organisationService: OrganisationService,
    ) {
    }

    @Get()
    async getAllStations(@Req() req): Promise<Station[]> {
        this.logger.verbose(`Retrieving all Stations`);
        //todo auth decorator
        let userOrganisations = await this.organisationService.getAllOrganisations(req.body.userId);
        let stations = [];
        for (const org of userOrganisations) {
            for (const station of await org.stations) {
                stations.push(station);
            }
        }
        return stations;
    }

    @Get('/:organisation/:name')
    async getStationById(
        @Param('organisation') organisation: string,
        @Param('name') name: string,
        @Req() req,
    ): Promise<Station> {
        this.logger.verbose(`Retrieving Station by name ${name}`);
        let org = await this.organisationService.getAllOrganisations(req.body.userId);
        return this.stationService.getStationById(organisation, name, org);
    }

    @Post()
    // @ApiBearerAuth('access-token')
    async createStation(
        @Body(ValidationPipe) createStationDto: CreateStationDto,
        @Req() req,
    ): Promise<Station> {
        this.logger.verbose(`Creating new Station. Data : ${JSON.stringify(createStationDto)}`);
        let org = await this.organisationService.getOrganisationById(
            req.body.organisation,
            req.body.userId,
        );
        return this.stationService.createStation(createStationDto, org);
    }

    @Delete('/:organisation/:name')
    async deleteStation(
        @Param('organisation') organisation: string,
        @Param('name') name: string,
        @Req() req,
    ): Promise<void> {
        this.logger.verbose(`Deleting Station by name   + ${name}`);
        let org = await this.organisationService.getAllOrganisations(req.body.userId);
        return this.stationService.deleteStation(organisation, name, org);
    }
}
