import { ApiProperty } from "@nestjs/swagger";

export class MatchParticipantDto {
    @ApiProperty()
    puuid: string;
    
    @ApiProperty()
    summonerName:string;
    
    @ApiProperty()
    championName: string;
    
    @ApiProperty()
    totalDamageDealt: number;
    
    @ApiProperty()
    totalMinionsKilled: number;
    
    @ApiProperty()
    csPerMinute: number;


    @ApiProperty()
    visionScore: number;

    @ApiProperty()
    kills: number;

    @ApiProperty()
    assists: number;

    @ApiProperty()
    deaths: number;

    @ApiProperty()
    kda: number;

    @ApiProperty()
    win: boolean;

};