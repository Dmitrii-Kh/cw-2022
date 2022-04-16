import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {FabricModule} from "../utils/fabric/fabric.module";
import {UserUtilsModule} from "../utils/user/user.module";

@Module({
  imports: [FabricModule, UserUtilsModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
