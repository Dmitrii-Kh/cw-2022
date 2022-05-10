import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEacDto {
    @IsString()
    @IsNotEmpty({ message: 'User ID is required' })
    userId: string;

    @IsString()
    @IsNotEmpty({ message: 'Token ID is required' })
    tokenId: string;

    @IsNumber()
    @IsNotEmpty({ message: 'Price is required' })
    price: number;
}
