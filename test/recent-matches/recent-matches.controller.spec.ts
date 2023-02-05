import { HttpModule } from '@nestjs/axios';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { MatchEntity } from '../../src/Entities/match.entity';
import { SummonerStatsEntity } from '../../src/Entities/summonerStats.entity';
import { PlayerService } from '../../src/Services/player.service';
import { RecentMatchesService } from '../../src/Services/recent-matches.service';
import { databaseProvider } from '../../src/utils/database.provider';
import { RecentMatchesController } from '../../src/Controllers/recent-matches.controller';

describe('RecentMatchesController', () => {
  let controller: RecentMatchesController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecentMatchesController],
      imports: [HttpModule],
      providers: [
        PlayerService,
        RecentMatchesService,
        databaseProvider,
        {
          provide: 'SUMMONER_STATS_REPOSITORY',
          useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(SummonerStatsEntity),
          inject: ['DATA_SOURCE'],
        },
        {
          provide: 'RECENT_MATCH_REPOSITORY',
          useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(MatchEntity),
          inject: ['DATA_SOURCE'],
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<RecentMatchesController>(RecentMatchesController);
  });

  jest.setTimeout(20000);
  it('/recent-matches (GET). Should return 200 with the summoner name ET Murtgraf', () => {
    return request(app.getHttpServer())
      .get('/recent-matches')
      .send({ summonerName: 'ET Murtgraf', region: 'la2' })
      .expect(200)
      .then((response) => {
        const matchData = response.body.data;
        let foundMatch = false;
        matchData.forEach((match) => {
          const participants = match.participants;
          participants.forEach((participant) => {
            if (participant.summonerName === 'ET Murtgraf') {
              foundMatch = true;
            }
          });
        });
        expect(foundMatch).toBe(true);
      });
  });

  it('/recent-matches (GET). Should return 404 because the player does not exists', () => {
    return request(app.getHttpServer())
      .get('/recent-matches')
      .send({ summonerName: 'ET Murtgraf', region: 'br' })
      .expect(404)
      .expect({
        data: 'Summoner with name: ET Murtgraf and region: br does not exists',
      });
  });

  it('/recent-matches (GET). Should return 200 with the summoner name ET Murtgraf. Now im specifying the page and pagesize', () => {
    return request(app.getHttpServer())
      .get('/recent-matches?page=1&pageSize=10')
      .send({ summonerName: 'ET Murtgraf', region: 'la2' })
      .expect(200)
      .then((response) => {
        const matchData = response.body.data;
        let foundMatch = false;
        matchData.forEach((match) => {
          const participants = match.participants;
          participants.forEach((participant) => {
            if (participant.summonerName === 'ET Murtgraf') {
              foundMatch = true;
            }
          });
        });
        expect(foundMatch).toBe(true);
      });
  });

  it('/recent-matches (GET). Should return 404 because page is wrong', () => {
    return request(app.getHttpServer())
      .get('/recent-matches?page=0')
      .send({ summonerName: 'ET Murtgraf', region: 'la2' })
      .expect(400)
      .expect({
        data: 'Page and pagesize needs to be higher than 1',
      });
  });

  it('/recent-matches (GET). Should return 400 because pagesize is wrong', () => {
    return request(app.getHttpServer())
      .get('/recent-matches?pageSize=0')
      .send({ summonerName: 'ET Murtgraf', region: 'la2' })
      .expect(400)
      .expect({
        data: 'Page and pagesize needs to be higher than 1',
      });
  });

  it('/recent-matches (GET). Should return 404 because page is wrong', () => {
    return request(app.getHttpServer())
      .get('/recent-matches/420?page=0')
      .send({ summonerName: 'ET Murtgraf', region: 'la2' })
      .expect(400)
      .expect({
        data: 'Page and pagesize needs to be higher than 1',
      });
  });

  it('/recent-matches (GET). Should return 400 because pagesize is wrong', () => {
    return request(app.getHttpServer())
      .get('/recent-matches/420?pageSize=0')
      .send({ summonerName: 'ET Murtgraf', region: 'la2' })
      .expect(400)
      .expect({
        data: 'Page and pagesize needs to be higher than 1',
      });
  });

  it('/recent-matches (GET). Should return 400 because queueId is wrong', () => {
    return request(app.getHttpServer())
      .get('/recent-matches/41')
      .send({ summonerName: 'ET Murtgraf', region: 'la2' })
      .expect(400)
      .expect({
        data: 'QueueID: 41 is invalid',
      });
  });

  jest.setTimeout(20000);
  it('/recent-matches/420 (GET). Should return 200 with the summoner name ET Murtgraf', () => {
    return request(app.getHttpServer())
      .get('/recent-matches/420')
      .send({ summonerName: 'ET Murtgraf', region: 'la2' })
      .expect(200)
      .then((response) => {
        const matchData = response.body.data;
        let foundMatch = false;
        matchData.forEach((match) => {
          const participants = match.participants;
          participants.forEach((participant) => {
            if (participant.summonerName === 'ET Murtgraf') {
              foundMatch = true;
            }
          });
        });
        expect(foundMatch).toBe(true);
        expect(response.body).toEqual(
          expect.objectContaining({
            data: expect.arrayContaining([
              expect.objectContaining({
                queueId: 420,
              }),
            ]),
          }),
        );
      });
  });
});
