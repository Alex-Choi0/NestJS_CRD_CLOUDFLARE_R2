import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { R2CrdService } from './r2_crd.service';

@ApiTags('R2 버킷으로 파일을 올리기 : aws-sdk기반')
@Controller('r2-crud')
export class R2CrudController {
  constructor(private readonly r2CrdService: R2CrdService) {}

  @Get()
  @ApiOperation({ summary: 'R2 버킷리스트 확인' })
  async getBucketList() {
    return await this.r2CrdService.getBucketList();
  }

  @Get('bucket/objects')
  @ApiOperation({ summary: 'R2 버킷에 있는 Object 확인' })
  async getListObjects() {
    return await this.r2CrdService.listObjects();
  }

  @Post()
  @ApiOperation({ summary: '파일을 서버를 통해 cloudflare로 upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileToCloud(
    // 다운로드 받은 파일 속성
    @UploadedFile('file') file,
    // R2 Bucket에 업로드시 사용할 파일 이름
    @Query('uploadFileName') uploadFileName: string,
  ) {
    console.log('file : ', file);

    // data변수를 클라이언트 쪽에 전달한다.
    // 업로드를 실행하고 해당 return값을 client쪽으로 전달한다.
    return await this.r2CrdService.cloud_upload(file.buffer, uploadFileName);
  }

  @Delete(':name')
  @ApiOperation({ summary: 'R2 버킷에서 파일 삭제' })
  @ApiParam({
    name: 'name',
    example: '출력.pdf',
  })
  async deleteBucketData(@Param('name') name: string) {
    return await this.r2CrdService.cloud_delete(name);
  }
}
