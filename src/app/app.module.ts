import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
// ... existing code ...

@NgModule({
  declarations: [
    AppComponent,
    // ... existing code ...
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.serviceWorker,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    // ... existing code ...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 