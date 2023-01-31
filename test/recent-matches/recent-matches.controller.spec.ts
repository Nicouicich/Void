import {Test, TestingModule} from '@nestjs/testing';
import {RecentMatchesController} from '../../src/Controllers/recent-matches.controller';

describe('RecentMatchesController', () => {
  let controller: RecentMatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecentMatchesController],
    }).compile();

    controller = module.get<RecentMatchesController>(RecentMatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
