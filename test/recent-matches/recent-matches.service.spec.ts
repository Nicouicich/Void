import {Test, TestingModule} from '@nestjs/testing';
import {RecentMatchesService} from '../../src/Services/recent-matches.service';

describe('RecentMatchesService', () => {
  let service: RecentMatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecentMatchesService],
    }).compile();

    service = module.get<RecentMatchesService>(RecentMatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
