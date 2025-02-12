import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {WeatherApiConfig} from "./core/api-tokens";
import {API_CONFIG} from "./core/api-tokens.model";
import {provideHttpClient} from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), {
    provide: WeatherApiConfig,
    useValue: API_CONFIG
  },
  provideHttpClient(), provideAnimationsAsync()
  ],
};
