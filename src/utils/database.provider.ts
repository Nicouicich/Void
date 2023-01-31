import { DataSource } from 'typeorm';
import { SummonerStatsEntity } from 'src/Entities/summonerStats.entity';
import { MatchEntity } from 'src/Entities/match.entity';

export const databaseProvider =
{
    provide: 'DATA_SOURCE',
    useFactory: async () => {
        const dataSource = new DataSource({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'nicolas',
            database: 'void',
            entities: [SummonerStatsEntity, MatchEntity],
            synchronize: true,
        });

        return dataSource.initialize();
    },
};