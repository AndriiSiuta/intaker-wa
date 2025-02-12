
export interface IAppConfig {
  weatherApiUrl: string;
  forecastApiUrl: string;
  weatherApiKey: string;
}

export const API_CONFIG: IAppConfig = {
  weatherApiUrl: 'https://api.openweathermap.org/data/2.5/weather',
  forecastApiUrl: 'https://api.openweathermap.org/data/2.5/forecast',
  weatherApiKey: 'e652424169dc5cd81fe37071cf20f890'
}
