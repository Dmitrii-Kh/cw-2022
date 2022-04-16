import {Controller, Get, Post, Body, Param, Delete, Req, Request} from '@nestjs/common';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tokenService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tokenService.remove(+id);
  }
}
