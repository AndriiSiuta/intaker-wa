import { TestBed } from '@angular/core/testing';
import { WeatherStateService } from './weather-state.service';
import { WeatherApiService } from './weather-api.service';
import { of, throwError } from 'rxjs';
import { WeatherResponse, ForecastResponse } from './weather.entities';

describe('WeatherStateService', () => {
  let service: WeatherStateService;
  let weatherApiMock: jasmine.SpyObj<WeatherApiService>;
  let localStorageMock: { [key: string]: string } = {};

  const mockWeatherResponse = {
    name: 'London',
    coord: { lon: -0.13, lat: 51.51 },
    weather: [{ id: 800, main: 'Clear', description: 'sunny', icon: '01d' }],
    base: 'stations',
    main: {
      temp: 20,
      feels_like: 19,
      temp_min: 18,
      temp_max: 22,
      pressure: 1012,
      humidity: 65,
      sea_level: 1012,
      grnd_level: 1010
    },
    visibility: 10000,
    wind: { 
      speed: 4.1, 
      deg: 280,
      gust: 8.2
    },
    clouds: { all: 90 },
    dt: 1485789600,
    sys: { type: 1, id: 5091, message: 0.0103, country: 'GB', sunrise: 1485762037, sunset: 1485794875 },
    timezone: 0,
    id: 2643743,
    cod: 200
  };

  const mockForecastResponse = {
    cod: '200',
    message: 0,
    cnt: 1,
    list: [{
      dt: 1234567890,
      main: {
        temp: 22,
        feels_like: 21,
        temp_min: 20,
        temp_max: 23,
        pressure: 1015,
        humidity: 60,
        sea_level: 1015,
        grnd_level: 1013,
        temp_kf: 0
      },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      clouds: { all: 20 },
      wind: { speed: 4.1, deg: 280, gust: 8.2 },
      visibility: 10000,
      pop: 0.1,
      sys: { pod: 'd' },
      dt_txt: '2024-01-01 12:00:00'
    }],
    city: {
      id: 2643743,
      name: 'London',
      coord: { lat: 51.51, lon: -0.13 },
      country: 'GB',
      population: 1000000,
      timezone: 0,
      sunrise: 1485762037,
      sunset: 1485794875
    }
  };

  beforeEach(() => {
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake(key => localStorageMock[key]);
    spyOn(localStorage, 'setItem').and.callFake((key, value) => localStorageMock[key] = value);
    
    // Create WeatherApiService mock
    weatherApiMock = jasmine.createSpyObj('WeatherApiService', ['getWeather', 'getForecast']);
    weatherApiMock.getWeather.and.returnValue(of(mockWeatherResponse as WeatherResponse));
    weatherApiMock.getForecast.and.returnValue(of(mockForecastResponse as ForecastResponse));

    TestBed.configureTestingModule({
      providers: [
        WeatherStateService,
        { provide: WeatherApiService, useValue: weatherApiMock }
      ]
    });

    service = TestBed.inject(WeatherStateService);
    localStorageMock = {};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadWeather', () => {
    it('should load weather and forecast data', () => {
      service.loadWeather('London');

      expect(weatherApiMock.getWeather).toHaveBeenCalledWith('London');
      expect(weatherApiMock.getForecast).toHaveBeenCalledWith('London');
      expect(service.weather()).toEqual(mockWeatherResponse);
      expect(service.forecast()).toEqual(mockForecastResponse);
      expect(service.loading()).toBeFalse();
      expect(service.error()).toBeNull();
    });

    it('should handle errors', () => {
      const errorMessage = 'City not found';
      weatherApiMock.getWeather.and.returnValue(throwError(() => ({ error: { message: errorMessage } })));
      weatherApiMock.getForecast.and.returnValue(throwError(() => ({ error: { message: errorMessage } })));

      service.loadWeather('InvalidCity');

      expect(service.error()).toBe(errorMessage);
      expect(service.loading()).toBeFalse();
    });

    it('should use cached data if available and not expired', () => {
      const cachedData = {
        London: {
          timestamp: Date.now(),
          weather: mockWeatherResponse,
          forecast: mockForecastResponse
        }
      };
      localStorage.setItem('weather_cache', JSON.stringify(cachedData));
      
      service.loadWeather('London');

      expect(weatherApiMock.getWeather).not.toHaveBeenCalled();
      expect(weatherApiMock.getForecast).not.toHaveBeenCalled();
      expect(service.weather()).toEqual(mockWeatherResponse);
      expect(service.forecast()).toEqual(mockForecastResponse);
    });
  });

  describe('favorite cities', () => {
    it('should add a favorite city', () => {
      service.addFavoriteCity('London');

      expect(service.favoriteCities()).toContain('London');
      expect(localStorage.getItem('favorite_cities')).toBe(JSON.stringify(['London']));
    });

    it('should not add duplicate favorite city', () => {
      service.addFavoriteCity('London');
      service.addFavoriteCity('London');

      expect(service.favoriteCities()).toEqual(['London']);
    });

    it('should remove a favorite city', () => {
      service.addFavoriteCity('London');
      service.addFavoriteCity('Paris');
      service.removeFavoriteCity('London');

      expect(service.favoriteCities()).toEqual(['Paris']);
      expect(service.favoriteCities()).not.toContain('London');
    });

    it('should load favorite cities from localStorage on init', () => {
      localStorage.setItem('favorite_cities', JSON.stringify(['Tokyo', 'Berlin']));
      
      // Recreate service to trigger initialization
      service = TestBed.inject(WeatherStateService);

      expect(service.favoriteCities()).toEqual(['Tokyo', 'Berlin']);
    });
  });
}); 