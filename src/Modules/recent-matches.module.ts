import { RecentMatchesService } from './../Services/recent-matches.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RecentMatchesController } from 'src/Controllers/recent-matches.controller';
import { PlayerService } from 'src/Services/player.service';

@Module({
  imports: [HttpModule],
  controllers: [RecentMatchesController],
  providers: [RecentMatchesService, PlayerService],
})
export class RecentMatchesModule {}
