import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BlogPost } from '../blog-post.model';
import { map } from 'rxjs';

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
      author
      publish_date
    }
  }
`;

const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    post(id: $id) {
      id
      title
      content
      author
      publish_date
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private apollo: Apollo) {}

  getPosts() {
    return this.apollo.watchQuery<{ posts: BlogPost[] }>({
      query: GET_POSTS,
    }).valueChanges.pipe(
      map(result => result.data.posts)
    );
  }

  getPostById(id: string | null) {
    return this.apollo.watchQuery<{ post: BlogPost }>({
      query: GET_POST_BY_ID,
      variables: { id },
    }).valueChanges.pipe(
      map(result => result.data.post)
    );
  }

  createPost(post: any) {
    return this.apollo.mutate({
      mutation: gql`
      mutation CreatePost($title: String!, $content: String!, $author: String) {
        createPost(title: $title, content: $content, author: $author) {
          id
          title
        }
      }
    `,
      variables: post,
    });
  }

  updatePost(id: string, post: any) {
    return this.apollo.mutate({
      mutation: gql`
      mutation UpdatePost($id: ID!, $title: String, $content: String, $author: String) {
        updatePost(id: $id, title: $title, content: $content, author: $author) {
          id
          title
        }
      }
    `,
      variables: { id, ...post },
    });
  }

  deletePost(id: string) {
    return this.apollo.mutate({
      mutation: gql`
      mutation DeletePost($id: ID!) {
        deletePost(id: $id) {
          id
        }
      }
    `,
      variables: { id },
    });
  }
}
