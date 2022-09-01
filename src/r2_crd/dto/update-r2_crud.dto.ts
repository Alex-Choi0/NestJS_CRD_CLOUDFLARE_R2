import { PartialType } from '@nestjs/swagger';
import { CreateR2CrudDto } from './create-r2_crud.dto';

export class UpdateR2CrudDto extends PartialType(CreateR2CrudDto) {}
