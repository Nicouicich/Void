import {RecentMatchesDto} from './../Dto/recent-matches.dto';
import {RecentMatchesService} from './../Services/recent-matches.service';
import {Controller, Body, Get} from '@nestjs/common';
import {PlayerService} from 'src/Services/player.service';

@Controller('recent-matches')
export class RecentMatchesController {
    private RECENT_MATCHES_DEFAULT = 20;
    private RECENT_MATCHES_MAX = 100;

    constructor(private RecentMatchesService: RecentMatchesService, private PlayerService: PlayerService) {}

    @Get()
    async getRecentMatches(@Body() config: RecentMatchesDto) {
        const summonerPuuID = await this.PlayerService.getPlayerPuuIDByName(config.summonerName, config.region);
        if (typeof summonerPuuID === 'string') {
            const recentMatches = await this.RecentMatchesService.getRecentMatches(summonerPuuID, config.region, config.recentMatches);
            return recentMatches;
        } else {
            return {
                data: `Could not retrieve matches from the summoner name: ${config.summonerName} and region: ${config.region}`,
                status_code: summonerPuuID
            };
        }
    }

}
