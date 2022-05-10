import { Column, PrimaryColumn } from 'typeorm';

export class Eac {
    @PrimaryColumn()
    userId: string;

    @PrimaryColumn()
    tokenId: string;

    @Column()
    price: number;
}
