import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CaService } from '../utils/fabric/ca/ca.service';
import { FabricWalletService } from '../utils/fabric/fabric-wallet.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private ca: CaService,
        private fsw: FabricWalletService,
    ) {
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.getUserByEmail(email);
        const isMatch = bcrypt.compareSync(pass, user.password);
        if (user && isMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.fullName, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(createUserDto: CreateUserDto) {
        try {
            const user = await this.userService.create(createUserDto);
            const registerResult = await this.ca.registerAndEnrollUser(
                this.fsw.getCaClient(),
                await this.fsw.getWallet(),
                process.env.MSP_ORG, user.id.toString(), process.env.AFFILIATION);
            return {
                status: 200,
                message: { user, registerResult },
            };
        } catch (e) {
            return {
                status: e.status,
                message: e.message,
            };
        }
    }

}