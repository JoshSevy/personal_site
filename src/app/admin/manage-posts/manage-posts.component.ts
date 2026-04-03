import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../blog-home/services/blog.service';
import { BlogPost } from '../../blog-home/blog-post.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manage-posts',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './manage-posts.component.html',
  styleUrls: ['./manage-posts.component.scss'],
})
export class ManagePostsComponent implements OnInit {
  posts: BlogPost[] = [];

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.blogService.getAllPosts().subscribe((data) => {
      this.posts = data;
    });
  }

  editPost(post: BlogPost) {
    void this.router.navigate(['/admin/posts/edit', post.id]);
  }

  confirmDelete(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogService.deletePost(id).subscribe(() => this.loadPosts());
    }
  }
}
