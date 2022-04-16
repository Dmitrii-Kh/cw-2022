import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { FabricModule } from '../utils/fabric/fabric.module'
import {TokenUtilsModule} from "../utils/token/token.module";

@Module({
  controllers: [TokenController],
  imports: [FabricModule, TokenUtilsModule],
  providers: [TokenService]
})
export class TokenModule {}
