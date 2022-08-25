import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { PinoTypeormLogger } from './typeorm.logger';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService, PinoLogger],
      useFactory: (
        config: ConfigService,
        logger: PinoLogger,
      ): TypeOrmModuleOptions => {
        logger.setContext('DatabaseModule');
        return {
          ...config.get('database'),
          logger: new PinoTypeormLogger(logger),
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
