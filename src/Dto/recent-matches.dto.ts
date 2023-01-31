import { ApiProperty } from '@nestjs/swagger';

export class RecentMatchesDto {
  @ApiProperty()
  summonerName: string;

  @ApiProperty()
  region: string = 'americas' || 'asia' || 'europe' || 'sea';

  @ApiProperty()
  recentMatches: number;

  @ApiProperty()
  size: string;

  @ApiProperty()
  limit: string;

  constructor(
    summonerName: string,
    region: string,
    recentMatches: number,
    size: string,
    limit: string,
  ) {
    this.summonerName = summonerName;
    this.region = region;
    this.recentMatches = recentMatches;
    this.size = size;
    this.limit = limit;
  }
}
