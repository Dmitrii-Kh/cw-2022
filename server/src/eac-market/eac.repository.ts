import { EntityRepository, Repository } from 'typeorm';
import { Eac } from './entities/eac.entity';

@EntityRepository(Eac)
export class EacRepository extends Repository<Eac> {}