import { DataSource } from 'typeorm';

import { SummonerStatsEntity } from '../Entities/summonerStats.entity';
import { MatchEntity } from '../Entities/match.entity';
import { enviromentVars } from '../config/config';

export const databaseProvider = {
  provide: 'DATA_SOURCE',
  useFactory: async () => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: enviromentVars.DB_HOST,
      port: parseInt(enviromentVars.DB_PORT),
      username: enviromentVars.DB_USERNAME,
      password: enviromentVars.DB_PASSWORD,
      database: enviromentVars.DB_NAME,
      entities: [SummonerStatsEntity, MatchEntity],
      synchronize: true,
    });
    return dataSource.initialize();
  },
};
