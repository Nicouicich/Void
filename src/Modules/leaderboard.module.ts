import { PlayerModule } from './player.module';
import { LeaderboardService } from './../Services/leaderboard.service';
import { LeaderboardController } from './../Controllers/leaderboard.controller';
import { DataSource } from 'typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';

import { DatabaseModule } from './database.module';
import { SummonerStatsEntity } from 'src/Entities/summonerStats.entity';
import { PlayerController } from '../Controllers/player.controller';
import { PlayerService } from '../Services/player.service';
import { RecentMatchesModule } from './recent-matches.module';
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
