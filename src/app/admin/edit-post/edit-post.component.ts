import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../blog-home/services/blog.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  imports: [
    FormsModule
  ]
})
export class EditPostComponent implements OnInit {
  post = { title: '', content: '', author: '' };

  constructor(private blogService: BlogService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.blogService.getPostById(id).subscribe((data: any) => {
      this.post = data.post;
    });
  }

  updatePost() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    this.blogService.updatePost(id, this.post).subscribe(() => {
      // Navigate to the manage posts page
    });
  }
}
