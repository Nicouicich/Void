import { ApiProperty } from "@nestjs/swagger";
export class SummonerLeagueDto {
    @ApiProperty()
    rank: string;

    @ApiProperty()
    tier: string;

    @ApiProperty()
    queueType: string;

    @ApiProperty()
    wins: number;

    @ApiProperty()
    losses: number;

    @ApiProperty()
    winrate: number;

    @ApiProperty()
    AverageCSPerMinute: number;

    @ApiProperty()
    AverageKDA: number;

    @ApiProperty()
    AverageVisionScore: number;
}