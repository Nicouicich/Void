import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { PlayerModule } from './player.module';
import { DatabaseModule } from './database.module';
import { RecentMatchesService } from './../Services/recent-matches.service';
import { RecentMatchesController } from 'src/Controllers/recent-matches.controller';
import { MatchEntity } from 'src/Entities/match.entity';

@Module({
  imports: [HttpModule, DatabaseModule, forwardRef(() => PlayerModule)],
  controllers: [RecentMatchesController],
  providers: [
    RecentMatchesService,
    {
      provide: 'RECENT_MATCH_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(MatchEntity),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [RecentMatchesService],
})
export class RecentMatchesModule {}
