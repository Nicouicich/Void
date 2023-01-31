import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './Modules/player.module';
import { RecentMatchesModule } from './Modules/recent-matches.module';

@Module({
  imports: [RecentMatchesModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
