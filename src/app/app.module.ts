import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SimpleHeaderComponent } from './header/simple-header/simple-header.component';
import { FooterComponent } from './footer/footer/footer.component';
import { StayTunedModule } from './homepage/stay-tuned/stay-tuned.module';
import { MatCommonModule } from '@angular/material/core';

@NgModule({
  declarations: [AppComponent, SimpleHeaderComponent, FooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCommonModule,
    StayTunedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
