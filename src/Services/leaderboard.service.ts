import { Repository } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';

import { SummonerStatsEntity } from 'src/Entities/summonerStats.entity';
import { MatchEntity } from 'src/Entities/match.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @Inject('SUMMONER_STATS_REPOSITORY')
    private playerRepo: Repository<SummonerStatsEntity>,
    @Inject('RECENT_MATCH_REPOSITORY')
    private matchRepo: Repository<MatchEntity>,
  ) {}
}
