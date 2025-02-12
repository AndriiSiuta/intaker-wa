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
  providers: [WeatherStateService, WeatherApiService],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherComponent {
  private readonly weatherState = inject(WeatherStateService);

  readonly error = this.weatherState.error;
  readonly weather = this.weatherState.weather;
  readonly forecast = this.weatherState.forecast;

  readonly favoriteCities = this.weatherState.favoriteCities;
  readonly favoriteWeather = this.weatherState.favoriteWeather;

  readonly cityControl = new FormControl('');

  searchWeather() {
    this.weatherState.loadWeather(this.cityControl.value || '');
  }

  addFavorite(city: string) {
    this.weatherState.addFavoriteCity(city);
  }

  removeFavorite(city: string) {
    this.weatherState.removeFavoriteCity(city);
  }
}
