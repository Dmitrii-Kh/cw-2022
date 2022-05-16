import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FiatCurrencyEnum } from '../fiat-currency.enum';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateWalletDto {
    @IsNumber()
    @IsNotEmpty({message: 'UserId is required'})
    @Expose()
    userId: number;

    @IsString()
    @IsNotEmpty({message: 'Currency name is required'})
    @Expose()
    currency: FiatCurrencyEnum;

    @IsNumber()
    @IsNotEmpty({message: 'Balance is required'})
    @Expose()
    balance: number;
}
