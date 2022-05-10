import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../../utils/userRole';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty({message: 'Email is required'})
    email: string;

    @IsString()
    fullName: string;

    @IsString()
    @IsNotEmpty({message: 'Password is required'})
    password: string;

    @IsNotEmpty({ message: 'User role is required' })
    role: UserRole;
}
