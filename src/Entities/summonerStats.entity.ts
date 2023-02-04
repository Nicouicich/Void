import { Entity, Column, PrimaryColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { ISummonerLeague } from './../interfaces/summonerLeagues.interface';
import { SummonerLeagueDto } from "../Dto/summonerLeague.dto";

@Entity()
export class SummonerStatsEntity {

  @ApiProperty()
  @PrimaryColumn({ unique: true })
  id: string;

  @ApiProperty()
  @Column()
  summonerName: string;

  @ApiProperty()
  @Column()
  puuid: string;

  @ApiProperty()
  @Column()
  profileIconId: number;

  @ApiProperty()
  @Column()
  summonerLevel: number;

  @ApiProperty({type:[SummonerLeagueDto]})
  @Column("jsonb")
  leagues: ISummonerLeague[];

  @ApiProperty()
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
