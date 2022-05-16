import { EntityRepository, Repository } from 'typeorm';
import { EAC } from './entities/eac.entity';

@EntityRepository(EAC)
export class EacRepository extends Repository<EAC> {}