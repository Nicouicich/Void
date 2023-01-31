import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { enviromentVars } from 'src/config/config';
import { firstValueFrom } from 'rxjs';
import { logger } from 'src/config/winston';
import { Repository } from 'typeorm';

import { MatchEntity } from 'src/Entities/match.entity';

@Injectable()
export class RecentMatchesService {

    constructor(private HttpService: HttpService,
        @Inject("RECENT_MATCH_REPOSITORY") private matchRepo: Repository<MatchEntity>
    ) {}

    createMatch(match: any) {
        const newMatch = this.matchRepo.create(match);
        return this.matchRepo.save(newMatch);
    }

    public async getRecentMatches(
        puuid: string,
        region: string,
        recentMatches = 20,
    ) {
        try {
            const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${recentMatches}&api_key=${enviromentVars.LOL_API_KEY}`;
            const response = await firstValueFrom(this.HttpService.get(url));
            return response.data;
        }
        catch (e) {
            logger.error(
                `Error while requesting a recent matches from the player with PuuID: ${puuid}. Status code: ${e.response.status}`,
            );
            return e.response.status;
        }
    }

    public async getInfoAboutAMatch(matchID: string, region: string, puuID: string) {
        try {
            const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}?api_key=${enviromentVars.LOL_API_KEY}`;
            const response = await firstValueFrom(this.HttpService.get(url));
            if (response) {
                const data = await response.data.info.participants.filter(match => {

                    if (match.puuid === puuID) {
                        const matchInfo = match;
                        matchInfo.queueId = response.data.info.queueId;
                        matchInfo.gameDuration = response.data.info.gameDuration;
                        matchInfo.matchId = matchID;
                        matchInfo.kda = match.challenges.kda;
                        return matchInfo;
                    }
                });
                return data;
            }
        }
        catch (e) {

        }
    }

}
