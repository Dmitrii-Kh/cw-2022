import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { EnergyType } from '../station-energy-type.enum';

export class CreateStationDto {
    @IsNotEmpty({ message: 'Name should not be empty' })
    @IsString()
    @MaxLength(50, {
        message: 'Name must be shorter than or equal to 50 characters',
    })
    name: string;

    @IsNotEmpty({ message: 'organisationRegistryNumber should not be empty' })
    @IsNumber()
    organisationRegistryNumber: number;

    @IsNotEmpty({ message: 'Station energy type should not be empty' })
    @IsString()
    stationEnergyType: EnergyType;

    @IsNotEmpty({ message: 'Performance should not be empty' })
    @IsNumber()
    plantPerformance: number;

    @IsNotEmpty({ message: 'Commissioning Date should not be empty' })
    commissioningDate: Date;

    @IsNotEmpty({ message: 'Creation Date should not be empty' })
    manufactureDate: Date;

    @IsNotEmpty({ message: 'Country should not be empty' })
    countryId: number;

    @IsNotEmpty({ message: 'Region should not be empty' })
    regionId: number;

    @IsNotEmpty({ message: 'Manufacturer Country should not be empty' })
    manufacturerCountryId: number;
}
