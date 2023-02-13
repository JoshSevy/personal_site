import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogHomeComponent } from './home/home.component';
import { LoaderModule } from '../components/loader/loader.module';

@NgModule({
  declarations: [BlogHomeComponent],
  imports: [CommonModule, LoaderModule],
})
export class BlogModule {}
