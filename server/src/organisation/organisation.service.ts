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
import { UserService } from '../user/user.service';
import { use } from 'passport';

@Injectable()
export class OrganisationService {
    private logger = new Logger('OrganisationService');

    constructor(
        @InjectRepository(OrganisationRepository)
        private organisationRepository: OrganisationRepository,
        private userService: UserService
    ) {
    }

    public async getAllOrganisations(userId: number): Promise<Organisation[]> {
        let found;
        const user = await this.userService.getUserById(userId);
        try {
            found = await user.organisations;
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
        let organisation;
        let found = await this.organisationRepository.findOne({
            where: { registryNumber: organisationInput.registryNumber },
        });
        if (found) throw new UnprocessableEntityException('Organisation already exists');
        try {
            organisation = this.organisationRepository.create(organisationInput);
            organisation.ownerId = userId;
            await organisation.save();
        } catch (error) {
            this.logger.error(`Failed to create organisation ${organisationInput.registryNumber}`, error);
            throw new InternalServerErrorException('Organisation creation failed');
        }
        return organisation;
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
