import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

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
    return this.apollo.watchQuery<any>({
      query: GET_POSTS,
    }).valueChanges;
  }

  getPostById(id: number) {
    return this.apollo.watchQuery<any>({
      query: GET_POST_BY_ID,
      variables: { id },
    }).valueChanges;
  }
}
