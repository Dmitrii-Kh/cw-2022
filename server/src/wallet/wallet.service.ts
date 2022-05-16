import {
    Injectable,
    InternalServerErrorException,
    Logger,
    UnprocessableEntityException,
    UseGuards,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletRepository } from './wallet.repository';
import { FiatCurrencyEnum } from './fiat-currency.enum';
import { Wallet } from './entities/wallet.entity';
import { UpdateResult } from 'typeorm';

@Injectable()
export class WalletService {
    private logger = new Logger('WalletService');

    constructor(
        @InjectRepository(WalletRepository)
        private walletRepository: WalletRepository,
    ) {
    }

    public async create(createWalletDto): Promise<Wallet> {
        try {
            // @ts-ignore
            const wallet: Wallet = this.walletRepository.create(createWalletDto);
            await wallet.save();
            this.logger.verbose('Wallet created successfully: ', wallet.userId);
            return wallet;
        } catch (e) {
            this.logger.error(`Failed to create new wallet: `, e.stack);
            throw new InternalServerErrorException();
        }
    }

    public async balance(userId: number, currency: FiatCurrencyEnum = FiatCurrencyEnum.USD): Promise<number> {
        try {
            let wallet = await this.walletRepository.findOne({
                where: { userId, currency },
            });
            if (!wallet) {
                throw new UnprocessableEntityException(`Wallet records not found : ${userId}, ${currency}`);
            }
            this.logger.verbose('Balance retrieved successfully');
            return wallet.balance;
        } catch (e) {
            this.logger.error(`Failed to read balance: `, e.stack);
            throw new InternalServerErrorException();
        }
    }

    findAll() {
        return `This action returns all wallet`;
    }

    findOne(id: number) {
        return `This action returns a #${id} wallet`;
    }

    public async update(updateWalletDto: UpdateWalletDto): Promise<UpdateResult> {
        try {
            const { userId, currency = FiatCurrencyEnum.USD, amount } = updateWalletDto;
            let wallet = await this.walletRepository.findOne({
                where: { userId, currency },
            });
            if (!wallet) {
                throw new UnprocessableEntityException(`Wallet records not found : ${userId}, ${currency}`);
            }
            let res = await this.walletRepository.update({
                userId
            }, {
                balance: wallet.balance + amount,
            });
            this.logger.verbose('Balance modified successfully');
            return res;
        } catch (e) {
            this.logger.error(`Failed to create new wallet: `, e.stack);
            throw new InternalServerErrorException();
        }
    }

    remove(id: number) {
        return `This action removes a #${id} wallet`;
    }
}
