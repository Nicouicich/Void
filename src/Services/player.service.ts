import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { enviromentVars } from 'src/config/config';
import { logger } from 'src/config/winston';
import { SummonerStatsEntity } from 'src/Entities/summonerStats.entity';
import { ISummonerLeague } from 'src/interfaces/summonerLeagues.interface';


@Injectable()
export class PlayerService {
    private STATUS_CORRECT = 200;

    constructor(private HttpService: HttpService,
        @Inject("SUMMONER_STATS_REPOSITORY") private playerRepo: Repository<SummonerStatsEntity>
    ) {
    }

    createPlayerDB(player: any): Promise<SummonerStatsEntity[]> {
        const newPlayer = this.playerRepo.create(player);
        const response = this.playerRepo.save(newPlayer);
        logger.log("info", `New user was created. Name ${player.summonerName}`);
        return response;
    }

    getPlayerAccountDB(name: string, region: string): Promise<SummonerStatsEntity> {
        const response = this.playerRepo.findOneBy({ summonerName: name, region: region });
        return response;
    }

    getPlayersWithLeagueDB = async () => {
        return await this.playerRepo
            .createQueryBuilder()
            .where(`leagues IS NOT NULL`)
            .andWhere(`leagues != '[]'`)
            .getMany();
    };

    


    public async getPlayerStats(summonerID: string, region: string) {
        try {
            const url = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=${enviromentVars.LOL_API_KEY}`;
            const response = await firstValueFrom(this.HttpService.get(url));
            const status = response.status;
            if (status === this.STATUS_CORRECT) {
                const summonerLeagues = response.data;
                if (summonerLeagues.length == 0) {
                    return [];
                } else {
                    const sumLeagues = summonerLeagues.map((league) => {
                        let winrate = 0;
                        if ((league.wins + league.losses) != 0) {
                            winrate = Math.trunc(league.wins / (league.wins + league.losses) * 100);
                        }
                        let summonerLeague: ISummonerLeague = {
                            tier: league.tier,
                            rank: league.rank,
                            queueType: league.queueType,
                            wins: league.wins,
                            losses: league.losses,
                            winrate: winrate,
                            AverageCSPerMinute: 0,
                            AverageKDA: 0,
                            AverageVisionScore: 0
                        };
                        return summonerLeague;
                    });

                    return sumLeagues;
                }
            }
        } catch (e) {
            const message = `Error while requesting a player status by Summoner ID. Status code: ${e.response.status}`;
            logger.error(message);
            return {
                message: message,
                status_code: e.response.status,
            };
        }
    }

    public async getPlayerAccount(summonerName: string, region: string) {
        try {
            const name = summonerName.replaceAll(' ', '%20');
            const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${enviromentVars.LOL_API_KEY}`;
            const response = await firstValueFrom(this.HttpService.get(url));
            return response.data;
        } catch (e) {
            logger.log('error', `Error while requesting an account player by name. Probably cause: ${e}
            Check API Key`);
            return null;
        }
    }
}
