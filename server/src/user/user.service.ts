import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CaService } from '../utils/fabric/ca/ca.service';
import { UserUtils } from '../utils/user/user.service';
import { FabricWalletService } from '../utils/fabric/fabric-wallet.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { WalletService } from '../wallet/wallet.service';
import { FiatCurrencyEnum } from '../wallet/fiat-currency.enum';

@Injectable()
export class UserService {
    private logger = new Logger('UserService');
    private saltRounds = 8;

    constructor(
        private ca: CaService,
        private fsw: FabricWalletService,
        private userUtils: UserUtils,
        private walletService: WalletService,
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {

    }

    public async create(createUserDto: CreateUserDto): Promise<User> {
        let user;
        const found = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (found) throw new UnprocessableEntityException('User already exists');
        try {
            const salt = bcrypt.genSaltSync(this.saltRounds);
            const password = bcrypt.hashSync(createUserDto.password, salt);
            user = await this.userRepository.create({ ...createUserDto, password });
            await user.save();
            await this.walletService.create({ userId: user.id, currency: FiatCurrencyEnum.USD, balance: 0 });
            this.logger.verbose('User added successfully: ', user.id);
        } catch (e) {
            this.logger.error(`Failed to add new user: `, e.stack);
            throw new InternalServerErrorException();
        }
        return user;
    }

    findAll() {
        return `This action returns all user`;
    }


    public async getUserByEmail(
        email: string,
    ): Promise<User> {
        let found;
        try {
            found = await this.userRepository.findOne({
                where: { email },
            });
        } catch (error) {
            this.logger.error(`Failed to get user by email: ${email}: `, error.stack);
            throw new InternalServerErrorException();
        }
        if (!found) {
            throw new NotFoundException(`User with email: ${email} not found`);
        }
        return found;
    }

    public async getUserById(
        id: number,
    ): Promise<User> {
        let found;
        try {
            found = await this.userRepository.findOne({
                where: { id },
            });
        } catch (error) {
            this.logger.error(`Failed to get user by id: ${id}: `, error.stack);
            throw new InternalServerErrorException();
        }
        if (!found) {
            throw new NotFoundException(`User with email: ${id} not found`);
        }
        return found;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    async clientTokensAmount(req) {
        if (!req.query.hasOwnProperty('username')) {
            return {
                status: 400,
                message: 'Request must contain a username',
            };
        } else {
            try {
                const userTokensAmount = await this.userUtils.getUserTokensAmount(req.query.username);
                return {
                    status: 200,
                    amount: userTokensAmount,
                };
            } catch (e) {
                return {
                    status: 400,
                    message: e.message,
                };
            }
        }
    }

    async clientId(userId) {
        if (!userId) {
            throw {
                status: 400,
                message: 'Request must contain a userId',
            };
        } else {
            try {
                return await this.userUtils.getUserClientId(userId);
            } catch (e) {
                throw {
                    status: 400,
                    message: e.message,
                };
            }
        }
    }

}
