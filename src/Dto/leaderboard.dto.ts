import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardDTO {
    @ApiProperty()
    leaderboard: StatsLeaderboard[];

    constructor(stats: StatsLeaderboard[]) {
        this.leaderboard = stats;
    }
}

export class StatsLeaderboard {
    @ApiProperty()
    summonerName: string;

    @ApiProperty()
    region: string;

    @ApiProperty()
    stats: {
        leaguePoints: { top: number; },
        winRate: { top: number; },
    };
    constructor(summonerName: string, leaguePoints: number, winRate: number, region: string) {
        this.summonerName = summonerName;
        this.stats = {
            leaguePoints: { top: 0 },
            winRate: { top: 0 },
        };
        this.stats.leaguePoints.top = leaguePoints;
        this.stats.winRate.top = winRate;
        this.region = region;
    }
}