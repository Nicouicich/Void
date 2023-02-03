import { Controller, Body, Get, Param, Res } from '@nestjs/common';

import { SummonerStatsDto } from './../Dto/summonerStats.dto';
import { SummonerStatsEntity } from 'src/Entities/summonerStats.entity';
import { ISummonerLeague } from './../interfaces/summonerLeagues.interface';
import { SummonerDto } from '../Dto/summoner.dto';
import { PlayerService } from 'src/Services/player.service';
import { RecentMatchesService } from 'src/Services/recent-matches.service';
import { getRegionName } from 'src/utils/queueType';
import { isQueueIdCorrect } from 'src/utils/queueType';
import { getQueueName } from 'src/utils/queueType';


@Controller('player')
export class PlayerController {
  leagues = [420, 440, 430, 400, 450,];

  constructor(private PlayerService: PlayerService,
    private RecentMatchesService: RecentMatchesService,
  ) {}

  @Get()
  async getPlayer(@Body() summoner: SummonerDto) {
    //First I check if the user exists in my database
    let account = await this.PlayerService.getPlayerAccountDB(summoner.summonerName);
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
      return account;
    } else {
      //The user does not exists in my database, so I search for it in the lol api
      const accountPlayer = await this.PlayerService.getPlayerAccount(summoner.summonerName, summoner.region);
      if (accountPlayer) {
        const regionName = getRegionName(summoner.region);
        //create the new player and save it in the database
        let leagues: ISummonerLeague[] = await this.PlayerService.getPlayerStats(accountPlayer.id, summoner.region);

        const player = new SummonerStatsEntity(summoner.summonerName, accountPlayer.puuid, accountPlayer.id, accountPlayer.summonerLevel, summoner.region, accountPlayer.profileIconId, leagues);
        await this.PlayerService.createPlayerDB(player);

        //search for recent matches of the player created
        const recentMatches = await this.RecentMatchesService.getRecentMatches(accountPlayer.puuid, regionName, 20);

        //this is in case the user has not played any games yet
        recentMatches.length > 0 ? await this.getRecentMatchesInfo(recentMatches, summoner.region) : null;
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
        const summonerDto = new SummonerStatsDto(summoner.summonerName, summoner.region, accountPlayer.profileIconId, accountPlayer.summonerLevel, leagues);

        return summonerDto;
      } else {
        return {
          data: `Could not retrieve a player with summoner name: ${summoner.summonerName} and region: ${summoner.region}`,
          status_code: accountPlayer,
        };
      }
    }
  }


  @Get(':queueId')
  async getPlayerByQueueId(@Res() res, @Param('queueId') queueId: number, @Body() summoner: SummonerDto) {
    const regionName = getRegionName(summoner.region);
    let account = await this.PlayerService.getPlayerAccountDB(summoner.summonerName);
    let matches;

    if (!isQueueIdCorrect(queueId)) {
      res.status(400);
      res.send({
        data: `QueueID: ${queueId} is invalid`
      });
      return
    }

    if (!account) {
      await this.getPlayer(summoner);
      account = await this.PlayerService.getPlayerAccountDB(summoner.summonerName);
      matches = await this.RecentMatchesService.getRecentMatchesByQueueId(queueId, account.puuid, regionName);
    } else {
      matches = await this.RecentMatchesService.getPlayerMatchesDB(account.puuid, queueId);
    }

    if (matches.length === 0) {
      res.status(400);
      res.send({
        data: `Player has never played a game with the id:${queueId}`
      });

    }


    account.leagues = await this.getPlayerLeague(account.puuid, queueId, summoner.summonerName);

    return account;

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


  getPlayerLeague = async (puuid: string, queueId: number, summonerName: string): Promise<ISummonerLeague[]> => {

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
      const player = await this.PlayerService.getPlayerAccountDB(summonerName);

      const league = player.leagues.filter((element) => element.queueType == queueName);
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


}
