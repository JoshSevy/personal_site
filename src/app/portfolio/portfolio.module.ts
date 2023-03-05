import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioComponent } from './portfolio.component';
import { SpinnerModule } from '../components/spinner/spinner.module';



@NgModule({
  declarations: [
    PortfolioComponent
  ],
  imports: [
    CommonModule,
		SpinnerModule,
  ]
})
export class PortfolioModule { }
