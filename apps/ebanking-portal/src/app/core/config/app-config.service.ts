import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';

interface AppConfig {
  apiUrl: string;
  featureFlag: boolean;
  siteKey: string;
  mapAPIKey: string;
  idle: number;
  timeout: number;
  keepalive: number;
}

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private http = inject(HttpClient);

  // Private property to hold the config
  private _config!: AppConfig;

  // Load config from an environment-specific JSON file
  loadConfig() {
    return this.http.get<AppConfig>(`config/config.json`).pipe(
      tap((config: AppConfig) => {
        this._config = config;
      }),
    );
  }

  get config(): AppConfig {
    return this._config;
  }
}
