import { Module } from '@nestjs/common';
import { EacMarketService } from './eac-market.service';
import { EacMarketController } from './eac-market.controller';

@Module({
  controllers: [EacMarketController],
  providers: [EacMarketService]
})
export class EacMarketModule {}
