import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideZonelessChangeDetection, inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    ...appConfig.providers, provideHttpClient(), provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({
          uri: '<%= endpoint %>',
        }),
        cache: new InMemoryCache(),
      };
    })
    ]

})
  .catch(err => console.error(err));
