import { Module } from '@nestjs/common';
import { EacService } from './eac.service';
import { EacController } from './eac.controller';

@Module({
  controllers: [EacController],
  providers: [EacService]
})
export class EacModule {}
