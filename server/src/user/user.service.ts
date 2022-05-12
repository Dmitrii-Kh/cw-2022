import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {CaService} from "../utils/fabric/ca/ca.service";
import {UserUtils} from "../utils/user/user.service";
import {FabricWalletService} from "../utils/fabric/fabric-wallet.service";
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {

    constructor(
        private ca: CaService,
        private fsw: FabricWalletService,
        private userUtils: UserUtils,
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {

    }

    create(createUserDto: CreateUserDto) {
        return 'This action adds a new user';
    }

    findAll() {
        return `This action returns all user`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    async register(req) {
        if (!req.body.hasOwnProperty('username')) {
            return {
                status: 400,
                message: "Request must contain a username"
            }
        } else {
            try {
                const registerResult = await this.ca.registerAndEnrollUser(this.fsw.getCaClient(), await this.fsw.getWallet(), process.env.MSP_ORG, req.body.username, process.env.AFFILICATION);
                return {
                    status: 200,
                    message: registerResult
                }
            } catch (e) {
                return {
                    status: e.status,
                    message: e.message,
                }
            }
        }
    }

    async clientTokensAmount(req) {
        if (!req.query.hasOwnProperty('username')) {
            return {
                status: 400,
                message: "Request must contain a username"
            }
        } else {
            try {
                const userTokensAmount = await this.userUtils.getUserTokensAmount(req.query.username)
                return {
                    status: 200,
                    amount: userTokensAmount
                }
            } catch (e) {
                return {
                    status: 400,
                    message: e.message
                }
            }
        }
    }

    async clientId(req) {
        if (!req.query.hasOwnProperty('username')) {
            return {
                status: 400,
                message: "Request must contain a username"
            }
        } else {
            try {
                const clientId = await this.userUtils.getUserClientId(req.query.username)
                return {
                    status: 200,
                    clientId
                }
            } catch (e) {
                return {
                    status: 400,
                    message: e.message
                }
            }
        }
    }

}
