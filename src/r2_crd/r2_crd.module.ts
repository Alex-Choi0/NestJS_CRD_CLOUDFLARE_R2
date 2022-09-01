import { Module } from '@nestjs/common';
import { R2CrudController } from './r2_crd.controller';
import { R2CrdService } from './r2_crd.service';

@Module({
  controllers: [R2CrudController],
  providers: [R2CrdService],
})
export class R2CrdModule {}
