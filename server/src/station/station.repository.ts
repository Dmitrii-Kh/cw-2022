import { EntityRepository, Repository } from 'typeorm';
import { Station } from './entities/station.entity';

@EntityRepository(Station)
export class StationRepository extends Repository<Station> {}