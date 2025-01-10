import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthCheck() {
    return {
      version: '1.0.0',
      status: 'OK',
    };
  }
}
