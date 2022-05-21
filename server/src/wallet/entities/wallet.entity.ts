import { BaseEntity, PrimaryColumn, Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { FiatCurrencyEnum } from '../fiat-currency.enum';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Wallet extends BaseEntity {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn({default: FiatCurrencyEnum.USD})
    currency: string;

    @Column()
    balance: number;

    @OneToOne((type) => User, (user) => user.wallet, {
        eager: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    owner: Promise<User>;
}
