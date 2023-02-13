import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SimpleHeaderComponent } from './header/simple-header/simple-header.component';
import { StayTunedModule } from './homepage/stay-tuned/stay-tuned.module';
import { FooterComponent } from './footer/footer/footer.component';
import { LoaderModule } from './components/loader/loader.module';

const materialModules = [
  MatCommonModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule,
];
@NgModule({
  declarations: [AppComponent, SimpleHeaderComponent, FooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ...materialModules,
    LoaderModule,
    StayTunedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
