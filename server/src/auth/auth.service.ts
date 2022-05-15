import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CaService } from '../utils/fabric/ca/ca.service';
import { FabricWalletService } from '../utils/fabric/fabric-wallet.service';
import { UserUtils } from '../utils/user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private ca: CaService,
        private fsw: FabricWalletService,
        private userUtils: UserUtils,
    ) {
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.getUserByEmail(email);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(createUserDto: CreateUserDto) {
        try {
            const user = await this.userService.create(createUserDto);
            if(!user) {
                return {
                    status: 400,
                    message: "Request must contain a username"
                }
            }
            //todo fix affiliation
            const registerResult = await this.ca.registerAndEnrollUser(this.fsw.getCaClient(), await this.fsw.getWallet(), process.env.MSP_ORG, user.id, process.env.AFFILICATION);
            return {
                status: 200,
                message: { user, registerResult }
            }
        } catch (e) {
            return {
                status: e.status,
                message: e.message,
            }
        }
    }

}