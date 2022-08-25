// thanks to https://github.com/jtmthf/nestjs-pino-logger/issues/2#issuecomment-749495022
import { Logger, QueryRunner } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';

export class PinoTypeormLogger implements Logger {
  constructor(private readonly logger: PinoLogger) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    const sql =
      query +
      (parameters && parameters.length
        ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
        : '');
    this.logger.debug(sql);
  }

  logQueryError(
    _error: string,
    query: string,
    parameters?: any[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _queryRunner?: QueryRunner,
  ) {
    const sql =
      query +
      (parameters && parameters.length
        ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
        : '');
    this.logger.error(sql);
  }

  logQuerySlow(
    _time: number,
    query: string,
    parameters?: any[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _queryRunner?: QueryRunner,
  ) {
    const sql =
      query +
      (parameters && parameters.length
        ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
        : '');
    this.logger.info(sql);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
    this.logger.debug(message);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logMigration(message: string, _queryRunner?: QueryRunner) {
    this.logger.debug(message);
  }

  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _queryRunner?: QueryRunner,
  ) {
    switch (level) {
      case 'log':
      case 'info':
        this.logger.info(message);
        break;
      case 'warn':
        this.logger.warn(message);
        break;
    }
  }

  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      // most probably circular objects in parameters
      return parameters;
    }
  }
}