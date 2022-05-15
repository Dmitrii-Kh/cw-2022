import { Controller, Get, Post, Body, Param, Delete, ValidationPipe, Logger, Req } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { Organisation } from './entities/organisation.entity';
import { Request } from 'express';

@Controller('organisation')
export class OrganisationController {
    private logger = new Logger('OrganisationController');

    constructor(private readonly organisationService: OrganisationService) {}

    @Get()
    getAllOrganisations(@Req() req: Request): Promise<Organisation[]> {
        return this.organisationService.getAllOrganisations(req.body.ownerId);
    }

    @Get(':id')
    getOrganisationById(
        @Param('id') registryNumber: number,
        @Req() req: Request,
    ): Promise<Organisation> { //todo decorator
        this.logger.verbose(`Retrieving Organisation ${registryNumber}`);
        return this.organisationService.getOrganisationById(registryNumber, req.body.ownerId);
    }

    @Post()
    createOrganisation(
        @Body(ValidationPipe) createOrganisationDto: CreateOrganisationDto,
        @Req() req: Request,
    ): Promise<Organisation> {
        this.logger.verbose(
            `Creating new Organisation. Data : ${JSON.stringify(createOrganisationDto)}`,
        );
        return this.organisationService.createOrganisation(createOrganisationDto, req.body.ownerId);
    }

    @Delete(':id')
    deleteOrganisation(@Param('id') registryNumber: number, @Req() req: Request): Promise<void> {
        return this.organisationService.deleteOrganisation(registryNumber, req.body.ownerId);
    }
}
