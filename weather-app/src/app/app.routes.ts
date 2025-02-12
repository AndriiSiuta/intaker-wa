import { Routes } from '@angular/router';

export const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  loadComponent: () => import('./feature/weather/weather.component').then(m => m.WeatherComponent)
}];
