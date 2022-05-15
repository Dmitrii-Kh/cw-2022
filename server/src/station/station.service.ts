import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStationDto } from './dto/create-station.dto';
import { Station } from './entities/station.entity';
import { StationRepository } from './station.repository';
import { Organisation } from '../organisation/entities/organisation.entity';
import axios from 'axios';
import { OrganisationService } from '../organisation/organisation.service';

@Injectable()
export class StationService {
    private logger = new Logger('StationService');

    constructor(
        @InjectRepository(StationRepository)
        private stationRepository: StationRepository,
        private organisationService: OrganisationService,
    ) {
    }

    public async getAllStations(organisations: Organisation[]): Promise<Station[]> {
        let found = [];
        try {
            for (const org of organisations) {
                for (const station of await org.stations) {
                    found.push(station);
                }
            }
        } catch (error) {
            this.logger.error(`Failed to get all stations: `, error.stack);
            throw new InternalServerErrorException();
        }
        if (!found) {
            throw new NotFoundException(`Stations not found`);
        }
        return found;
    }

    public async getStationById(
        organisationRegistryNumber: number,
        name: string,
        ownerId: number
    ): Promise<Station> {
        let found;
        try {
            const org = await this.organisationService.getOrganisationById(organisationRegistryNumber, ownerId);
            found = (await org.stations).find((station) => station.name === name);
        } catch (error) {
            this.logger.error(`Failed to get station ${name}: `, error.stack);
            throw new InternalServerErrorException();
        }
        if (!found) {
            throw new NotFoundException(`Station with id: ${name} not found`);
        }
        return found;
    }

    // public async getStation(organisation: string, name: string): Promise<Station> {
    //     const query = this.stationRepository.createQueryBuilder('station');
    //     let found;
    //     try {
    //         query.where(
    //             'station.name = :name AND' + ' station.organisationRegistryNumber = :organisation',
    //             {
    //                 name: name,
    //                 organisation: organisation,
    //             },
    //         );
    //         found = await query.getOne();
    //     } catch (error) {
    //         this.logger.error(`Failed to get station ${name}: `, error.stack);
    //         throw new InternalServerErrorException();
    //     }
    //     if (!found) {
    //         throw new NotFoundException(`Station with id: ${name} not found`);
    //     }
    //     return found;
    // }

    public async createStation(
        stationInput: CreateStationDto,
        organisation: Organisation,
    ): Promise<Station> {
        let station = this.stationRepository.create(stationInput);
        try {
            station.organisation = Promise.resolve(organisation);
            //todo check if exists in CB
            const response = await axios.post(
                `${process.env.BROKER_HOST}:${process.env.BROKER_PORT}/v2/entities?options=keyValues`,
                {
                    type: 'Station',
                    id: `${station.organisationRegistryNumber}.${station.name.replace(/ /g, '_')}`,
                    startDate: '',
                    endDate: '',
                    generatedEnergy: '0',
                },
                { headers: { 'Content-Type': 'application/json' } },
            );
            this.logger.verbose('Create Station in Context Broker status: ', response.status);
            await station.save();
        } catch (error) {
            this.logger.error(`Failed to create new station: `, error.stack);
            if (error.code === '23505' || error.response.data.error === 'Unprocessable') {
                throw new UnprocessableEntityException('Station already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
        return station;
    }

    public async deleteStation(
        name: string,
        organisation: Organisation,
    ): Promise<void> {
        try {
            await this.stationRepository
                .createQueryBuilder('station')
                .delete()
                .where(
                    ' name = :name AND' +
                    ' organisationRegistryNumber = :organisationRegistryNumber',
                    {
                        name,
                        organisationRegistryNumber: organisation.registryNumber,
                    },
                )
                .execute();
        } catch (error) {
            this.logger.error(`Failed to delete station ${name}`, error.stack);
            throw new InternalServerErrorException();
        }
    }
}
