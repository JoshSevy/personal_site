import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../blog-home/services/blog.service';

@Component({
  selector: 'app-manage-posts',
  templateUrl: './manage-posts.component.html',
  styleUrls: ['./manage-posts.component.css'],
})
export class ManagePostsComponent implements OnInit {
  posts: any[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.blogService.getPosts().subscribe((data: any) => {
      this.posts = data;
    });
  }

  editPost(post: any) {
    // Navigate to edit post page with post ID
  }

  confirmDelete(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogService.deletePost(id).subscribe(() => {
        this.loadPosts();
      });
    }
  }
}
