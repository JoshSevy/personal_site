import { Component } from '@angular/core';
import { BlogService } from '../../blog-home/services/blog.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
})
export class AddPostComponent {
  post = { title: '', content: '', author: '' };

  constructor(private blogService: BlogService) {}

  addPost() {
    this.blogService.createPost(this.post).subscribe(() => {
      // Navigate to the manage posts page
    });
  }
}
