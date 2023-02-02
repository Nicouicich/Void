import { ISummonerLeague } from 'src/interfaces/summonerLeagues.interface';
import { ApiProperty } from '@nestjs/swagger';

export class SummonerStatsDto {
    @ApiProperty()
    summonerName: string;

    @ApiProperty()
    region: string;

    @ApiProperty()
    profileIconId: number;

    @ApiProperty()
    summonerLevel: number;

    @ApiProperty()
    leagues: ISummonerLeague[];

    constructor(
        summonerName: string,
        region: string,
        profileIconId: number,
        summonerLevel: number,
        leagues: ISummonerLeague[],
    ) {
        this.summonerName = summonerName;
        this.region = region;
        this.profileIconId = profileIconId;
        this.summonerLevel = summonerLevel;
        this.leagues = leagues;

    }
}