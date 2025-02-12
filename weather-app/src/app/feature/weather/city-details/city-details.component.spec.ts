import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityDetailsComponent } from './city-details.component';
import { WeatherResponse } from '@app/feature/weather/weather.entities';
import { By } from '@angular/platform-browser';

describe('CityDetailsComponent', () => {
  let component: CityDetailsComponent;
  let fixture: ComponentFixture<CityDetailsComponent>;
  
  const mockWeatherData: WeatherResponse = {
    coord: { lon: -0.13, lat: 51.51 },
    base: 'stations',
    visibility: 10000,
    clouds: { all: 20 },
    dt: 1707764426,
    sys: {
      type: 1,
      id: 1414,
      country: 'GB',
      sunrise: 1707727155,
      sunset: 1707762719
    },
    timezone: 0,
    id: 2643743,
    cod: 200,
    name: 'London',
    main: {
      temp: 20,
      feels_like: 19,
      temp_min: 18,
      temp_max: 22,
      pressure: 1015,
      humidity: 75,
      sea_level: 1016,
      grnd_level: 1014
    },
    weather: [{
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d'
    }],
    wind: {
      speed: 4.1,
      deg: 280,
      gust: 5.2
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityDetailsComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(CityDetailsComponent);
    component = fixture.componentInstance;
    // Set the required input using model property
    (component.cityWeather as any).value = mockWeatherData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have cityWeather input set', () => {
    expect(component.cityWeather()).toEqual(mockWeatherData);
  });

  it('should update when cityWeather input changes', () => {
    const updatedWeatherData: WeatherResponse = {
      ...mockWeatherData,
      name: 'Paris',
      main: {
        ...mockWeatherData.main,
        temp: 25
      }
    };

    (component.cityWeather as any).value = updatedWeatherData;
    fixture.detectChanges();

    expect(component.cityWeather()).toEqual(updatedWeatherData);
  });
}); 