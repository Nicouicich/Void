import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class SummonerStatsEntity {

  @PrimaryColumn({ unique: true })
  summonerName: string;

  @Column()
  summonerLevel: number;

  @Column()
  queueType: string;

  @Column()
  region: string;

  @Column()
  rank: string;

  @Column()
  wins: number;

  @Column()
  losses: number;

  @Column()
  winrate: number;

  @Column()
  CSPerMinute: number;

  @Column()
  KDA: number;

  constructor(
    summonerName: string,
    summonerLevel: number,
    queueType: string,
    region: string,
    rank: string,
    wins: number,
    losses: number,
    winrate: number,
    CSPerMinute: number,
    KDA: number,
  ) {
    this.summonerName = summonerName;
    this.summonerLevel = summonerLevel;
    this.queueType = queueType;
    this.region = region;
    this.rank = rank;
    this.wins = wins;
    this.losses = losses;
    this.winrate = winrate;
    this.CSPerMinute = CSPerMinute;
    this.KDA = KDA;
  }
}
