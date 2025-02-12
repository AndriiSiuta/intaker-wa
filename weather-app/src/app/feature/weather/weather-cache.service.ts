import {Injectable, signal} from "@angular/core";
import {ForecastResponse, WeatherResponse} from "@app/feature/weather/weather.entities";

@Injectable()
export class WeatherCacheService {
  private readonly CACHE_DURATION = 60 * 60 * 1000;
  private readonly CACHE_KEY = "weather_cache";
  private readonly FAVORITES_KEY = "favorite_cities";

  private cache: Record<string, { timestamp: number; weather: WeatherResponse; forecast: ForecastResponse }> = {};

  readonly favoriteCities = signal<string[]>(this.loadFavoriteCities());
  readonly favoriteWeather = signal<Record<string, WeatherResponse>>(this.loadFavoriteWeather());

  constructor() {
    this.loadCache();
  }

  private loadCache() {
    const cachedData = localStorage.getItem(this.CACHE_KEY);
    if (cachedData) {
      try {
        this.cache = JSON.parse(cachedData);
        this.favoriteWeather.set(this.loadFavoriteWeather());
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

  private loadFavoriteWeather(): Record<string, WeatherResponse> {
    const weatherData: Record<string, WeatherResponse> = {};
    this.favoriteCities().forEach(city => {
      const cachedData = this.getCachedWeather(city);
      if (cachedData) {
        weatherData[city] = cachedData.weather;
      }
    });
    return weatherData;
  }

  addFavoriteCity(city: string) {
    if (!this.favoriteCities().includes(city)) {
      this.favoriteCities.set([...this.favoriteCities(), city]);
      this.saveFavoriteCities();
      const cachedData = this.getCachedWeather(city);
      if (cachedData) {
        this.favoriteWeather.set({ ...this.favoriteWeather(), [city]: cachedData.weather });
      }
    }
  }

  removeFavoriteCity(city: string) {
    this.favoriteCities.set(this.favoriteCities().filter(c => c !== city));
    this.saveFavoriteCities();
    const updatedWeather = { ...this.favoriteWeather() };
    delete updatedWeather[city];
    this.favoriteWeather.set(updatedWeather);
  }

  getCachedWeather(city: string): { weather: WeatherResponse; forecast: ForecastResponse } | null {
    const now = Date.now();
    const cachedData = this.cache[city];
    return cachedData && now - cachedData.timestamp < this.CACHE_DURATION ? cachedData : null;
  }

  setCachedWeather(city: string, weather: WeatherResponse, forecast: ForecastResponse) {
    this.cache[city] = { timestamp: Date.now(), weather, forecast };
    this.favoriteWeather.set({ ...this.favoriteWeather(), [city]: weather });
    this.saveCache();
  }
}
