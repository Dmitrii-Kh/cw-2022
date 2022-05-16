import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
    update(@Body() updateWalletDto: UpdateWalletDto) {
        return this.walletService.update(updateWalletDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.walletService.remove(+id);
    }
}
