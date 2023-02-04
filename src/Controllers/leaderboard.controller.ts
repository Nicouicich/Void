import { StatsLeaderboard, LeaderboardDTO } from './../Dto/leaderboard.dto';
import { getQueueName } from 'src/utils/queueType';
import { Controller, Get, Param, Res } from '@nestjs/common';

import { PlayerService } from 'src/Services/player.service';
import { logger } from 'src/config/winston';
import { getTierValue, getRankValue } from 'src/utils/tiers';


@Controller('leaderboard')
export class LeaderboardController {

    constructor(
        private PlayerService: PlayerService
    ) {}

    @Get(':queueId')
    async getnames(@Res() res, @Param('queueId') queueId) {
        try {
            logger.log('info', `New call at the endpoint leaderboard/${queueId}`);
            let queueName;
            if (queueId != 420 && queueId != 440) {
                res.status(400).send({
                    data: `ID: ${queueId} invalid`
                });
                return;
            } else {
                queueName = getQueueName(queueId);
            }

            let players = await this.PlayerService.getPlayersWithLeagueDB();

            let playersWinrate = players.map((player) => {
                player.leagues = player.leagues.filter((league) => league.queueType == queueName);
                return player;
            });
            playersWinrate = players.sort((a, b) => {
                return b.leagues[0].winrate - a.leagues[0].winrate;
            });

            const leaderboard = new LeaderboardDTO([]);

            playersWinrate.map((player, index) => {
                const stats = new StatsLeaderboard(player.summonerName, 0, index + 1, player.region);
                leaderboard.leaderboard.push(stats);
            });

            const playersRank = players.sort((a, b) => {
                const tierA = getTierValue(a.leagues[0].tier);
                const tierB = getTierValue(b.leagues[0].tier);
                if (tierA !== tierB) {
                    return tierB - tierA;
                } else {
                    const rankA = getRankValue(a.leagues[0].rank);
                    const rankB = getRankValue(b.leagues[0].rank);
                    return rankB - rankA;
                }
            });

            playersRank.forEach((player, index) => {
                leaderboard.leaderboard.forEach((summoner) => {
                    if (summoner.summonerName === player.summonerName) {
                        summoner.stats.leaguePoints.top = index + 1;
                    }
                });
            });
            res.status(200).send(leaderboard);
        }
        catch (e) {
            res.status(500).send(e);
        }
    }

}
