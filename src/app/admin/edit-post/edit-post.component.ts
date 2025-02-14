import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../blog-home/services/blog.service';
import { FormsModule } from '@angular/forms';
import { BlogPost } from '../../blog-home/blog-post.model';
import { EditorComponent } from "@tinymce/tinymce-angular";

import * as Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-php';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  imports: [ FormsModule, EditorComponent ],
})
export class EditPostComponent implements OnInit {
  post = {} as BlogPost;
  mce_key= process.env['MDC_KEY'];

  editorConfig = {
    height: 500,
    menubar: 'insert',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
      'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'codesample'
    ],
    toolbar:
        'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | codesample image | removeformat | help',
    codesample_languages: [
      { text: 'HTML/XML', value: 'markup' },
      { text: 'JavaScript', value: 'javascript' },
      { text: 'TypeScript', value: 'typescript' },
      { text: 'CSS', value: 'css' },
      { text: 'Python', value: 'python' },
      { text: 'Java', value: 'java' },
      { text: 'C', value: 'c' },
      { text: 'C#', value: 'csharp' },
      { text: 'PHP', value: 'php' },
    ],
    setup: (editor: any) => {
      editor.on('init', () => {
        editor.contentDocument.querySelectorAll('pre code').forEach((block: HTMLElement) => {
          Prism.highlightElement(block);
        });
      });
      editor.on('SetContent', () => {
        editor.contentDocument.querySelectorAll('pre code').forEach((block: HTMLElement) => {
          Prism.highlightElement(block);
        });
      });
    }
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
      if (post && post.content) {
        this.post = post;
      } else {
        console.error('Post content is missing.');
      }
    });

    // Configure highlight.js globally
    console.log('Quill editor initialized'); // Log to verify initialization
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
