import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { calendarProviders } from './app/calendar.providers';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';


registerLocaleData(localeEs);


bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    ...calendarProviders, { provide: LOCALE_ID, useValue: 'es' },
    provideAnimations()
  ]
}).catch((err) => console.error(err));
