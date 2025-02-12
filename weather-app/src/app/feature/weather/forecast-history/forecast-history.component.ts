import {Component, input} from '@angular/core';
import {ForecastResponse} from "@app/feature/weather/weather.entities";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {DatePipe, SlicePipe} from "@angular/common";
import {ForecastHistoryPipe} from "@app/feature/weather/forecast-history/forecast-history.pipe";

@Component({
  selector: 'app-forecast-history',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    SlicePipe,
    DatePipe,
    MatCardTitle,
    ForecastHistoryPipe,
  ],
  templateUrl: './forecast-history.component.html',
  styleUrl: './forecast-history.component.scss'
})
export class ForecastHistoryComponent {
  forecast = input.required<ForecastResponse>();
}
