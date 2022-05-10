import { Station } from 'src/station/entities/station.entity';
import { BaseEntity, Column, Entity, JoinTable, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Organisation extends BaseEntity {
    @PrimaryColumn()
    registryNumber: string;

    @Column()
    name: string;

    @Column()
    userId: string;

    @Column()
    signatoryAddress: string;

    @Column()
    organizationAddress: string;

    @Column()
    signatoryEmail: string;

    @OneToMany((type) => Station, (station) => station.organisation, {
        eager: false,
    })
    @JoinTable()
    stations: Promise<Station[]>;
}
