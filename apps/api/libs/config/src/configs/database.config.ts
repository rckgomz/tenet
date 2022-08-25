import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { join } from 'path';

let conn: { host: string; extra?: { socketPath: string } } = {
  host: process.env.DB_HOST || 'db',
};

if (process.env.DB_INSTANCE_UNIX_SOCKET) {
  conn = {
    ...conn,
    extra: {
      socketPath: process.env.DB_HOST,
    },
  };
}

export default () =>
  ({
    type: process.env.DB_DIALECT || 'postgres',
    ...conn,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'tenet',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'tenet',
    logging: process.env.DB_LOGGING === 'true',
    entities: [join(__dirname, '../', '**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '../', '**/*/database/migrations/**/*.ts')],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    dropSchema: process.env.DB_DROP_SCHEMA === 'true',
    migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
    autoLoadEntities: true,
    namingStrategy: new SnakeNamingStrategy(),
  } as TypeOrmModuleOptions);
