import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../blog-home/services/blog.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: [ './admin-dashboard.component.css' ],
  imports: [
    FormsModule
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
    this.blogService.getPosts().subscribe((data) => {
      this.posts = data;
    });
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

  deletePost(id: string) {
    this.blogService.deletePost(id).subscribe(() => {
      this.loadPosts(); // Reload posts
    });
  }
}
