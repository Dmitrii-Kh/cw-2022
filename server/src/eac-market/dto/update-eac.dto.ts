import { PartialType } from '@nestjs/swagger';
import { CreateEacDto } from './create-eac.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateEacDto extends PartialType(CreateEacDto) {
    @IsString()
    @IsNotEmpty({ message: 'Old Token ID is required' })
    @Expose()
    oldTokenId: string;

    @IsString()
    @IsNotEmpty({ message: 'Token ID is required' })
    @Expose()
    tokenId: string;
}
