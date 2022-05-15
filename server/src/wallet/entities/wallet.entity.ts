import { BaseEntity, PrimaryColumn, Column, Entity } from 'typeorm';

@Entity()
export class Wallet extends BaseEntity {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    currency: string;

    @Column()
    balance: number;
}
