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
                const recentMatches = await this.RecentMatchesService.getRecentMatches(
                    summonerPuuID,
                    config.region,
                    config.recentMatches,
                );
                const data = await this.getRecentMatchesInfo(recentMatches, config.region, summonerPuuID);
                return data;
                // status_code = 200;
                // message = matchesInfo;

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
        let match: MatchEntity;
        let matchesInfo = recentMatches.map(async (matchID: string) => {
            return await this.RecentMatchesService.getInfoAboutAMatch(matchID, region, summonerPuuID);
        });
        matchesInfo = await Promise.all(matchesInfo).then(data => {
            return data;
        });


        let data = matchesInfo.map((matchInfo: any) => {
            match = new MatchEntity(
                matchInfo.matchId,
                matchInfo.championName,
                matchInfo.totalDamageDealt,
                matchInfo.totalMinionsKilled,
                matchInfo.visionScore,
                matchInfo.assists,
                matchInfo.deaths,
                matchInfo.win,
                matchInfo.kills,
                matchInfo.queueId
            );
            return match;
        });

        return data;
    }
}

