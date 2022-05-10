import { Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../utils/userRole';

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    fullName: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column()
    role: UserRole;
}
