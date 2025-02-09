import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPost } from './blog-post.model';
import { BlogService } from './services/blog.service';
import { AsyncPipe, NgFor } from '@angular/common';
import { ApolloQueryResult } from '@apollo/client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog-home',
  imports: [
    NgFor,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './blog-home.component.html',
})
export class BlogHomeComponent {
  posts: any;

  constructor(private blogService: BlogService) {
    this.posts = this.blogService.getPosts();
  }
}
