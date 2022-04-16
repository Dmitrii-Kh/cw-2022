import {Global, Module} from '@nestjs/common';
import {CaService} from "./ca.service";

@Global()
@Module({
    providers: [CaService],
    exports: [CaService]
})
export class CaModule {
}
