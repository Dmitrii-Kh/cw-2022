import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateWalletDtoApi } from './dto/update-wallet-api.dto';
import { plainToInstance } from 'class-transformer';
import { FiatCurrencyEnum } from './fiat-currency.enum';

@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) {
    }

    @Post()
    create(@Body() createWalletDto: CreateWalletDto) {
        return this.walletService.create(createWalletDto);
    }

    @Get()
    findAll() {
        return this.walletService.findAll();
    }

    @Get(':userId')
    findOne(@Param('userId') userId: string) {
        return this.walletService.balance(+userId);
    }

    @Patch()
    update(@Body() updateWalletDto: UpdateWalletDtoApi, @Req() req) {
        return this.walletService.update(plainToInstance(UpdateWalletDto, {
            userId: req.user.id,
            currency: updateWalletDto.currency,
            amount: updateWalletDto.amount,
        }));
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.walletService.remove(+id);
    }
}
