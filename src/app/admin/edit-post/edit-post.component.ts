import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../blog-home/services/blog.service';
import { FormsModule } from '@angular/forms';
import { BlogPost } from '../../blog-home/blog-post.model';
import { EditorComponent } from '../../editor/editor.component';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  imports: [ FormsModule, EditorComponent, EditorComponent ],
})
export class EditPostComponent implements OnInit {
  post = {} as BlogPost;

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
        this.router.navigate(['/admin/posts']); // Navigate back to manage posts page
      },
      (error) => {
        console.error('Error updating post:', error);
      }
    );
  }
}
