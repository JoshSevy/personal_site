import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPost } from './blog-post.model';
import { BlogService } from './services/blog.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { SanitizeHtmlPipe } from '../pipes/sanitize-html.pipe';

@Component({
  selector: 'app-blog-home',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    SanitizeHtmlPipe
  ],
  templateUrl: './blog-home.component.html',
  styleUrls: ['./blog-home.component.scss']
})
export class BlogHomeComponent implements OnInit {
  posts$: Observable<BlogPost[]> | undefined;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.posts$ = this.blogService.getPosts();
  }
}
