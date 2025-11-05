import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../../blog-home/services/blog.service';

@Component({
  selector: 'app-manage-posts',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './manage-posts.component.html',
  styleUrls: ['./manage-posts.component.css']
})
export class ManagePostsComponent implements OnInit {
  posts: any[] = [];

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.blogService.getPosts().subscribe((data: any) => {
      this.posts = data;
    });
  }

  editPost(post: any) {
    this.router.navigate(['/admin/posts/edit', post.id]);
  }

  confirmDelete(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogService.deletePost(id).subscribe(() => {
        this.loadPosts();
      });
    }
  }
}
