import { PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FiatCurrencyEnum } from '../fiat-currency.enum';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateWalletDtoApi extends PartialType(CreateWalletDto) {
    @IsString()
    @IsNotEmpty({message: 'Currency name is required'})
    @Expose()
    currency: FiatCurrencyEnum;

    @IsNumber()
    @IsNotEmpty({message: 'Amount is required'})
    @Expose()
    amount: number;
}
