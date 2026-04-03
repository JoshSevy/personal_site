import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client/core';
import { map, Observable } from 'rxjs';
import { BlogPost } from '../blog-post.model';
import {
  CreatePostDocument,
  DeletePostDocument,
  GetAllPostsDocument,
  GetPostByIdDocument,
  GetPostBySlugDocument,
  GetPublishedPostsDocument,
  GQLCreatePostMutationVariables,
  GQLGetAllPostsQuery,
  GQLGetPostByIdQuery,
  GQLGetPostBySlugQuery,
  GQLGetPublishedPostsQuery,
  GQLPostFieldsFragment,
  GQLPostListFieldsFragment,
  GQLUpdatePostMutationVariables,
  UpdatePostDocument,
} from '../../graphql/generated';

function mapListPost(row: GQLPostListFieldsFragment): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    content: '',
    author: row.author ?? '',
    publishDate: row.publish_date ?? '',
    updatedAt: row.updated_at ?? undefined,
    published: row.published,
    tags: row.tags ?? [],
    heroImageUrl: row.hero_image_url ?? undefined,
  };
}

function mapFullPost(row: GQLPostFieldsFragment): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    content: row.content,
    author: row.author ?? '',
    publishDate: row.publish_date ?? '',
    updatedAt: row.updated_at ?? undefined,
    published: row.published,
    tags: row.tags ?? [],
    heroImageUrl: row.hero_image_url ?? undefined,
  };
}

@Injectable()
export class BlogService {
  constructor(private apollo: Apollo) {}

  getPublishedPosts(): Observable<BlogPost[]> {
    return this.apollo
      .watchQuery<GQLGetPublishedPostsQuery>({ query: GetPublishedPostsDocument })
      .valueChanges.pipe(
        map((result: ApolloQueryResult<GQLGetPublishedPostsQuery>) => {
          const rows = result.data?.posts ?? [];
          return rows
            .filter((p): p is GQLPostListFieldsFragment => p != null)
            .map((p) => mapListPost(p));
        })
      );
  }

  getAllPosts(): Observable<BlogPost[]> {
    return this.apollo
      .watchQuery<GQLGetAllPostsQuery>({ query: GetAllPostsDocument })
      .valueChanges.pipe(
        map((result: ApolloQueryResult<GQLGetAllPostsQuery>) => {
          const rows = result.data?.posts ?? [];
          return rows
            .filter((p): p is GQLPostListFieldsFragment => p != null)
            .map((p) => mapListPost(p));
        })
      );
  }

  getPostBySlug(slug: string): Observable<BlogPost | null> {
    return this.apollo
      .watchQuery<GQLGetPostBySlugQuery>({
        query: GetPostBySlugDocument,
        variables: { slug },
      })
      .valueChanges.pipe(
        map((result: ApolloQueryResult<GQLGetPostBySlugQuery>) => {
          const p = result.data?.postBySlug;
          return p ? mapFullPost(p as GQLPostFieldsFragment) : null;
        })
      );
  }

  getPostById(id: string): Observable<BlogPost | null> {
    return this.apollo
      .watchQuery<GQLGetPostByIdQuery>({
        query: GetPostByIdDocument,
        variables: { id },
      })
      .valueChanges.pipe(
        map((result: ApolloQueryResult<GQLGetPostByIdQuery>) => {
          const p = result.data?.post;
          return p ? mapFullPost(p as GQLPostFieldsFragment) : null;
        })
      );
  }

  createPost(input: GQLCreatePostMutationVariables): Observable<unknown> {
    return this.apollo.mutate({
      mutation: CreatePostDocument,
      variables: input,
      refetchQueries: [
        { query: GetAllPostsDocument },
        { query: GetPublishedPostsDocument },
      ],
    });
  }

  updatePost(id: string, patch: Omit<GQLUpdatePostMutationVariables, 'id'>): Observable<unknown> {
    return this.apollo.mutate({
      mutation: UpdatePostDocument,
      variables: { id, ...patch },
      refetchQueries: [{ query: GetAllPostsDocument }, { query: GetPublishedPostsDocument }],
    });
  }

  deletePost(id: string): Observable<unknown> {
    return this.apollo.mutate({
      mutation: DeletePostDocument,
      variables: { id },
      refetchQueries: [
        { query: GetAllPostsDocument },
        { query: GetPublishedPostsDocument },
      ],
    });
  }
}
