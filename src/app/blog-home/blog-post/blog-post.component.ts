import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { BlogPost } from '../blog-post.model';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-post',
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    FormsModule,
  ],
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
    this.post$ = this.blogService.getPostById(postId);
  }
}
