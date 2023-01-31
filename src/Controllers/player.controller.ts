import { Controller, Body, Get } from '@nestjs/common';

import { SummonerDto } from '../Dto/summoner.dto';
import { PlayerService } from 'src/Services/player.service';

@Controller('player')
export class PlayerController {
  constructor(private PlayerService: PlayerService) {}

  @Get()
  async getPlayer(@Body() summoner: SummonerDto) {
    const summonerID = await this.PlayerService.getPlayerIdByName(
      summoner.summonerName,
      summoner.region,
    );
    if (typeof summonerID === 'string') {
      const stats = await this.PlayerService.getPlayerStats(
        summonerID,
        summoner.region,
      );
      return stats;
    } else {
      return {
        data: `Could not retrieve a player with summoner name: ${summoner.summonerName} and region: ${summoner.region}`,
        status_code: summonerID,
      };
    }
  }

}
