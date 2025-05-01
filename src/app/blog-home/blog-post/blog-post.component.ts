import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { BlogPost } from '../blog-post.model';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { SanitizeHtmlPipe } from '../../pipes/sanitize-html.pipe';
import { HighlightCodeDirective } from '../../directives/highlight-syntax.directive';
import { ApolloModule } from 'apollo-angular';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    FormsModule,
    DatePipe,
    SanitizeHtmlPipe,
    HighlightCodeDirective,
    NgForOf,
    RouterLink,
    ApolloModule
  ],
  providers: [BlogService],
  templateUrl: './blog-post.component.html',
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
