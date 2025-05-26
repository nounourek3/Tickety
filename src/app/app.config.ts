import { ApplicationConfig } from '@angular/core';
import { appProviders } from './app.providers';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    ...appProviders                                // ✅ Interceptor now active
  ]
};
