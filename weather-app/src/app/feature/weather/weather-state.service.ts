import { Injectable, inject, signal } from "@angular/core";
import { WeatherApiService } from "@app/feature/weather/weather-api.service";
import { WeatherCacheService } from "./weather-cache.service";
import { catchError, combineLatest, finalize, tap, of } from "rxjs";
import { ForecastResponse, WeatherResponse } from "@app/feature/weather/weather.entities";

@Injectable()
export class WeatherStateService {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly weather = signal<WeatherResponse | null>(null);
  readonly forecast = signal<ForecastResponse | null>(null);
  readonly favoriteWeather = signal<Record<string, WeatherResponse>>({});

  private readonly weatherApi = inject(WeatherApiService);
  private readonly cacheService = inject(WeatherCacheService);

  constructor() {
    this.loadFavoriteWeather();
  }

  private loadFavoriteWeather() {
    this.cacheService.favoriteCities().forEach(city => {
      const cachedData = this.cacheService.getCachedWeather(city);
      if (cachedData) {
        this.favoriteWeather.set({ ...this.favoriteWeather(), [city]: cachedData.weather });
      }
    });
  }

  loadWeather(city: string) {
    this.loading.set(true);
    this.error.set(null);

    const cachedData = this.cacheService.getCachedWeather(city);
    if (cachedData) {
      this.weather.set(cachedData.weather);
      this.forecast.set(cachedData.forecast);
      this.favoriteWeather.set({ ...this.favoriteWeather(), [city]: cachedData.weather });
      this.loading.set(false);
      return of(cachedData);
    }

    return combineLatest([
      this.weatherApi.getForecast(city),
      this.weatherApi.getWeather(city)
    ]).pipe(
      tap(([forecast, weather]) => {
        this.forecast.set(forecast);
        this.weather.set(weather);
        this.cacheService.setCachedWeather(city, weather, forecast);
        this.favoriteWeather.set({ ...this.favoriteWeather(), [city]: weather });
      }),
      catchError(error => {
        this.error.set(error.error?.message || "An error occurred");
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }
}
