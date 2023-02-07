import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BlogHomeComponent } from './home/home.component';

@NgModule({
  declarations: [BlogHomeComponent],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class BlogModule {}
