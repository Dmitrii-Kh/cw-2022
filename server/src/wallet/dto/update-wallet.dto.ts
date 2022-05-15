import { PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FiatCurrencyEnum } from '../fiat-currency.enum';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
    @IsNumber()
    @IsNotEmpty({message: 'UserId is required'})
    userId: number;

    @IsString()
    @IsNotEmpty({message: 'Currency name is required'})
    currency: FiatCurrencyEnum;

    @IsNumber()
    @IsNotEmpty({message: 'Amount is required'})
    amount: number;

}
