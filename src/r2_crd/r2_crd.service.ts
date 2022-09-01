import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import axios from 'axios';

@Injectable()
export class R2CrdService {
  // R2버킷을 사용하기 위해서 .env파일을 입력한다.
  private CLOUD_R2_BUCKET: String = process.env.R2_BUCKET;
  // s3를 사용하기 위해서 Cloud Flare R2 계정의 ACCESS, SECRET_ACCESS KEY를 입력한다.
  private r2 = new AWS.S3({
    endpoint: `https://${process.env.R2_ACCUNT_ID}.r2.cloudflarestorage.com`,
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
  });

  // R2의 버킷을 확인하기 위해 사용
  async getBucketList() {
    return (await this.r2.listBuckets().promise()).Buckets;
  }

  // R2 버킷의 오브젝트를 확인하기 위해 로직
  // env파일에 있는 버킷 이름만 확인함.
  async listObjects() {
    return await this.r2
      .listObjects({ Bucket: process.env.R2_BUCKET })
      .promise();
  }

  // R2 버킷에 파일 업로드
  // env파일에 있는 버킷 이름만 확인함.
  async cloud_upload(file, name) {
    return await axios
      .put(await this.putBucket(name), file['buffer'])
      .then((res) => {
        console.log('response : ', res);
        return {
          status: res['status'],
        };
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }

  // R2 버킷에 올릴수 있는 url을 생성
  // env파일에 있는 버킷 이름만 확인함.
  async putBucket(name: string) {
    console.log('putBucket : ', name);
    return await this.r2.getSignedUrlPromise('putObject', {
      Bucket: this.CLOUD_R2_BUCKET,
      Key: name,
      Expires: 3600,
    });
  }

  // R2 버킷에 있는 오브젝트를 삭제한다.
  // env파일에 있는 버킷 이름만 확인함.
  async deleteFileUrl(name: string) {
    console.log('delete file : ', name);
    return await this.r2.getSignedUrlPromise('deleteObject', {
      Bucket: this.CLOUD_R2_BUCKET,
      Key: name,
      Expires: 3600,
    });
  }

  // R2 버킷의 오브젝트를 삭제하기 위한 url을 생성
  // env파일에 있는 버킷 이름만 확인함.
  async cloud_delete(name: string) {
    return await axios
      .delete(await this.deleteFileUrl(name))
      .then((res) => {
        console.log('response : ', res);
        return {
          status: res['status'],
        };
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }
}
