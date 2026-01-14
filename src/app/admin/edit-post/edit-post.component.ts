import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../blog-home/services/blog.service';
import { FormsModule } from '@angular/forms';
import { BlogPost } from '../../blog-home/blog-post.model';
import { EditorComponent } from '../../editor/editor.component';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [FormsModule, EditorComponent],
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {
  post = {} as BlogPost;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('Post ID is missing.');
      return;
    }

    this.blogService.getPostById(id).subscribe((post) => {
      if (post && post.content) {
        this.post = { ...post };
      } else {
        console.error('Post content is missing.');
      }
    });
  }

  updatePost() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('Post ID is missing.');
      return;
    }

    const updatedPost = {
      title: this.post.title,
      content: this.post.content,
      author: this.post.author,
    };

    console.log('Updated Post:', updatedPost);

    this.blogService.updatePost(id, updatedPost).subscribe(
      () => {
        console.log('Post updated successfully.');
        this.router.navigate(['/admin/posts']);
      },
      (error: Error) => {
        console.error('Error updating post:', error);
      }
    );
  }
}
