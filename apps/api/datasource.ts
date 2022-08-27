import { DataSource, DataSourceOptions } from 'typeorm';

import * as conn from './ormconfig';

const AppDataSource = new DataSource(<DataSourceOptions>conn);
export default AppDataSource;
