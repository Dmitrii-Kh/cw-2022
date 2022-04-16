class EAC {
        prod_start_date: string;
        prod_end_date: string;
        produced_energy: number;
        plant_uid: string;
        plant_name: string;
        plant_location: string;
        plant_type: string;
        issue_date: string;
        issuing_country: string;
        commissioning_date: string;
        plant_performance: string;
}

export class CreateTokenDto {
    username: string;
    amount: number;
    EAC: EAC;
}
