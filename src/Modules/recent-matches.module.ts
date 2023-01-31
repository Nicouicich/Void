import { RecentMatchesService } from './../Services/recent-matches.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RecentMatchesController } from 'src/Controllers/recent-matches.controller';
import { PlayerService } from 'src/Services/player.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchEntity } from 'src/Entities/match.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([MatchEntity])],
  controllers: [RecentMatchesController],
  providers: [RecentMatchesService, PlayerService],
})
export class RecentMatchesModule {}
