import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppConfig } from '@tenet/config';
import { AcquisitionModule } from './acquisition.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AcquisitionModule,
    new FastifyAdapter(),
  );

  const config = app.get(ConfigService);
  const appConfig = config.get<AppConfig>('app');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: appConfig.defaultVersion,
  });
  app.setGlobalPrefix(appConfig.globalPrefix);

  console.log(appConfig.port);
  await app.listen(appConfig.port, '0.0.0.0');
}
bootstrap();
