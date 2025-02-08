import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPost } from './blog-post.model';
import { BlogService } from './services/blog.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-blog-home',
  imports: [
    NgFor,
    RouterLink
  ],
  templateUrl: './blog-home.component.html',
})
export class BlogHomeComponent {
  posts: BlogPost[];

  constructor(private blogService: BlogService) {
    this.posts = this.blogService.getAllPosts();
  }
}
