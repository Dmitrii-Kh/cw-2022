import { Injectable } from '@nestjs/common';
import { CreateEacDto } from './dto/create-eac.dto';
import { UpdateEacDto } from './dto/update-eac.dto';

@Injectable()
export class EacMarketService {
  create(createEacDto: CreateEacDto) {
    return 'This action adds a new eac-market';
  }

  findAll() {
    return `This action returns all eac`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eac`;
  }

  update(id: number, updateEacDto: UpdateEacDto) {
    return `This action updates a #${id} eac`;
  }

  remove(id: number) {
    return `This action removes a #${id} eac`;
  }
}
