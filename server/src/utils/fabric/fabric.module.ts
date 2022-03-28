import { Module } from '@nestjs/common';
import {CaService} from "./ca.service";
import {AppService} from "./app.service";
import { FabricWalletService } from './fabric-wallet.service';

@Module({
    providers: [CaService, AppService, FabricWalletService],
    exports: [FabricWalletService]
})
export class FabricModule {}
