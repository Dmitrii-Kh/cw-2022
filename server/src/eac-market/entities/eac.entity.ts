import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Eac extends BaseEntity {
    @PrimaryColumn()
    userId: string;

    @PrimaryColumn()
    tokenId: string;

    @Column()
    price: number;
}
