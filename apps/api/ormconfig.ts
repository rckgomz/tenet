import * as path from 'path'; // eslint-disable-line
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const envConfig = require('dotenv').config({
  path: path.resolve(
    __dirname,
    `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
  ),
});

function env(key: string): string {
  return process?.env[key] || envConfig?.parsed[key];
}

const baseConfig = {
  type: env('DB_DIALECT') || 'postgres',
  database: env('DB_DATABASE'),
  entities: [
    path.resolve(__dirname, `apps/${env('SVC_NAME')}/**/*.entity{.ts,.js}`),
  ],
  migrations: [
    path.resolve(
      __dirname,
      `apps/${env('SVC_NAME')}/**/*/database/migrations/**/*.ts`,
    ),
  ],
  logger: 'advanced-console',
  logging: ['warn', 'error'],
  cli: {
    migrationsDir: path.resolve(
      `apps/${env('SVC_NAME')}/**/*/database/migrations`,
    ),
  },
  namingStrategy: new SnakeNamingStrategy(),
  factories: [`apps/${env('SVC_NAME')}/**/*/database/factories/**/*{.ts,.js}`],
  seeds: [`apps/${env('SVC_NAME')}/**/*/database/seeds/**/*{.ts,.js}`],
};

if (process.env.NODE_ENV !== 'test') {
  module.exports = {
    host: env('DB_HOST'),
    port: +env('DB_PORT'),
    username: env('DB_USERNAME'),
    password: env('DB_PASSWORD'),
    synchronize: false,
    ...baseConfig,
  };
} else {
  module.exports = {
    dropSchema: true,
    synchronize: true,
    ...baseConfig,
  };
}
