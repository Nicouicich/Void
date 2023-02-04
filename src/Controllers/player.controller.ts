import { Controller, Body, Get, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiProduces, ApiTags } from '@nestjs/swagger';

import { SummonerStatsDto } from './../Dto/summonerStats.dto';
import { SummonerStatsEntity } from '../Entities/summonerStats.entity';
import { ISummonerLeague } from './../interfaces/summonerLeagues.interface';
import { SummonerDto } from '../Dto/summoner.dto';
import { PlayerService } from '../Services/player.service';
import { RecentMatchesService } from '../Services/recent-matches.service';
import { getRegionName } from '../utils/queueType';
import { isQueueIdCorrect } from '../utils/queueType';
import { getQueueName } from '../utils/queueType';
import { logger } from '../config/winston';


@ApiTags('Players')
@Controller('player')
export class PlayerController {
  // leagues = [420, 440, 430, 400, 450, 900];

  constructor(private PlayerService: PlayerService,
    private RecentMatchesService: RecentMatchesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get the stats for a user.' })
  @ApiResponse({ status: 200, description: 'Get user stats', type: SummonerStatsEntity })
  @ApiResponse({ status: 400, description: 'For example: Player:ET Murtgrafa or region: la4' })
  @ApiBody({ type: SummonerDto })
  @ApiProduces('application/json')

  async getPlayer(@Res() res,
    @Body() summoner: SummonerDto) {
    try {
      logger.log('info', `New call at the endpoint /player/ with body:${summoner}`);
      let account = await this.PlayerService.getPlayerAccountDB(summoner.summonerName, summoner.region);
      if (account) {
        const leagues = await Promise.all(
          account.leagues.map(async (league) => {
            league.AverageVisionScore = await this.RecentMatchesService.getPlayerVisionScoreDB(account.puuid, league.queueType);
            league.AverageCSPerMinute = await this.RecentMatchesService.getPlayerCSPerMinuteDB(account.puuid, league.queueType);
            league.AverageKDA = await this.RecentMatchesService.getPlayerKDADB(account.puuid, league.queueType);
            return league;
          })
        ).then(data => {
          return data;
        });
        account.leagues = leagues;
        res.status(200).send({
          data: account
        });
      } else {
        const accountPlayer = await this.createPlayer(summoner.summonerName, summoner.region);
        if (accountPlayer) {

          const summonerDto = new SummonerStatsDto(summoner.summonerName, summoner.region, accountPlayer.profileIconId, accountPlayer.summonerLevel, accountPlayer.leagues);
          res.status(200).send(summonerDto);
        } else {
          res.status(404).send({
            data: `Summoner name: ${summoner.summonerName} and region: ${summoner.region} does not exists`,
          });
          return;
        }
      }
    } catch (e) {
      res.status(500).send(e);
    }

  }

  @Get(':queueId')
  @ApiOperation({ summary: 'Get player stats filtered by queueId.' })
  @ApiResponse({ status: 200, description: 'Recent matches from the player filtered by queueId', type: SummonerStatsEntity })
  @ApiResponse({ status: 400, description: 'queueId!= 420, queueId != 440, non-existent region or non-existent user' })
  @ApiQuery({ name: 'queueId', description: "Higher than 1" })
  @ApiProduces('application/json')
  async getPlayerByQueueId(@Res() res, @Param('queueId') queueId: number, @Body() summoner: SummonerDto) {
    try {
      logger.log('info', `New call at the endpoint /player/:queueId with params:
      ${queueId},
      and body: ${summoner}`);
      let matches;

      if (!isQueueIdCorrect(queueId)) {
        res.status(400);
        res.send({
          data: `QueueID: ${queueId} is invalid`
        });
        return;
      }
      let account = await this.PlayerService.getPlayerAccountDB(summoner.summonerName, summoner.region);

      if (!account) {
        account = await this.createPlayer(summoner.summonerName, summoner.region);
        if (!account) {
          res.status(404).send({
            data: `User with name ${summoner.summonerName} and region ${summoner.region} does not exists`
          });
        }
      }
      matches = await this.RecentMatchesService.getPlayerMatchesDB(account.puuid, queueId);

      if (queueId!= 420 && queueId!= 440 && matches.length === 0) {
        res.status(400);
        res.send({
          data: `Player does not have any recent game with the id:${queueId}`
        });
        return;
      }
      account.leagues = await this.getPlayerLeague(account.puuid, queueId, summoner.summonerName, summoner.region);
      res.status(200).send(
        { data: account });
    } catch (e) {
      res.status(500).send(e);

    }

  }

  private getPlayerLeague = async (puuid: string, queueId: number, summonerName: string, region: string): Promise<ISummonerLeague[]> => {

    const matches = await this.RecentMatchesService.getPlayerMatchesDB(puuid, queueId);
    const queueName = getQueueName(queueId);
    let summonerLeagues: ISummonerLeague = {
      rank: "Not ranked",
      tier: "Not ranked",
      queueType: "all",
      wins: 0,
      losses: 0,
      winrate: 0,
      AverageCSPerMinute: 0,
      AverageKDA: 0,
      AverageVisionScore: 0

    };
    if (queueId == 420 || queueId == 440) {
      const player = await this.PlayerService.getPlayerAccountDB(summonerName, region);

      const league = player.leagues.filter((element) => element.queueType == queueName);
      console.log(league)
      if (league.length == 0 || matches.length == 0) {
        return league;
      }

      summonerLeagues.rank = league[0].rank;
      summonerLeagues.tier = league[0].tier;

    }

    matches.forEach((match) => {
      const data = match.participants.filter((participant) => participant.puuid == puuid);
      if (data[0].win) {
        summonerLeagues.wins += 1;
      } else {
        summonerLeagues.losses += 1;
      }
      summonerLeagues.AverageCSPerMinute += data[0].csPerMinute;
      summonerLeagues.AverageKDA += data[0].kda;
      summonerLeagues.AverageVisionScore += data[0].visionScore;
    });

    summonerLeagues.AverageCSPerMinute /= matches.length;
    summonerLeagues.AverageKDA = Math.trunc(summonerLeagues.AverageKDA / matches.length);
    summonerLeagues.AverageVisionScore = Math.trunc(summonerLeagues.AverageVisionScore / matches.length);
    summonerLeagues.winrate = (summonerLeagues.wins / (summonerLeagues.wins + summonerLeagues.losses) * 100);
    summonerLeagues.queueType = queueName;
    return [summonerLeagues];
  };

  private getRecentMatchesInfo = async (recentMatches: string[], region: string) => {
    try {
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
    catch (e) {
      return (e);
    }


  };

  private createPlayer = async (summonerName: string, region: string,) => {
    try {
      const accountPlayer = await this.PlayerService.getPlayerAccount(summonerName, region);
      if (accountPlayer) {
        const regionName = getRegionName(region);
        let leagues: ISummonerLeague[] = await this.PlayerService.getPlayerStats(accountPlayer.id, region);

        const player = new SummonerStatsEntity(summonerName, accountPlayer.puuid, accountPlayer.id, accountPlayer.summonerLevel, region, accountPlayer.profileIconId, leagues);
        await this.PlayerService.createPlayerDB(player);

        const recentMatches = await this.RecentMatchesService.getRecentMatches(accountPlayer.puuid, regionName, 20);

        recentMatches.length > 0 ? await this.getRecentMatchesInfo(recentMatches, region) : null;
        if (leagues.length) {
          leagues = await Promise.all(
            leagues.map(async (league) => {
              league.AverageVisionScore = await this.RecentMatchesService.getPlayerVisionScoreDB(accountPlayer.puuid, league.queueType);
              league.AverageCSPerMinute = await this.RecentMatchesService.getPlayerCSPerMinuteDB(accountPlayer.puuid, league.queueType);
              league.AverageKDA = await this.RecentMatchesService.getPlayerKDADB(accountPlayer.puuid, league.queueType);
              return league;
            })
          ).then(data => {
            return data;
          });
        }
        accountPlayer.leagues = leagues;
        return accountPlayer;

      }
    } catch (e) {
      return null;
    }
    return false;
  };
};


