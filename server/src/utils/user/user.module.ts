import { Global, Module } from '@nestjs/common';
import { UserUtils } from './user.service';
import {FabricModule} from "../fabric/fabric.module";

// @Global()
@Module({
  providers: [UserUtils],
  imports: [FabricModule],
  exports: [UserUtils]
})
export class UserUtilsModule {}
