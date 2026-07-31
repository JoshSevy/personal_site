import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogStore } from './state/blog.store';

@Component({
  selector: 'app-blog-home',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './blog-home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./blog-home.component.scss'],
})
export class BlogHomeComponent implements OnInit {
  readonly blogStore = inject(BlogStore);

  ngOnInit(): void {
    this.blogStore.ensurePublishedWatch();
  }
}
