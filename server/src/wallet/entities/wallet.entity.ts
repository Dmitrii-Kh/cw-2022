import { PrimaryColumn, Column } from 'typeorm';

export class Wallet {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    currency: string;

    @Column()
    balance: number;
}
