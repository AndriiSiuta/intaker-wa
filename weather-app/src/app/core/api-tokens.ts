import {InjectionToken} from "@angular/core";
import {IAppConfig} from "./api-tokens.model";

export const WeatherApiConfig = new InjectionToken<IAppConfig>(
  'WEATHER_API_CONFIG',
);
