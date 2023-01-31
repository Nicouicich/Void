import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { enviromentVars } from 'src/config/config';
import { firstValueFrom } from 'rxjs';
import { logger } from 'src/config/winston';

@Injectable()
export class PlayerService {
  private STATUS_CORRECT = 200;

  constructor(private readonly HttpService: HttpService) {}

  public async getPlayerIdByName(summonerName: string, region: string) {
    try {
      const name = summonerName.replaceAll(' ', '%20');
      const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${enviromentVars.LOL_API_KEY}`;
      const response = await firstValueFrom(this.HttpService.get(url));
      const data = response.data;
      console.log(data);
      const status = response.status;

      if (status === this.STATUS_CORRECT) {
        return data.id;
      }
    } catch (e) {
      const message = `Error while requesting a player ID by name. Status code: ${e.response.status}`;
      logger.error(message);
      return {
        message: message,
        status_code: e.response.status,
      };
    }
  }

  public async getPlayerStats(summonerID: string, region: string) {
    try {
      const url = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=${enviromentVars.LOL_API_KEY}`;
      const response = await firstValueFrom(this.HttpService.get(url));
      const status = response.status;

      if (status === this.STATUS_CORRECT) {
        return response.data;
      }
    } catch (e) {
      const message = `Error while requesting a player status by Summoner ID. Status code: ${e.response.status}`;
      logger.error(message);
      return {
        message: message,
        status_code: e.response.status,
      };
    }
  }

  public async getPlayerPuuIDByName(summonerName: string, region: string) {
    try {
      const name = summonerName.replaceAll(' ', '%20');
      const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${enviromentVars.LOL_API_KEY}`;
      const response = await firstValueFrom(this.HttpService.get(url));
      if (response) {
        return response.data.puuid;
      }
    } catch (e) {
      const message = `Error while requesting a player PuuID by name. ${e.cause}`;
      logger.error(message);
      return {
        message: message,
        response: e.cause,
      };
    }
  }
}
