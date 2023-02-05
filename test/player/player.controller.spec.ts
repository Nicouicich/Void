import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HttpModule, HttpService } from '@nestjs/axios';

import { PlayerService } from '../../src/Services/player.service';
import { PlayerController } from '../../src/Controllers/player.controller';
import { databaseTestProvider } from '../../src/utils/database.test.provider';
import { SummonerStatsEntity } from '../../src/Entities/summonerStats.entity';
import { RecentMatchesService } from '../../src/Services/recent-matches.service';
import { MatchEntity } from '../../src/Entities/match.entity';
import { firstValueFrom } from 'rxjs';

describe('PlayerController', () => {
  let controller: PlayerController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      imports: [HttpModule],
      providers: [
        PlayerService,
        RecentMatchesService,
        databaseTestProvider,
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
    controller = module.get<PlayerController>(PlayerController);
  });

  afterAll(async () => {
    await app.close();
  });

  async function pollingFunction(url, depth = 0) {
    // prevent infinite recursion
    expect(depth).toBeLessThan(15);
    const httpService = new HttpService();
    try {
      const res = await firstValueFrom(httpService.get(url));
      if (res.status === 200) {
        console.log('Services on');
      }
    } catch (error) {
      console.log('Services off');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return pollingFunction(url, depth + 1);
    }
  }

  describe('Polling function', () => {
    it('polls the specified URL and checks if the services are on', async () => {
      const spy = jest.spyOn(console, 'log');
      await pollingFunction('http://localhost:3000');
      expect(spy).toHaveBeenCalledWith('Services on');
      spy.mockRestore();
    });
  });

  jest.setTimeout(20000);
  it('/player (GET). Should return 200 with the summoner name ET Murtgraf', () => {
    return request(app.getHttpServer())
      .get('/player')
      .send({ summonerName: 'ET Murtgraf', region: 'la2' })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          data: expect.objectContaining({
            summonerName: 'ET Murtgraf',
          }),
        });
      });
  });

  jest.setTimeout(20000);
  it('/player/420 (GET). Should return 200 with the summoner name nicop373 and its leagues empty', () => {
    return request(app.getHttpServer())
      .get('/player')
      .send({ summonerName: 'nicop373', region: 'la2' })
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          data: expect.objectContaining({
            leagues: expect.arrayContaining([]),
          }),
        });
      });
  });

  jest.setTimeout(20000);
  it('/player/420 (GET). Should return 200 with the summoner name GIGACHAD PLAYER and its leagues with queueType:RANKED_SOLO_5x5', () => {
    return request(app.getHttpServer())
      .get('/player/420')
      .send({ summonerName: 'GIGACHAD PLAYER', region: 'br1' })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              leagues: expect.arrayContaining([
                expect.objectContaining({
                  queueType: 'RANKED_SOLO_5x5',
                }),
              ]),
            }),
          }),
        );
      });
  });

  jest.setTimeout(20000);
  it('/player/440 (GET). Should return 200 with the summoner name GIGACHAD PLAYER and its leagues with queueType:RANKED_FLEX_SR', () => {
    return request(app.getHttpServer())
      .get('/player/440')
      .send({ summonerName: 'GIGACHAD PLAYER', region: 'br1' })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              leagues: expect.arrayContaining([
                expect.objectContaining({
                  queueType: 'RANKED_FLEX_SR',
                }),
              ]),
            }),
          }),
        );
      });
  });

  it('/player (GET). Should return 404 because the player does not exists', () => {
    return request(app.getHttpServer())
      .get('/player')
      .send({ summonerName: 'ET Murtgraf', region: 'br' })
      .expect(404)
      .expect({
        data: `Summoner name: ET Murtgraf and region: br does not exists`,
      });
  });

  jest.setTimeout(20000);
  it('/player/4110 (GET). Should return 400 because queueId does not exists', () => {
    return request(app.getHttpServer())
      .get('/player/4110')
      .send({ summonerName: 'nicop373', region: 'la2' })
      .expect(400)
      .expect({
        data: `QueueID: 4110 is invalid`,
      });
  });
});
