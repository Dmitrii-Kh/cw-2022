import { Controller, Get, Post, Body, Param, Delete, Req, Request, Put } from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  create(@Body() createTokenDto: CreateTokenDto, @Req() req: Request) {
    return this.tokenService.create(createTokenDto, req);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.tokenService.get(req);
  }

  @Put()
  transfer(@Req() req: Request) {
    return this.tokenService.transferByKey(req.body);
  }

  @Delete()
  redeem(@Req() req: Request) {
    return this.tokenService.redeem(req);
  }
}
