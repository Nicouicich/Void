import { Controller, Body, Get, Param } from '@nestjs/common';

import { RecentMatchesDto } from './../Dto/recent-matches.dto';
import { RecentMatchesService } from './../Services/recent-matches.service';
import { PlayerService } from 'src/Services/player.service';
import { logger } from 'src/config/winston';
import { getRegionName } from 'src/utils/queueType';
import { SummonerStatsEntity } from 'src/Entities/summonerStats.entity';
import { ISummonerLeague } from 'src/interfaces/summonerLeagues.interface';

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
        try {
            if (config.recentMatches <= this.RECENT_MATCHES_MAX) {
                let account = await this.PlayerService.getPlayerAccountDB(config.summonerName);
                let accountPlayer;
                //If the summoner i searched for does not exists, i create it
                if (!account) {
                    accountPlayer = await this.PlayerService.getPlayerAccount(
                        config.summonerName,
                        config.region,
                    );
                    const leagues: ISummonerLeague[] = await this.PlayerService.getPlayerStats(accountPlayer.id, config.region);
                    const player = new SummonerStatsEntity(config.summonerName, accountPlayer.puuid, accountPlayer.id, accountPlayer.summonerLevel, config.region, accountPlayer.profileIconId, leagues);
                    await this.PlayerService.createPlayerDB(player);
                } else {
                    accountPlayer = account;
                }
                if (accountPlayer) {
                    const regionName = getRegionName(config.region);
                    if (regionName) {
                        const recentMatches = await this.RecentMatchesService.getRecentMatches(
                            accountPlayer.puuid,
                            regionName,
                            config.recentMatches,
                        );
                        const data = await this.getRecentMatchesInfo(recentMatches, config.region);
                        status_code = 200;
                        return data;
                    } else {
                        message = `Region: ${config.region} unavailable`;
                        status_code = 404;
                    }
                } else {
                    message = `Could not retrieve matches from the summoner name: ${config.summonerName} and region: ${config.region}`;
                    logger.error(message);
                    status_code = accountPlayer;
                }
            } else {
                message = `Recent matches can't be more than 100`;
                status_code = 400;
            }
            return {
                data: message,
                status_code: status_code,
            };
        } catch (e) {
            logger.error(e);
            return {
                data: e,
            };
        }

    }

    @Get(':queueId')
    async getMatchesByQueueId(@Param() params, @Body() config: RecentMatchesDto) {
        let message: string;
        let status_code: number;
        try {
            if (config.recentMatches <= this.RECENT_MATCHES_MAX) {
                const accountPlayer = await this.PlayerService.getPlayerAccount(
                    config.summonerName,
                    config.region,
                );
                if (accountPlayer) {
                    const regionName = getRegionName(config.region);
                    if (regionName) {
                        const recentMatches = await this.RecentMatchesService.getRecentMatchesByQueueId(
                            params.queueId,
                            accountPlayer.puuid,
                            regionName,
                            config.recentMatches,
                        );
                        const data = await this.getRecentMatchesInfo(recentMatches, config.region);
                        status_code = 200;
                        return data;

                    } else {
                        message = `Region: ${config.region} unavailable`;
                        status_code = 404;
                    }
                } else {
                    message = `Could not retrieve matches from the summoner name: ${config.summonerName} and region: ${config.region}`;
                    logger.error(message);
                    status_code = accountPlayer.idD;
                }
            } else {
                message = `Recent matches can't be more than 100`;
                status_code = 400;
            }
            return {
                data: message,
                status_code: status_code,
            };
        } catch (e) {
            logger.error(e);
            return {
                data: e,
            };
        }

    }

    private async getRecentMatchesInfo(recentMatches: string[], region: string) {
        const regionName = getRegionName(region);
        let matchesInfo = recentMatches.map(async (matchID: string) => {
            return await this.RecentMatchesService.getInfoAboutAMatch(matchID, regionName);
        });
        const matches = await Promise.all(matchesInfo).then(data => {
            return data;
        });

        // Save the matches in the DB
        const data = matches.map(async (match: any) => {
            return await this.RecentMatchesService.createMatch(match);
        });

        return await Promise.all(data).then(data => {
            return data;
        });

    }


}

