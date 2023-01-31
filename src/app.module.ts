import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './Modules/player.module';
import { RecentMatchesModule } from './Modules/recent-matches.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummonerStatsEntity } from './Entities/summonerStats.entity';
import { MatchEntity } from './Entities/match.entity';

@Module({
  imports: [PlayerModule, RecentMatchesModule, HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'nicolas',
      database: 'void',
      entities: [SummonerStatsEntity, MatchEntity],
      synchronize: true,
      retryDelay: 3000,
      retryAttempts: 10
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
