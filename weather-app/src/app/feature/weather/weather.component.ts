import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {WeatherStateService} from "@app/feature/weather/weather-state.service";
import {WeatherApiService} from "@app/feature/weather/weather-api.service";
import {MatDivider} from "@angular/material/divider";
import {CityDetailsComponent} from "@app/feature/weather/city-details/city-details.component";
import {ForecastHistoryComponent} from "@app/feature/weather/forecast-history/forecast-history.component";
import {FavouritesCityComponent} from "@app/feature/weather/favourites/favourites-city.component";
import {WeatherCacheService} from "@app/feature/weather/weather-cache.service";

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    MatDivider,
    CityDetailsComponent,
    MatError,
    ForecastHistoryComponent,
    FavouritesCityComponent
  ],
  providers: [WeatherStateService, WeatherApiService, WeatherCacheService],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherComponent {
  private readonly weatherState = inject(WeatherStateService);
  private readonly weatherCache = inject(WeatherCacheService);

  readonly error = this.weatherState.error;
  readonly weather = this.weatherState.weather;
  readonly forecast = this.weatherState.forecast;

  readonly favoriteCities = this.weatherCache.favoriteCities;
  readonly favoriteWeather = this.weatherCache.favoriteWeather;

  readonly cityControl = new FormControl('');

  searchWeather() {
    this.weatherState.loadWeather(this.cityControl.value || '');
  }

  addFavorite(city: string) {
    this.weatherCache.addFavoriteCity(city);
  }

  removeFavorite(city: string) {
    this.weatherCache.removeFavoriteCity(city);
  }
}
