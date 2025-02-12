import { inject, Injectable, signal } from "@angular/core";
import { WeatherApiService } from "@app/feature/weather/weather-api.service";
import { catchError, combineLatest, finalize, tap, of } from "rxjs";
import { ForecastResponse, WeatherResponse } from "@app/feature/weather/weather.entities";

@Injectable()
export class WeatherStateService {
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
  private readonly CACHE_KEY = "weather_cache";
  private readonly FAVORITES_KEY = "favorite_cities";

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly weather = signal<WeatherResponse | null>(null);
  readonly forecast = signal<ForecastResponse | null>(null);
  readonly favoriteCities = signal<string[]>(this.loadFavoriteCities());
  readonly favoriteWeather = signal<Record<string, WeatherResponse>>({});

  private readonly weatherApi = inject(WeatherApiService);
  private cache: Record<string, { timestamp: number; weather: WeatherResponse; forecast: ForecastResponse }> = {};

  constructor() {
    this.loadCache();
    this.loadFavoriteWeather();
  }

  private loadCache() {
    const cachedData = localStorage.getItem(this.CACHE_KEY);
    if (cachedData) {
      try {
        this.cache = JSON.parse(cachedData);
      } catch (e) {
        console.error("Failed to parse cache", e);
      }
    }
  }

  private saveCache() {
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(this.cache));
  }

  private loadFavoriteCities(): string[] {
    const storedFavorites = localStorage.getItem(this.FAVORITES_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  }

  private saveFavoriteCities() {
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(this.favoriteCities()));
  }

  addFavoriteCity(city: string) {
    if (!this.favoriteCities().includes(city)) {
      this.favoriteCities.set([...this.favoriteCities(), city]);
      this.saveFavoriteCities();
      this.loadWeather(city); // Fetch weather for the new favorite city
    }
  }

  removeFavoriteCity(city: string) {
    this.favoriteCities.set(this.favoriteCities().filter(c => c !== city));
    this.saveFavoriteCities();
    const updatedWeather = { ...this.favoriteWeather() };
    delete updatedWeather[city];
    this.favoriteWeather.set(updatedWeather);
  }

  private loadFavoriteWeather() {
    this.favoriteCities().forEach(city => this.loadWeather(city));
  }

  loadWeather(city: string) {
    this.loading.set(true);
    this.error.set(null);

    const now = Date.now();
    const cachedData = this.cache[city];

    if (cachedData && now - cachedData.timestamp < this.CACHE_DURATION) {
      // Use cached data
      this.weather.set(cachedData.weather);
      this.forecast.set(cachedData.forecast);
      this.favoriteWeather.set({ ...this.favoriteWeather(), [city]: cachedData.weather });
      this.loading.set(false);
      return of(cachedData);
    }

    // Fetch new data from API if cache is outdated or missing
    return combineLatest([
      this.weatherApi.getForecast(city),
      this.weatherApi.getWeather(city)
    ]).pipe(
      tap(([forecast, weather]) => {
        this.forecast.set(forecast);
        this.weather.set(weather);
        this.cache[city] = { timestamp: now, weather, forecast }; // Cache new data
        this.favoriteWeather.set({ ...this.favoriteWeather(), [city]: weather });
        this.saveCache();
      }),
      catchError(error => {
        const err = error.error;
        this.error.set(err.message);
        return [];
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }
}
