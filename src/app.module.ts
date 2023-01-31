import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PlayerModule} from './Modules/player.module';
import {RecentMatchesModule} from './Modules/recent-matches.module';
import {HttpModule} from '@nestjs/axios';


@Module({
  imports: [PlayerModule, RecentMatchesModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
