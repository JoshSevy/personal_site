import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../blog-home/services/blog.service';
import { FormsModule } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import hljs from 'highlight.js';
import { AsyncPipe, NgIf } from '@angular/common';
import { BlogPost } from '../../blog-home/blog-post.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  imports: [ FormsModule, QuillEditorComponent, NgIf, AsyncPipe ],
})
export class EditPostComponent implements OnInit {
  post = {} as BlogPost;
  contentLoaded = false; // Flag to track when content is loaded
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button

      ['link', 'image', 'video'], // link and image, video
    ],
    syntax: true
  };

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('Post ID is missing.');
      return;
    }

    // Fetch the post by ID and populate form
    this.blogService.getPostById(id).subscribe((post) => {
      this.post = post;
      this.contentLoaded = true; // Content is loaded
    });

    // Configure highlight.js globally
    hljs.configure({ languages: ['javascript', 'typescript', 'html', 'css'] });
  }

  updatePost() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('Post ID is missing.');
      return;
    }

    // Update post
    this.blogService.updatePost(id, this.post).subscribe(
      () => {
        console.log('Post updated successfully.');
        this.router.navigate(['/admin/manage-posts']); // Navigate back to manage posts page
      },
      (error) => {
        console.error('Error updating post:', error);
      }
    );
  }
}
