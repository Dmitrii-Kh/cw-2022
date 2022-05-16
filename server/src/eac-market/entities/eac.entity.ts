import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class EAC extends BaseEntity {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    tokenId: string;

    @Column()
    price: number;
}
