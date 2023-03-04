import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioComponent } from './portfolio.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    PortfolioComponent
  ],
  imports: [
    CommonModule,
		MatProgressSpinnerModule
  ]
})
export class PortfolioModule { }
