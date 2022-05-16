import { Controller, Get, Post, Body, Param, Delete, Req, Request, Put, UseGuards } from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  create(@Body() createTokenDto: CreateTokenDto, @Req() req) {
    return this.tokenService.create(createTokenDto, req.user.id);
  }

  @Get()
  findAll(@Req() req) {
    return this.tokenService.getClientUTXOs(req.user.id);
  }

  @Put()
  transfer(@Req() req: Request) {
    return this.tokenService.transferByKeyAndAmount(req.body);
  }

  @Delete()
  redeem(@Req() req: Request) {
    return this.tokenService.redeem(req);
  }
}
