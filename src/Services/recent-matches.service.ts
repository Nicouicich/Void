import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { enviromentVars } from 'src/config/config';
import { firstValueFrom } from 'rxjs';
import { logger } from 'src/config/winston';

@Injectable()
export class RecentMatchesService {
    constructor(private readonly HttpService: HttpService) {}

    public async getRecentMatches(
        puuid: string,
        region: string,
        recentMatches = 20,
    ) {
        try {
            const regionName = this.getRegionName(region);
            if (regionName) {
                const url = `https://${regionName}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${recentMatches}&api_key=${enviromentVars.LOL_API_KEY}`;
                const response = await firstValueFrom(this.HttpService.get(url));
                return response.data;
            } else {
                return {
                    message: `Region: ${region} unavailable`,
                    status_code: 404
                };
            }
        } catch (e) {
            logger.error(
                `Error while requesting a recent matches from the player with PuuID: ${puuid}. Status code: ${e.response.status}`,
            );
            return e.response.status;
        }
    }


    public async getInfoAboutAMatch(matchID: string, region: string, puuID: string) {
        try {
            const regionName = this.getRegionName(region);
            const url = `https://${regionName}.api.riotgames.com/lol/match/v5/matches/${matchID}?api_key=${enviromentVars.LOL_API_KEY}`;
            const response = await firstValueFrom(this.HttpService.get(url));

            return response.data.info.participants.filter(participant => {
                if (participant.puuid === puuID) {
                    participant.queueId = response.data.info.queueId;
                    participant.gameDuration = response.data.info.gameDuration;
                    participant.matchId = matchID;
                    return participant;
                }
            })[0];
        }
        catch (e) {

        }
    }

    private getRegionName(region: string): string | null {
        region = region.toUpperCase();
        let response: string | null;
        switch (region) {
            case 'BR1':
            case 'LA1':
            case 'LA2':
            case 'NA1':
                response = 'americas';
                break;
            case 'EUN1':
            case 'EUW1':
                response = 'europe';
                break;
            case 'JP1':
            case 'KR':
            case 'RU':
            case 'PH2':
            case 'TR1':
            case 'TH2':
            case 'SG2':
            case 'TW2':
            case 'VN2':
                response = 'asia';
                break;
            case 'OC1':
                response = 'SEA';
                break;
            default:
                response = null;
                break;
        }
        return response;
    }

}
