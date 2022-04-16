import { Test, TestingModule } from '@nestjs/testing';
import { TokenUtils } from './token.service';

describe('TokenService', () => {
  let service: TokenUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenUtils],
    }).compile();

    service = module.get<TokenUtils>(TokenUtils);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
