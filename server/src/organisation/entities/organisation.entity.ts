import { Station } from 'src/station/entities/station.entity';
import { BaseEntity, Column, Entity, JoinTable, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Organisation extends BaseEntity {
    @PrimaryColumn()
    registryNumber: number;

    @Column()
    name: string;

    @Column()
    ownerId: number;

    @Column()
    businessType: string;

    @Column()
    organisationAddress: string;

    @Column()
    organisationEmail: string;

    @OneToMany((type) => Station, (station) => station.organisation, {
        eager: false,
    })
    @JoinTable()
    stations: Promise<Station[]>;
}
