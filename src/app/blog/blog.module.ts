import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogHomeComponent } from './home/home.component';
import { SpinnerModule } from '../components/spinner/spinner.module';

@NgModule({
  declarations: [BlogHomeComponent],
  imports: [CommonModule, SpinnerModule],
})
export class BlogModule {}
