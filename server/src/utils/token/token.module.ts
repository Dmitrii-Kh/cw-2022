import { Module } from '@nestjs/common';
import { TokenUtils } from './token.service';
import { UserUtilsModule } from "../user/user.module";
import {FabricModule} from "../fabric/fabric.module";

@Module({
  providers: [TokenUtils],
  imports: [UserUtilsModule, FabricModule],
  exports: [TokenUtils]
})
export class TokenUtilsModule {}
