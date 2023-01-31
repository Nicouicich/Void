import { RecentMatchesDto } from './../Dto/recent-matches.dto';
import { RecentMatchesService } from './../Services/recent-matches.service';
import { Controller, Body, Get } from '@nestjs/common';
import { PlayerService } from 'src/Services/player.service';
import { logger } from 'src/config/winston';

@Controller('recent-matches')
export class RecentMatchesController {
  private RECENT_MATCHES_MAX = 100;

  constructor(
    private RecentMatchesService: RecentMatchesService,
    private PlayerService: PlayerService,
  ) {}

  @Get()
  async getRecentMatches(@Body() config: RecentMatchesDto) {
    let message: string;
    let status_code: number;

    if (config.recentMatches <= this.RECENT_MATCHES_MAX) {
      const summonerPuuID = await this.PlayerService.getPlayerPuuIDByName(
        config.summonerName,
        config.region,
      );
      if (typeof summonerPuuID === 'string') {
        const recentMatches = await this.RecentMatchesService.getRecentMatches(
          summonerPuuID,
          config.region,
          config.recentMatches,
        );
        status_code = 200;
        message = recentMatches;
      } else {
        message = `Could not retrieve matches from the summoner name: ${config.summonerName} and region: ${config.region}`;
        logger.error(message);
        status_code = summonerPuuID;
      }
    } else {
      message = `Recent matches can't be more than 100`;
      status_code = 400;
    }
    return {
      data: message,
      status_code: status_code,
    };
  }
}
