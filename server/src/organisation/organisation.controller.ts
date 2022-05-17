import { Controller, Get, Post, Body, Param, Delete, ValidationPipe, Logger, Req, UseGuards } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { Organisation } from './entities/organisation.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('organisation')
export class OrganisationController {
    private logger = new Logger('OrganisationController');

    constructor(private readonly organisationService: OrganisationService) {}

    @Get()
    getAllOrganisations(@Req() req): Promise<Organisation[]> {
        return this.organisationService.getAllOrganisations(req.user.id);
    }

    @Get(':id')
    getOrganisationById(
        @Param('id') registryNumber: number,
        @Req() req,
    ): Promise<Organisation> { //todo decorator
        this.logger.verbose(`Retrieving Organisation ${registryNumber}`);
        return this.organisationService.getOrganisationById(registryNumber, req.user.id);
    }

    @Post()
    createOrganisation(
        @Body(ValidationPipe) createOrganisationDto: CreateOrganisationDto,
        @Req() req,
    ): Promise<Organisation> {
        this.logger.verbose(
            `Creating new Organisation. Data : ${JSON.stringify(createOrganisationDto)}`,
        );
        return this.organisationService.createOrganisation(createOrganisationDto, req.user.id);
    }

    @Delete(':id')
    deleteOrganisation(@Param('id') registryNumber: number, @Req() req): Promise<void> {
        return this.organisationService.deleteOrganisation(registryNumber, req.user.id);
    }
}
