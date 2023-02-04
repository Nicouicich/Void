import { ApiProperty } from '@nestjs/swagger';

export class RecentMatchesDto {
  @ApiProperty({ example: "GIGACHAD PLAYER" })
  summonerName: string;

  @ApiProperty({
    enum: ['br1', 'eun1', 'euw1', 'jp1', 'kr', 'la1', 'la2', 'na1', 'oc1', 'ph2', 'ru', 'sg2', 'th2', 'tr1', 'tw2', 'vn2'], example: 'br1'
  })
  region: string;

  constructor(
    summonerName: string,
    region: string,
  ) {
    this.summonerName = summonerName;
    this.region = region;

  }
}

export class NewMatchesDto {
  @ApiProperty({ example: "GIGACHAD PLAYER" })
  summonerName: string;

  @ApiProperty({ enum: ['br1', 'eun1', 'euw1', 'jp1', 'kr', 'la1', 'la2', 'na1', 'oc1', 'ph2', 'ru', 'sg2', 'th2', 'tr1', 'tw2', 'vn2'] })
  region: string;

  @ApiProperty()
  recentMatches: number;


  constructor(
    summonerName: string,
    region: string,
    recentMatches: number,

  ) {
    this.summonerName = summonerName;
    this.region = region;
    this.recentMatches = recentMatches;

  }
}