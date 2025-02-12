import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {WeatherResponse} from "@app/feature/weather/weather.entities";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";

@Component({
  selector: 'app-city-details',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
  ],
  templateUrl: './city-details.component.html',
  styleUrl: './city-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CityDetailsComponent {
  cityWeather = input.required<WeatherResponse>();
}
