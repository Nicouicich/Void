import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { enviromentVars } from 'src/config/config';
import { firstValueFrom } from 'rxjs';
import { logger } from 'src/config/winston';
import { Repository, Like } from 'typeorm';

import { MatchEntity } from 'src/Entities/match.entity';
import { IMatchParticipant } from '../interfaces/matchParticipant.interface';

@Injectable()
export class RecentMatchesService {

    leagues = [420, 440, 430, 400, 450,];

    constructor(private HttpService: HttpService,
        @Inject("RECENT_MATCH_REPOSITORY") private matchRepo: Repository<MatchEntity>
    ) {}

    createMatch(match: any) {
        const newMatch = this.matchRepo.create(match);
        return this.matchRepo.save(newMatch);
    }

    getPlayerKDADB = async (puuid: string, queue: string | number): Promise<number> => {

        const queueId = (typeof queue === 'string') ? this.getQueueId(queue) : queue;
        const matches = await this.getPlayerMatchesDB(puuid, queueId);


        let kda = 0;
        matches.forEach((match) => {
            match.participants.filter((summoner) => {
                if (summoner.puuid === puuid) {
                    kda += summoner.kda;
                }
            });
        });
        return matches.length ? Math.trunc(kda / matches.length) : 0;
    };

    getPlayerMatchesDB = async (puuid: string, queueId: number): Promise<MatchEntity[]> => {
        if (queueId == 0) {
            return await this.matchRepo.find({
                where: {
                    summonerids: Like(`%${puuid}%`)
                },
            });
        } else {
            return await this.matchRepo.find({
                where: {
                    summonerids: Like(`%${puuid}%`),
                    queueId: queueId
                },
            });
        }

    };

    getPlayerCSPerMinuteDB = async (puuid: string, queue: string | number): Promise<number> => {
        const queueId = (typeof queue === 'string') ? this.getQueueId(queue) : queue;
        const matches = await this.getPlayerMatchesDB(puuid, queueId);


        let averageCsPerMinute = 0;
        matches.forEach((match) => {
            match.participants.filter((summoner) => {
                if (summoner.puuid === puuid) {
                    averageCsPerMinute += summoner.csPerMinute;
                }
            });
        });
        return matches.length ? averageCsPerMinute / matches.length : 0;
    };

    getPlayerVisionScoreDB = async (puuid: string, queue: string | number): Promise<number> => {

        const queueId = (typeof queue === 'string') ? this.getQueueId(queue) : queue;
        const matches = await this.getPlayerMatchesDB(puuid, queueId);

        let VisionScore = 0;
        matches.forEach((match) => {
            match.participants.filter((summoner) => {
                if (summoner.puuid === puuid) {
                    VisionScore += summoner.visionScore;
                }
            });
        });
        return matches.length ? Math.trunc(VisionScore / matches.length) : 0;
    };

    findAllMatches = async (puuid: string, queueId: number, skip: number, take: number): Promise<MatchEntity[]> => {
        if (queueId == 0) {
            return await this.matchRepo.find({
                where: {
                    summonerids: Like(`%${puuid}%`)
                },
                skip: skip,
                take: take,
            });
        } else {
            return await this.matchRepo.find({
                where: {
                    summonerids: Like(`%${puuid}%`),
                    queueId: queueId
                },
                skip: skip,
                take: take,
            });
        }
    };

    countDB = async (puuid: string, queueId: number): Promise<number> => {
        if (queueId == 0) {
            return this.matchRepo.count({
                where: {
                    summonerids: Like(`%${puuid}%`)
                }
            });
        } else {
            return this.matchRepo.count({
                where: {
                    summonerids: Like(`%${puuid}%`),
                    queueId: queueId
                }
            });
        }
    };

    public getQueueId(name: string): number {
        let queueId: number;
        switch (name) {
            case 'RANKED_SOLO_5x5': queueId = 420;
                break;
            case 'RANKED_FLEX_SR': queueId = 440;
                break;
            case 'NORMAL_BLIND_PICK': queueId = 430;
                break;
            case 'NORMAL_DRAFT_PICK': queueId = 400;
                break;
            case 'ARAM': queueId = 450;
                break;
            case 'ALL': queueId = 0;
                break;
            default: queueId = -1;
        }
        return queueId;
    }

    public async getRecentMatches(
        puuid: string,
        region: string,
        recentMatches = 20
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

    public async getRecentMatchesByQueueId(queueId: number, puuid: string, region: string, recentMatches = 20) {
        try {
            region = region.toLowerCase();
            const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=${queueId}&start=0&count=${recentMatches}&api_key=${enviromentVars.LOL_API_KEY}`;
            const response = await firstValueFrom(this.HttpService.get(url));
            return response.data;
        }
        catch (e) {
            logger.error(
                `Error while requesting a recent matches filtered by queue from the player with PuuID: ${puuid}. 
                Status code: ${e.response.status}
                Message: ${e.response.message}
                `,
            );

            return {
                message: e.response.message,
                code: e.response.status.status_code
            };
        }
    }

    public async getInfoAboutAMatch(matchID: string, region: string): Promise<MatchEntity> {
        try {
            const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}?api_key=${enviromentVars.LOL_API_KEY}`;

            const response = await firstValueFrom(this.HttpService.get(url));
            if (response) {
                const gameDuration = response.data.info.gameDuration;
                const queueId = response.data.info.queueId;
                const participants: IMatchParticipant[] = response.data.info.participants.map(participantInfo => {
                    let kda = participantInfo.deaths ? Math.trunc((participantInfo.kills + participantInfo.assists) / participantInfo.deaths)
                        : participantInfo.kills + participantInfo.assists;
                    let participant: IMatchParticipant = {
                        puuid: participantInfo.puuid,
                        summonerName: participantInfo.summonerName,
                        championName: participantInfo.championName,
                        totalDamageDealt: participantInfo.totalDamageDealt,
                        totalMinionsKilled: participantInfo.totalMinionsKilled,
                        csPerMinute: participantInfo.totalMinionsKilled / (gameDuration / 60),
                        visionScore: participantInfo.visionScore,
                        kills: participantInfo.kills,
                        assists: participantInfo.assists,
                        deaths: participantInfo.deaths,
                        kda: kda,
                        win: participantInfo.win
                    };
                    return participant;
                });
                const match: MatchEntity = new MatchEntity(matchID, queueId, gameDuration, participants, response.data.metadata.participants);
                return match;
            };
        }

        catch (e) {
            logger.log('error', e);
        }
    }
}
