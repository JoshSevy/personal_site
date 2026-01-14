import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { BlogPost } from '../blog-post.model';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { SanitizeHtmlPipe } from '../../pipes/sanitize-html.pipe';
import { HighlightCodeDirective } from '../../directives/highlight-syntax.directive';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    SanitizeHtmlPipe,
    HighlightCodeDirective,
    RouterLink
  ],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit {
  post$: Observable<BlogPost> | undefined;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.post$ = this.blogService.getPostById(postId);
    }
  }
}
