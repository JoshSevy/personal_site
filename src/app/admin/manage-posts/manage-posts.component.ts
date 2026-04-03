import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BlogStore } from '../../blog-home/state/blog.store';
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
  readonly blogStore = inject(BlogStore);

  constructor(private router: Router) {}

  ngOnInit() {
    this.blogStore.ensureAllPostsWatch();
  }

  editPost(post: BlogPost) {
    void this.router.navigate(['/admin/posts/edit', post.id]);
  }

  confirmDelete(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogStore.deletePost(id).subscribe({
        error: (err: unknown) => console.error(err),
      });
    }
  }
}
