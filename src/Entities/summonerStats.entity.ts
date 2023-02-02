import { Entity, Column, PrimaryColumn } from "typeorm";
import { ISummonerLeague } from './../interfaces/summonerLeagues.interface';

@Entity()
export class SummonerStatsEntity {

  @PrimaryColumn({ unique: true })
  summonerName: string;

  @Column()
  puuid: string;

  @Column()
  id: string;

  @Column()
  profileIconId: number;

  @Column()
  summonerLevel: number;

  @Column("jsonb")
  leagues: ISummonerLeague[];

  @Column()
  region: string;

  constructor(
    summonerName: string,
    puuid: string,
    id: string,
    summonerLevel: number,
    region: string,
    profileIconId: number,
    leagues: ISummonerLeague[]
  ) {
    this.summonerName = summonerName;
    this.summonerLevel = summonerLevel;
    this.region = region;
    this.puuid = puuid;
    this.id = id;
    this.profileIconId = profileIconId;
    this.leagues = leagues;
  }
}
