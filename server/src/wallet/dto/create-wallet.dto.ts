import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FiatCurrencyEnum } from '../fiat-currency.enum';

export class CreateWalletDto {
    @IsNumber()
    @IsNotEmpty({message: 'UserId is required'})
    userId: number;

    @IsString()
    @IsNotEmpty({message: 'Currency name is required'})
    currency: FiatCurrencyEnum;

    @IsNumber()
    @IsNotEmpty({message: 'Balance is required'})
    balance: number;
}
