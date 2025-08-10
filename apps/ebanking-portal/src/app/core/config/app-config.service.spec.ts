import { HttpClient } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { fakeService, injectService } from '@scb/util/testing';
import { AppConfigService } from './app-config.service';

const httpClientMock = fakeService(HttpClient, {
  get: () => of({ name: 'scb' } as any),
});

describe('Config Service', () => {
  let service: AppConfigService;

  beforeEach(() => {
    service = injectService(AppConfigService, [httpClientMock]);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should load config by calling loadConfig', async () => {
    await firstValueFrom(service.loadConfig());
    expect(service.config).toEqual({ name: 'scb' });
  });
});
