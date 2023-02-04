import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecentMatchesModule } from './Modules/recent-matches.module';
import { LeaderboardModule } from './Modules/leaderboard.module';


@Module({
  imports: [RecentMatchesModule, HttpModule, LeaderboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
