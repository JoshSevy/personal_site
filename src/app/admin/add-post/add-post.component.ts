import { Component } from '@angular/core';
import { BlogService } from '../../blog-home/services/blog.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: [ './add-post.component.css' ],
  imports: [
    FormsModule
  ]
})
export class AddPostComponent {
  newPost = { title: '', content: '', author: '' };

  constructor(private blogService: BlogService) {}

  createPost() {
    this.blogService.createPost(this.newPost).subscribe(() => {
      alert('Post added successfully!');
      this.newPost = { title: '', content: '', author: '' };
    });
  }

  uploadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      // Handle file upload logic here
    }
  }
}
