import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OrganisationModule } from './organisation/organisation.module';
import { StationModule } from './station/station.module';
import { EacMarketModule } from './eac-market/eac-market.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { TokenModule } from './token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot(typeOrmConfig),
        OrganisationModule, StationModule, EacMarketModule, MeasurementsModule,
        UserModule, WalletModule, TokenModule, AuthModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
