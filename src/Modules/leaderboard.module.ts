import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';

import { PlayerModule } from './player.module';
import { LeaderboardService } from './../Services/leaderboard.service';
import { LeaderboardController } from './../Controllers/leaderboard.controller';
import { DatabaseModule } from './database.module';
import { SummonerStatsEntity } from 'src/Entities/summonerStats.entity';
import { MatchEntity } from 'src/Entities/match.entity';


@Module({
    imports: [DatabaseModule,  PlayerModule],
    controllers: [LeaderboardController],
    providers: [LeaderboardService, 
        {
            provide: 'SUMMONER_STATS_REPOSITORY',
            useFactory: (dataSource: DataSource) => dataSource.getRepository(SummonerStatsEntity),
            inject: ['DATA_SOURCE'],
        },
        {
            provide: 'RECENT_MATCH_REPOSITORY',
            useFactory: (dataSource: DataSource) => dataSource.getRepository(MatchEntity),
            inject: ['DATA_SOURCE'],
        },
    ],
})
export class LeaderboardModule {}
