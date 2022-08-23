import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AcquisitionModule } from './acquisition.module';

async function bootstrap() {
  const app = await NestFactory.create(AcquisitionModule);

  const config = app.get(ConfigService);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: config.get('app.defaultVersion'),
  });
  app.setGlobalPrefix(config.get('app.globalPrefix'));

  await app.listen(3000);
}
bootstrap();
