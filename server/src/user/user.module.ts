import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FabricModule } from '../utils/fabric/fabric.module';
import { UserUtilsModule } from '../utils/user/user.module';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule } from '../wallet/wallet.module';

@Module({
    imports: [FabricModule, WalletModule, UserUtilsModule, TypeOrmModule.forFeature([UserRepository])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {
}
