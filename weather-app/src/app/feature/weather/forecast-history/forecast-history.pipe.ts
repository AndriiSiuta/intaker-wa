import {Pipe, PipeTransform} from "@angular/core";
import {ForecastResponse, GroupedForecast, WeatherEntry} from "@app/feature/weather/weather.entities";

@Pipe({
  name: 'forecastHistory',
  standalone: true,
})
export class ForecastHistoryPipe implements PipeTransform {
  transform(value: ForecastResponse, days: number): GroupedForecast[] {
    if (!value?.list || days <= 0) {
      return [];
    }

    const now = new Date();
    const lastNDays = new Date();
    lastNDays.setDate(now.getDate() - days);

    const groupedForecast = value.list.reduce((acc, entry) => {
      const entryDate = new Date(entry.dt_txt).toDateString();
      if (!acc[entryDate]) {
        acc[entryDate] = [];
      }
      acc[entryDate].push(entry);
      return acc;
    }, {} as Record<string, WeatherEntry[]>);

    return Object.entries(groupedForecast)
      .filter(([date]) => new Date(date) >= lastNDays)
      .map(([date, entries]) => ({date, entries}));
  }
}
