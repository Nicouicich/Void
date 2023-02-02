export interface IMatchParticipant {
    puuid: string,
    summonerName:string,
    championName: string;
    totalDamageDealt: number;
    totalMinionsKilled: number;
    csPerMinute: number;
    visionScore: number;
    kills: number;
    assists: number;
    deaths: number;
    kda: number;
    win: boolean;

};