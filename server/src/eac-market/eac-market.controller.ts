import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete, UseGuards, Req
} from '@nestjs/common';
import { EacMarketService } from './eac-market.service';
import { CreateEacDto } from './dto/create-eac.dto';
import { UpdateEacDto } from './dto/update-eac.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('eac-market')
export class EacMarketController {

    constructor(private readonly eacService: EacMarketService) {
    }

    @Post('sell')
    create(@Body() createEacDto: CreateEacDto, @Req() req) {
        return this.eacService.sellEac(req.user.id, createEacDto);
    }

    @Post('buy')
    buy(@Req() req) {
        const { userId, tokenId, amount } = req.body;
        return this.eacService.buyEac(req.user.id, userId, tokenId, amount);
    }

    @Get()
    findAll() {
        return this.eacService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req) {
        return this.eacService.findOne(req.user.id, id);
    }

    @Patch()
    update(@Req() req, @Body() updateEacDto: UpdateEacDto) {
        return this.eacService.update(req.user.id, updateEacDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Req() req) {
        return this.eacService.delete(id, req.user.id);
    }
}
