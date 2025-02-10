import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPost } from './blog-post.model';
import { BlogService } from './services/blog.service';
import { AsyncPipe, JsonPipe, NgFor } from '@angular/common';
import { ApolloQueryResult } from '@apollo/client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog-home',
  imports: [
    NgFor,
    RouterLink,
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './blog-home.component.html',
})
export class BlogHomeComponent implements OnInit {
  posts$: Observable<BlogPost[]> | undefined;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.posts$ = this.blogService.getPosts();
  }
}
