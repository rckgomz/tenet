import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppConfig } from '@tenet/config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AcquisitionModule } from './acquisition.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AcquisitionModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  const config = app.get(ConfigService);
  const appConfig = config.get<AppConfig>('app');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: appConfig.defaultVersion,
  });
  app.setGlobalPrefix(appConfig.globalPrefix);

  const logger = app.get(Logger);
  await app.listen(appConfig.port, '0.0.0.0', () => {
    logger.log(
      `Server is listen on http://localhost:${config.get('app.port')}`,
    );
  });
}
bootstrap();
