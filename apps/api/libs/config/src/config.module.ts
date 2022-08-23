import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig from './configs/app.config';
import databaseConfig from './configs/database.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({ app: appConfig() }),
        () => ({ database: databaseConfig() }),
      ],
    }),
  ],
})
export class ConfigModule {}
