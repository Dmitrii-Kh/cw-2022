import { Module } from '@nestjs/common';
import { EacMarketService } from './eac-market.service';
import { EacMarketController } from './eac-market.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EacRepository } from './eac.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EacRepository])],
  controllers: [EacMarketController],
  providers: [EacMarketService],
  exports: [EacMarketService]
})
export class EacMarketModule {}
