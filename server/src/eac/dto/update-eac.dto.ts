import { PartialType } from '@nestjs/swagger';
import { CreateEacDto } from './create-eac.dto';

export class UpdateEacDto extends PartialType(CreateEacDto) {}
