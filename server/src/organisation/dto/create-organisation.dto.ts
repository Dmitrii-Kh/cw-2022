import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateOrganisationDto {
    @IsNotEmpty({ message: 'Name should not be empty' })
    @IsString()
    @MaxLength(50, {
        message: 'Name must be shorter than or equal to 50 characters',
    })
    name: string;

    @IsNotEmpty({ message: 'Trade register number should not be empty' })
    @IsNumber()
    registryNumber: number;

    @IsNotEmpty({ message: 'Business Type should not be empty' })
    @IsString()
    @MaxLength(50, {
        message: 'Business Type must be shorter than or equal to 50 characters',
    })
    businessType: string;

    @IsNotEmpty({ message: 'Organization Address should not be empty' })
    @IsString()
    @MaxLength(50, {
        message:
            'Organization Address must be shorter than or equal to 50 characters',
    })
    organisationAddress: string;

    @IsNotEmpty({ message: 'Signatory Email should not be empty' })
    @IsString()
    @MaxLength(50, {
        message:
            'Signatory Email must be shorter than or equal to 50 characters',
    })
    organisationEmail: string;
}