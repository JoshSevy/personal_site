import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { BlogPost } from '../blog-post.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private apollo: Apollo) {}

  getPosts(): Observable<BlogPost[]> {
    const query = gql`
      query GetPosts {
        posts {
          id
          title
          content
          author
        }
      }
    `;

    return this.apollo
      .watchQuery({
        query,
      })
      .valueChanges.pipe(
        map((result: any) => result.data.posts)
      );
  }

  getPostById(id: string): Observable<BlogPost> {
    const query = gql`
      query GetPost($id: ID!) {
        post(id: $id) {
          id
          title
          content
          author
        }
      }
    `;

    return this.apollo
      .watchQuery({
        query,
        variables: { id },
      })
      .valueChanges.pipe(
        map((result: any) => result.data.post)
      );
  }

  updatePost(id: string, post: Partial<BlogPost>): Observable<any> {
    const mutation = gql`
      mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
        updatePost(id: $id, input: $input) {
          id
          title
          content
          author
        }
      }
    `;

    return this.apollo
      .mutate({
        mutation,
        variables: {
          id,
          input: post,
        },
      });
  }

  createPost(post: Partial<BlogPost>): Observable<any> {
    const mutation = gql`
      mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          id
          title
          content
          author
        }
      }
    `;

    return this.apollo
      .mutate({
        mutation,
        variables: {
          input: post,
        },
      });
  }

  deletePost(id: string): Observable<any> {
    const mutation = gql`
      mutation DeletePost($id: ID!) {
        deletePost(id: $id)
      }
    `;

    return this.apollo
      .mutate({
        mutation,
        variables: { id },
      });
  }
}
