import {Global, Module} from '@nestjs/common';
import { FabricWalletService } from './fabric-wallet.service';
import { CaModule } from './ca/ca.module';
import { AppModule } from './app/app.module';

@Global()
@Module({
    imports: [CaModule, AppModule],
    providers: [FabricWalletService],
    exports: [FabricWalletService],
})
export class FabricModule {}
