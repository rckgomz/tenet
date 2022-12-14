import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@tenet/config';
import { DatabaseModule } from '@tenet/database';
import { LoggerModule } from 'nestjs-pino';
import { AcquisitionModule } from '../src/acquisition.module';

describe('AcquisitionController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AcquisitionModule, ConfigModule, DatabaseModule, LoggerModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  it('/ (GET) Person', () => {
    return request(app.getHttpServer())
      .get('/persons')
      .expect(200)
      .expect('Hello World!');
  });
});
