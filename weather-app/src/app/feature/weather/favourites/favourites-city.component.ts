import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {MatCard, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatList, MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {WeatherResponse} from "@app/feature/weather/weather.entities";

@Component({
  selector: 'app-favourites-city',
  standalone: true,
  imports: [
    MatCard,
    MatFormField,
    MatCardTitle,
    MatInput,
    MatButton,
    MatList,
    MatIconButton,
    MatListItem,
    MatIcon,
    MatLabel,
  ],
  templateUrl: './favourites-city.component.html',
  styleUrl: './favourites-city.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavouritesCityComponent {
  favouriteCities = input.required<string[]>();
  favouriteWeather = input.required<Record<string, WeatherResponse>>();

  addFavourite = output<string>();
  removeFavourite = output<string>();
}
