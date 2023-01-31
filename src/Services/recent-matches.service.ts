import {HttpService} from '@nestjs/axios';
import {Injectable} from '@nestjs/common';
import {enviromentVars} from 'src/config/config';
import {firstValueFrom} from 'rxjs';
import {logger} from 'src/config/winston';

@Injectable()
export class RecentMatchesService {
    private STATUS_CORRECT = 200;

    constructor(private readonly HttpService: HttpService) {}

    async getRecentMatches(puuid: string, region: string, recentMatches: number = 20) {
        try {
            const url = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${recentMatches}&api_key=${enviromentVars.LOL_API_KEY}`;
            const response = await firstValueFrom(this.HttpService.get(url));
            return response.data;
        }

        catch (e) {
            logger.error(`Error while requesting a recent matches from the player with PuuID: ${puuid}. Status code: ${e.response.status}`);
            return e.response.status;
        }

    }
}
