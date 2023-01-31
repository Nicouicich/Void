export class MatchEntity {
    matchId: string;
    championName: string;
    totalDamageDealt: number;
    totalMinionsKilled: number;
    visionScore: number;
    kills: number;
    assists: number;
    deaths: number;
    KDA: number;
    win: boolean;
    queueId: number;

    constructor(matchId: string,
        championName: string,
        totalDamageDealt: number,
        totalMinionsKilled: number,
        visionScore: number,
        assists: number,
        deaths: number,
        win: boolean,
        kills: number,
        queueId: number) {
        this.matchId = matchId;
        this.championName = championName;
        this.totalDamageDealt = totalDamageDealt;
        this.totalMinionsKilled = totalMinionsKilled;
        this.visionScore = visionScore;
        this.assists = assists;
        this.deaths = deaths;
        this.win = win;
        this.kills = kills;
        this.queueId = queueId;
        this.KDA = (kills + assists) / (deaths ? deaths : 1);
    }
}