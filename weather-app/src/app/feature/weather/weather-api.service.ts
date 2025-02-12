import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {WeatherApiConfig} from "@core/api-tokens";
import {Observable} from "rxjs";
import {ForecastResponse, WeatherResponse} from "@app/feature/weather/weather.entities";

@Injectable()

export class WeatherApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(WeatherApiConfig);

  getWeather(city: string): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(`${this.config.weatherApiUrl}?q=${city}&appid=${this.config.weatherApiKey}&units=metric`);
  }

  getForecast(city: string): Observable<ForecastResponse> {
    return this.http.get<ForecastResponse>(`${this.config.forecastApiUrl}?q=${city}&appid=${this.config.weatherApiKey}&units=metric`);
  }
}
