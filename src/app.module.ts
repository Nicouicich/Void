import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './modules/player/player.module';
import { PlayerService } from './services/player/player.service';
import { RecentMatchesModule } from './modules/recent-matches/recent-matches.module';
import { RecentMatchesService } from './services/recent-matches/recent-matches.service';
import { RecentMatchesController } from './controllers/recent-matches/recent-matches.controller';
import { PlayerController } from './controllers/player/player.controller';

@Module({
  imports: [PlayerModule, RecentMatchesModule],
  controllers: [AppController, RecentMatchesController, PlayerController],
  providers: [AppService, PlayerService, RecentMatchesService],
})
export class AppModule {}
