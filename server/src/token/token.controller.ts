import { Controller, Get, Post, Body, Delete, Req, Request, Put, UseGuards } from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../utils/userRole';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  @Roles(UserRole.OrganisationOwner)
  create(@Body() createTokenDto: CreateTokenDto, @Req() req) {
    return this.tokenService.create(createTokenDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.OrganisationOwner, UserRole.Investor)
  findAll(@Req() req) {
    return this.tokenService.getClientUTXOs(req.user.id);
  }

  @Put()
  @Roles(UserRole.OrganisationOwner)
  transfer(@Req() req: Request) {
    return this.tokenService.transferByKeyAndAmount(req.body);
  }

  @Delete()
  @Roles(UserRole.OrganisationOwner)
  redeem(@Req() req: Request) {
    return this.tokenService.redeem(req);
  }
}
