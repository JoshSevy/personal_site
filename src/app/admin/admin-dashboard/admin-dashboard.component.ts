import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../blog-home/services/blog.service';
import { BlogPost } from '../../blog-home/blog-post.model';
import { Observable } from 'rxjs';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  posts$: Observable<BlogPost[]> | undefined;
  newPost = {
    title: '',
    content: '',
    author: '',
  };

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.posts$ = this.blogService.getPosts();
  }

  createPost() {
    this.blogService.createPost(this.newPost).subscribe(() => {
      this.newPost = { title: '', content: '', author: '' }; // Reset form
      this.posts$ = this.blogService.getPosts(); // Reload posts
    });
  }

  editPost(post: any) {
    // Navigate to a post edit form or show a modal
  }

  deletePost(id: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogService.deletePost(id).subscribe({
        next: () => {
          // Refresh the posts list
          this.posts$ = this.blogService.getPosts();
        },
        error: (error) => {
          console.error('Error deleting post:', error);
        }
      });
    }
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Upload file logic here (e.g., Cloudinary or Supabase)
      // this.blogService.uploadImage(file).subscribe((imageUrl) => {
      //   this.newPost.image = imageUrl; // Add image URL to the new post
      // });
    }
  }
}
