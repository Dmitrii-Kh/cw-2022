import { Station } from 'src/station/entities/station.entity';
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    JoinTable, ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

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

    @ManyToOne((type) => User, (user) => user.organisations, {
        eager: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'ownerId' })
    owner: Promise<User>;
}
