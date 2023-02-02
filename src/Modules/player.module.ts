import { DataSource } from 'typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { DatabaseModule } from './database.module';
import { SummonerStatsEntity } from 'src/Entities/summonerStats.entity';
import { PlayerController } from '../Controllers/player.controller';
import { PlayerService } from '../Services/player.service';
import { RecentMatchesModule } from './recent-matches.module';


@Module({
  imports: [HttpModule, DatabaseModule, forwardRef(() => RecentMatchesModule)],
  controllers: [PlayerController],
  providers: [PlayerService,
    {
      provide: 'SUMMONER_STATS_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(SummonerStatsEntity),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [PlayerService]
})
export class PlayerModule {}
