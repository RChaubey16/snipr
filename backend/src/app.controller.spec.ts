import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            checkHealth: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('health', () => {
    it('should return health status when all checks pass', async () => {
      const healthResult = {
        status: 'ok',
        uptime: 100,
        checks: {
          database: { status: 'up' },
          redis: { status: 'up' },
        },
      };
      (appService.checkHealth as jest.Mock).mockResolvedValue(healthResult);

      const result = await appController.checkHealth();
      expect(result).toEqual(healthResult);
    });

    it('should throw 503 when health is degraded', async () => {
      const healthResult = {
        status: 'degraded',
        uptime: 100,
        checks: {
          database: { status: 'down', error: 'connection refused' },
          redis: { status: 'up' },
        },
      };
      (appService.checkHealth as jest.Mock).mockResolvedValue(healthResult);

      await expect(appController.checkHealth()).rejects.toThrow();
    });
  });
});
