import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { BlogPost } from '../blog-post.model';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { QuillEditorComponent, QuillViewComponent } from 'ngx-quill';

@Component({
  selector: 'app-blog-post',
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    FormsModule,
    QuillEditorComponent,
    QuillViewComponent,
  ],
  templateUrl: './blog-post.component.html',
})
export class BlogPostComponent implements OnInit {
  post$: Observable<BlogPost> | undefined;

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'], // blocks
      [{ list: 'ordered' }, { list: 'bullet' }], // lists
      [{ header: [1, 2, 3, false] }], // headers
      [{ align: [] }], // alignment
      ['link', 'image'], // links and images
      ['clean'], // remove formatting
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    this.post$ = this.blogService.getPostById(postId);
  }
}
