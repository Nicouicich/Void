import { Controller, Body, Get, Param, Query, Res } from '@nestjs/common';

import { RecentMatchesDto } from './../Dto/recent-matches.dto';
import { RecentMatchesService } from './../Services/recent-matches.service';
import { PlayerService } from 'src/Services/player.service';
import { logger } from 'src/config/winston';
import { getRegionName, isQueueIdCorrect } from 'src/utils/queueType';
import { SummonerStatsEntity } from 'src/Entities/summonerStats.entity';
import { ISummonerLeague } from 'src/interfaces/summonerLeagues.interface';

@Controller('recent-matches')
export class RecentMatchesController {

    constructor(

        private RecentMatchesService: RecentMatchesService,
        private PlayerService: PlayerService,
    ) {}

    @Get()
    async getRecentMatches(@Query('page') page = 1,
        @Query('pageSize') pageSize = 10,
        @Res() res,
        @Body() config: RecentMatchesDto) {
        let message: string;
        try {
            let account = await this.PlayerService.getPlayerAccountDB(config.summonerName, config.region);
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

                    const skip = (page - 1) * pageSize;
                    const matches = await this.RecentMatchesService.findAllMatches(accountPlayer.puuid, 0, skip, pageSize);
                    const total = await this.RecentMatchesService.countDB(accountPlayer.puuid, 0);
                    const totalPages = Math.ceil(total / pageSize);
                    res.status(200);
                    res.send({
                        meta: {
                            page,
                            pageSize,
                            total,
                            links: {
                                first: `/recent-matches?page=1&pageSize=${pageSize}`,
                                last: `/recent-matches?page=${totalPages}&pageSize=${pageSize}`,
                                prev: `/recent-matches?page=${page - 1}&pageSize=${pageSize}`,
                                next: `/recent-matches?page=${page + 1}&pageSize=${pageSize}`,
                            },
                        },
                        data: matches
                    });

                    return data;
                } else {
                    message = `Region: ${config.region} unavailable`;
                    res.status(404);
                }
            } else {
                message = `Could not retrieve matches from the summoner name: ${config.summonerName} and region: ${config.region}`;
                logger.error(message);
                res.status(accountPlayer);
            }
            return {
                data: message
            };
        } catch (e) {
            logger.error(e);
            return {
                data: e
            };
        }

    }

    @Get(':queueId')
    async getMatchesByQueueId(
        @Query('page') page = 1,
        @Query('pageSize') pageSize = 10,
        @Res() res,
        @Param('queueId') queueId, @Body() config: RecentMatchesDto) {
        let message: string;
        let status_code: number;
        try {

            if (!isQueueIdCorrect(queueId)) {
                res.status(400);
                res.send({
                    data: `QueueID: ${queueId} is invalid`
                });
                return;
            }
            let accountPlayer = await this.PlayerService.getPlayerAccountDB(
                config.summonerName,
                config.region,
            );
            const regionName = getRegionName(config.region);
            if (!accountPlayer) {
                accountPlayer = await this.PlayerService.getPlayerAccount(config.summonerName, config.region);
            }
            if (!accountPlayer) {
                message = `User with summoner name: ${config.summonerName} and region: ${config.region} does not exists`;
                status_code = 404;
            } else {
                if (regionName) {
                    const skip = (page - 1) * pageSize;
                    const total = await this.RecentMatchesService.countDB(accountPlayer.puuid, queueId);
                    const totalPages = Math.ceil(total / pageSize);
                    const matches = await this.RecentMatchesService.findAllMatches(accountPlayer.puuid, queueId, skip, pageSize);
                    if (matches.length == 0) {

                        res.status(200).send({
                            data: `No recent matches played with queueId: ${queueId}`
                        });
                        // const recentMatches = await this.RecentMatchesService.getRecentMatchesByQueueId(
                        //     queueId,
                        //     accountPlayer.puuid,
                        //     regionName,
                        //     config.recentMatches,
                        // );
                        // await this.getRecentMatchesInfo(recentMatches, config.region);
                    } else {

                        res.status(200).send({
                            meta: {
                                page,
                                pageSize,
                                total,
                                links: {
                                    first: `/recent-matches?page=1&pageSize=${pageSize}`,
                                    last: `/recent-matches?page=${totalPages}&pageSize=${pageSize}`,
                                    prev: `/recent-matches?page=${page - 1}&pageSize=${pageSize}`,
                                    next: `/recent-matches?page=${page + 1}&pageSize=${pageSize}`,
                                },
                            },
                            data: matches
                        });
                    }
                } else {
                    message = `Region: ${config.region} does not exists`;
                    status_code = 400;
                }
            }
            res.status(status_code).send(
                {
                    data: message,
                }
            );
            return;
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
