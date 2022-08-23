import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppConfig } from '@tenet/config';
import { AcquisitionModule } from './acquisition.module';

async function bootstrap() {
  const app = await NestFactory.create(AcquisitionModule);

  const config = app.get<AppConfig>(ConfigService);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: config.defaultVersion,
  });
  app.setGlobalPrefix(config.globalPrefix);

  await app.listen(config.port);
}
bootstrap();
