import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWalletDto {
    @IsNumber()
    @IsNotEmpty({message: 'UserId is required'})
    userId: number;

    @IsString()
    @IsNotEmpty({message: 'Currency name is required'})
    currency: string;

    @IsNumber()
    @IsNotEmpty({message: 'Balance is required'})
    balance: number;
}
