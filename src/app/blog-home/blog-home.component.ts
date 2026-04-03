import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPost } from './blog-post.model';
import { BlogService } from './services/blog.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog-home',
  standalone: true,
  imports: [RouterLink, AsyncPipe, DatePipe],
  templateUrl: './blog-home.component.html',
  styleUrls: ['./blog-home.component.scss'],
})
export class BlogHomeComponent implements OnInit {
  posts$: Observable<BlogPost[]> | undefined;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.posts$ = this.blogService.getPublishedPosts();
  }
}
