import { DataSource } from 'typeorm';

import { SummonerStatsEntity } from '../Entities/summonerStats.entity';
import { MatchEntity } from '../Entities/match.entity';
import { enviromentVars } from '../config/testConfig';

export const databaseTestProvider = {
  provide: 'DATA_SOURCE',
  useFactory: async () => {
    const dataSource = new DataSource({
      name: 'test',
      type: 'postgres',
      host: enviromentVars.DB_HOST,
      port: parseInt(enviromentVars.DB_TEST_PORT),
      username: enviromentVars.DB_TEST_USERNAME,
      password: enviromentVars.DB_TEST_PASSWORD,
      database: enviromentVars.DB_TEST_NAME,
      entities: [SummonerStatsEntity, MatchEntity],
      synchronize: true,
    });

    return dataSource.initialize();
  },
};
