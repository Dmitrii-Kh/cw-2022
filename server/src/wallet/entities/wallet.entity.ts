import { BaseEntity, PrimaryColumn, Column, Entity } from 'typeorm';
import { FiatCurrencyEnum } from '../fiat-currency.enum';

@Entity()
export class Wallet extends BaseEntity {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn({default: FiatCurrencyEnum.USD})
    currency: string;

    @Column()
    balance: number;
}
