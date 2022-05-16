import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { CreateEacDto } from './dto/create-eac.dto';
import { UpdateEacDto } from './dto/update-eac.dto';
import { EAC } from './entities/eac.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EacRepository } from './eac.repository';
import { TokenService } from '../token/token.service';
import { WalletService } from '../wallet/wallet.service';
import { Measurement } from '../measurements/entities/measurement.entity';
import { userInfo } from 'os';
import { plainToInstance } from 'class-transformer';
import { UpdateWalletDto } from '../wallet/dto/update-wallet.dto';
import { FiatCurrencyEnum } from '../wallet/fiat-currency.enum';
import { UserService } from '../user/user.service';

@Injectable()
export class EacMarketService {
    private logger = new Logger('EacMarketService');

    constructor(
        @InjectRepository(EacRepository)
        private eacRepository: EacRepository,
        private userService: UserService,
        private tokenService: TokenService,
        private walletService: WalletService,
    ) {
    }

    public async buyEac(buyerId, tokenOwnerId, tokenId, amount) {
        try {
            // 0. findOne token
            const eacToBuy = await this.eacRepository.findOne(tokenId, tokenOwnerId);
            if (!eacToBuy) throw new NotFoundException('Eac not found');
            // 1. check balance of buyer
            const buyerBalance = await this.walletService.balance(buyerId);
            const token = (await this.tokenService.getClientUTXOs(tokenOwnerId)).find(token => token.utxo_key === tokenId);
            if (!token) throw new NotFoundException('Token not found');
            if (token.amount < amount) throw new BadRequestException('Purchase amount exceeds token amount');
            const withdrawalAmount = eacToBuy.price * amount;
            if (buyerBalance < withdrawalAmount) throw new BadRequestException('Insufficient balance');
            // 2. withdraw fiat
            await this.walletService.update(plainToInstance(UpdateWalletDto, {
                userId: buyerId,
                currency: FiatCurrencyEnum.USD,
                amount: -withdrawalAmount,
            }));
            // 3. transfer token
            const newTokensArray = await this.tokenService.transferByKeyAndAmount({
                userId: tokenOwnerId,
                recipientId: buyerId,
                token: tokenId,
                amount,
            });
            this.logger.verbose(`token transferred successfully`, newTokensArray);
            const tokenOwnerPublicKey = await this.userService.clientId(tokenOwnerId);
            const newTokenId = newTokensArray.find(token => token.owner === tokenOwnerPublicKey).utxo_key;
            // 4. deposit owner's balance
            await this.walletService.update(plainToInstance(UpdateWalletDto, {
                userId: tokenOwnerId,
                currency: FiatCurrencyEnum.USD,
                amount: withdrawalAmount,
            }));
            // 5. update EAC (delete/update)
            if(token.amount === amount) {
                await this.delete(tokenId, tokenOwnerId);
            } else {
                await this.update(tokenOwnerId, plainToInstance(UpdateEacDto, { oldTokenId: tokenId, tokenId: newTokenId }))
            }
            this.logger.verbose(`EAC purchased successfully`);
            return {
                status: 200,
                message: 'EAC purchased successfully',
                new_token_id: newTokenId
            }
        } catch (e) {
            this.logger.error(`Failed to buy EAC ${tokenId}`, e);
            throw e || new InternalServerErrorException('EAC buy failed');
        }
    }

    public async sellEac(userId: number, createEacDto: CreateEacDto): Promise<EAC> {
        const { tokenId } = createEacDto;
        let found = await this.eacRepository.findOne({
            where: { userId, tokenId },
        });
        if (found) throw new UnprocessableEntityException('EAC is already on market');
        let token = (await this.tokenService.getClientUTXOs(userId)).find(token => token.utxo_key === tokenId);
        if (!token) throw new NotFoundException('Token not found');
        try {
            const eac = this.eacRepository.create({ ...createEacDto, userId });
            await eac.save();
            return eac;
        } catch (error) {
            this.logger.error(`Failed to create new EAC ${tokenId} on market for ${userId}`, error);
            throw new InternalServerErrorException('EAC creation failed');
        }
    }

    async findAll(): Promise<EAC[]> {
        const query = this.eacRepository.createQueryBuilder('eac');
        try {
            return await query.getMany();
        } catch (error) {
            this.logger.error(`Failed to get all EACs: `, error.stack);
            throw new InternalServerErrorException();
        }
    }

    public async findOne(userId: number, tokenId: string): Promise<EAC> {
        try {
            const query = this.eacRepository.createQueryBuilder('eac')
                .where('userId = :userId AND tokenId = :tokenId',
                    { userId, tokenId });

            return await query.getOne();
        } catch (error) {
            this.logger.error(`Failed to get EAC: ${tokenId}, ${userId}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    public async update(userId: number, updateEacDto: UpdateEacDto) {
        let found = await this.eacRepository.findOne({
            where: { userId, tokenId: updateEacDto.oldTokenId },
        });
        if (!found) throw new NotFoundException('EAC not found!');
        try {
            await this.eacRepository
                .createQueryBuilder()
                .update(EAC)
                .set({ tokenId: updateEacDto.tokenId })
                .where('userId = :userId AND tokenId = :tokenId',
                    { userId, tokenId: updateEacDto.oldTokenId })
                .execute();
        } catch (e) {
            this.logger.error(`Failed to update EAC ${updateEacDto.tokenId}`, e.stack);
        }
    }

    public async delete(
        tokenId: string,
        userId: number,
    ): Promise<boolean> {
        try {
            await this.eacRepository
                .createQueryBuilder('eac')
                .delete()
                .where(
                    'tokenId = :tokenId AND ' +
                    'userId = :userId',
                    {
                        tokenId,
                        userId,
                    },
                )
                .execute();
            return true;
        } catch (error) {
            this.logger.error(`Failed to delete EAC ${tokenId}`, error.stack);
            throw new InternalServerErrorException();
        }
    }
}
