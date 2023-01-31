import { DatabaseModule } from './database.module';
import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { SummonerStatsEntity } from 'src/Entities/summonerStats.entity';
import { PlayerController } from '../Controllers/player.controller';
import { PlayerService } from '../Services/player.service';


@Module({
  imports: [HttpModule, DatabaseModule],
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
