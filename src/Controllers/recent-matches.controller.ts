import { RecentMatchesDto } from './../Dto/recent-matches.dto';
import { RecentMatchesService } from './../Services/recent-matches.service';
import { Controller, Body, Get } from '@nestjs/common';
import { PlayerService } from 'src/Services/player.service';
import { logger } from 'src/config/winston';
import { MatchEntity } from 'src/Entities/match.entity';

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
                const regionName = this.getRegionName(config.region);
                if (regionName) {
                    const recentMatches = await this.RecentMatchesService.getRecentMatches(
                        summonerPuuID,
                        regionName,
                        config.recentMatches,
                    );
                    const data = await this.getRecentMatchesInfo(recentMatches, config.region, summonerPuuID);
                    return data;
                    // status_code = 200;
                    // message = matchesInfo;
                } else {
                    message = `Region: ${config.region} unavailable`;
                    status_code = 404;
                }
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

    private async getRecentMatchesInfo(recentMatches: string[], region: string, summonerPuuID: string) {
        const regionName = this.getRegionName(region);
        let matchesInfo = recentMatches.map(async (matchID: string) => {
            return await this.RecentMatchesService.getInfoAboutAMatch(matchID, regionName, summonerPuuID);
        });
        matchesInfo = await Promise.all(matchesInfo).then(data => {
            return data;
        });

        // Save the matches in the DB
        const data = matchesInfo.map(async (matchInfo: any) => {
            return await this.RecentMatchesService.createMatch(matchInfo);
        });

        return await Promise.all(data).then(data => {
            return data;
        });

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

