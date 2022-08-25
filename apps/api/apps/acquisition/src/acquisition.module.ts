import { Module } from '@nestjs/common';
import { ConfigModule } from '@tenet/config';
import { DatabaseModule } from '@tenet/database';
import { LoggerModule } from 'nestjs-pino';
import { AcquisitionController } from './acquisition.controller';
import { AcquisitionService } from './acquisition.service';
import { PersonModule } from './person/person.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    LoggerModule.forRoot(<any>{
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
        genReqId: (req, res) => {
          if (req.id) return req.id;
          let id = req.get('X-Request-Id');
          if (id) return id;
          id = crypto.randomUUID();
          res.header('X-Request-Id', id);
          return id;
        },
        transport:
          process.env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  // translateTime: 'UTC:mm/dd/yyyy h:MM:ss TT Z',
                  ignore: 'hostname',
                  singleLine: true,
                  translateTime: 'mm/dd/yyyy h:MM:ss TT Z',
                  messageFormat: '{req.headers.X-Request-Id} [{context}] {msg}',
                  errorLikeObjectKeys: ['err', 'error'],
                },
              }
            : undefined,
      },
    }),
    PersonModule,
    ProductModule,
  ],
  controllers: [AcquisitionController],
  providers: [AcquisitionService],
})
export class AcquisitionModule {}
