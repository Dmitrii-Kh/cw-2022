import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class EAC extends BaseEntity {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    tokenId: string;

    @Column()
    price: number;

    @ManyToOne((type) => User, (user) => user.eacs, {
        eager: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    owner: Promise<User>;
}
