import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../blog-home/services/blog.service';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: [ './admin-dashboard.component.css' ],
  imports: [
    FormsModule,
    NgForOf
  ]
})
export class AdminDashboardComponent implements OnInit {
  posts: any[] = [];
  newPost = {
    title: '',
    content: '',
    author: '',
  };

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.blogService.getPosts().subscribe((data: any) => {
      this.posts = data;
    })
  }

  createPost() {
    this.blogService.createPost(this.newPost).subscribe(() => {
      this.newPost = { title: '', content: '', author: '' }; // Reset form
      this.loadPosts(); // Reload posts
    });
  }

  editPost(post: any) {
    // Navigate to a post edit form or show a modal
  }

  confirmDelete(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.deletePost(id);
    }
  }

  deletePost(id: string) {
    this.blogService.deletePost(id).subscribe(() => {
      this.loadPosts(); // Reload posts
    });
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
