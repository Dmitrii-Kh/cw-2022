import { Module } from '@nestjs/common';
import { EacMarketService } from './eac-market.service';
import { EacMarketController } from './eac-market.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EacRepository } from './eac.repository';
import { WalletModule } from '../wallet/wallet.module';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([EacRepository]), WalletModule, TokenModule, UserModule],
  controllers: [EacMarketController],
  providers: [EacMarketService],
  exports: [EacMarketService]
})
export class EacMarketModule {}
