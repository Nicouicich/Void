import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class MatchEntity{

    @PrimaryColumn({ unique: true })
    matchId: string;

    @Column()
    gameDuration: number;

    @Column()
    championName: string;

    @Column()
    totalDamageDealt: number;

    @Column()
    totalMinionsKilled: number;

    @Column()
    visionScore: number;

    @Column()
    kills: number;

    @Column()
    assists: number;

    @Column()
    deaths: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    kda: number;

    @Column()
    win: boolean;

    @Column()
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
        queueId: number,
        kda: number,
        gameDuration: number) {

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
        this.kda = kda;
        this.gameDuration = gameDuration;
    }
}