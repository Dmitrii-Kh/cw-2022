import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganisationModule } from './organisation/organisation.module';
import { StationModule } from './station/station.module';
import { EacModule } from './eac/eac.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [OrganisationModule, StationModule, EacModule, MeasurementsModule, UserModule, WalletModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
