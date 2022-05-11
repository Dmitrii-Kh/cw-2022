import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Organisation } from '../organisation/entities/organisation.entity';
import { Measurement } from '../measurements/entities/measurement.entity';
import { Station } from '../station/entities/station.entity';
import { EacMarketModule } from '../eac-market/eac-market.module';
import { Wallet } from '../wallet/entities/wallet.entity';
import { User } from '../user/entities/user.entity';


export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'cw-2022',
    entities: [Organisation, Station, Measurement, Wallet, EacMarketModule, User],
    synchronize: true,
};
