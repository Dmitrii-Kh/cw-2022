import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganisationRepository } from './organisation.repository';
import { Organisation } from './entities/organisation.entity';

@Injectable()
export class OrganisationService {
    private logger = new Logger('OrganisationService');

    constructor(
        @InjectRepository(OrganisationRepository)
        private organisationRepository: OrganisationRepository,
    ) {
    }

    public async getAllOrganisations(userId: number): Promise<Organisation[]> {
        const query = this.organisationRepository.createQueryBuilder('organisation');
        let found;
        try {
            query.where('organisation.ownerId = :userId', { userId: userId });
            found = await query.getMany();
        } catch (error) {
            this.logger.error(`Failed to get all stations: `, error.stack);
            throw new InternalServerErrorException();
        }
        if (!found || found.length === 0) {
            throw new NotFoundException(`Organisations not found`);
        }
        return found;
    }

    public async getOrganisationById(
        registryNumber: number,
        userId: number,
    ): Promise<Organisation> {
        let found;
        try {
            found = await this.organisationRepository.findOne({
                where: { registryNumber: registryNumber, ownerId: userId },
            });
        } catch (error) {
            this.logger.error(`Failed to get organisation ${registryNumber}: `, error.stack);
            throw new InternalServerErrorException();
        }
        if (!found) {
            throw new NotFoundException(`Organisation ${registryNumber} not found`);
        }
        return found;
    }

    public async createOrganisation(
        organisationInput: CreateOrganisationDto,
        userId: number,
    ): Promise<Organisation> {
        let found = await this.organisationRepository.findOne({
            where: { registryNumber: organisationInput.registryNumber },
        });
        if (found) throw new UnprocessableEntityException('Organisation already exists');
        try {
            const organisation = this.organisationRepository.create(organisationInput);
            organisation.ownerId = userId;
            await organisation.save();
            return organisation;
        } catch (error) {
            this.logger.error(`Failed to create organisation ${organisationInput.registryNumber}`, error);
            throw new InternalServerErrorException('Organisation creation failed');
        }
    }

    public async deleteOrganisation(registryNumber: number, userId: number): Promise<void> {
        try {
            await this.organisationRepository
                .createQueryBuilder('organisation')
                .delete()
                .where('registryNumber = :registryNumber AND ownerId = :userId', {
                    registryNumber,
                    userId,
                })
                .execute();
        } catch (error) {
            this.logger.error(`Failed to delete organisation ${registryNumber}`, error.stack);
            throw new InternalServerErrorException();
        }
    }
}
