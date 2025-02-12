import {inject, InjectionToken} from "@angular/core";
import {DOCUMENT} from "@angular/common";

export const WINDOW = new InjectionToken<Window>(
  'An abstraction over global window object',
  {
    factory: () => inject(DOCUMENT).defaultView!
  },
);

export const NAVIGATOR = new InjectionToken<Navigator>(
  'NAVIGATOR', {
    factory: () => inject(WINDOW).navigator
  }
);

export const GEOLOCATION = new InjectionToken<Geolocation>(
  'GEOLOCATION', {
    factory: () => inject(NAVIGATOR).geolocation
  });

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'LOCAL_STORAGE', {
    factory: () => inject(WINDOW).localStorage
  });
