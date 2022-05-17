import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenDto {
    @IsString()
    @IsNotEmpty({ message: 'Station ID is required' })
    stationId: string;
}
