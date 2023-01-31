import {ApiProperty} from "@nestjs/swagger";

export class SummonerDto {
    @ApiProperty()
    summonerName: string;

    @ApiProperty()
    region: string;

    constructor(summonerName: string, region: string) {
        this.summonerName = summonerName;
        this.region = region;
    }
}