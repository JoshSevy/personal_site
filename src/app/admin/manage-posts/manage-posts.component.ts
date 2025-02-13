import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../blog-home/services/blog.service';
import { RouterLink } from '@angular/router';
import { NgForOf } from "@angular/common";

@Component({
  selector: 'app-manage-posts',
  templateUrl: './manage-posts.component.html',
    imports: [
        RouterLink,
        NgForOf
    ]
})
export class ManagePostsComponent implements OnInit {
  posts: any[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.blogService.getPosts().subscribe((data: any) => {
      this.posts = data.posts;
    });
  }

  deletePost(id: string) {
    this.blogService.deletePost(id).subscribe(() => {
      this.posts = this.posts.filter((post) => post.id !== id);
    });
  }
}
