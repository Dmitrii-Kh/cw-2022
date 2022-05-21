import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../utils/userRole';
import { Organisation } from '../../organisation/entities/organisation.entity';
import { EAC } from '../../eac-market/entities/eac.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    fullName: string;

    @Column()
    password: string;

    @Column()
    role: UserRole;

    @OneToMany((type) => Organisation, (org) => org.owner, {
        eager: false,
    })
    organisations: Promise<Organisation[]>;

    @OneToMany((type) => EAC, (eac) => eac.owner, {
        eager: false,
    })
    eacs: Promise<EAC[]>;

    @OneToOne((type) => Wallet, (wallet) => wallet.owner, {
        eager: false,
    })
    wallet: Promise<Wallet>;
}
