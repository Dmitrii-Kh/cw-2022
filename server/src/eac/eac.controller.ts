import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EacService } from './eac.service';
import { CreateEacDto } from './dto/create-eac.dto';
import { UpdateEacDto } from './dto/update-eac.dto';

@Controller('eac')
export class EacController {
  constructor(private readonly eacService: EacService) {}

  @Post()
  create(@Body() createEacDto: CreateEacDto) {
    return this.eacService.create(createEacDto);
  }

  @Get()
  findAll() {
    return this.eacService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eacService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEacDto: UpdateEacDto) {
    return this.eacService.update(+id, updateEacDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eacService.remove(+id);
  }
}
