import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
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

@Injectable({ providedIn: 'root' })
export class BlogStore {
  private readonly apollo = inject(Apollo);
  private readonly destroyRef = inject(DestroyRef);

  /** `null` = still waiting for first payload */
  readonly publishedPosts = signal<BlogPost[] | null>(null);
  readonly publishedLoading = signal(false);

  readonly allPosts = signal<BlogPost[] | null>(null);
  readonly allPostsLoading = signal(false);

  /** `undefined` = loading / pending; `null` = not found */
  readonly postBySlug = signal<BlogPost | null | undefined>(undefined);
  readonly postBySlugLoading = signal(false);

  private readonly slugRequests = new Subject<string | null>();
  private publishedWatchStarted = false;
  private allPostsWatchStarted = false;

  constructor() {
    this.slugRequests
      .pipe(
        tap((slug) => {
          if (!slug) {
            this.postBySlugLoading.set(false);
            this.postBySlug.set(null);
            return;
          }
          this.postBySlugLoading.set(true);
          this.postBySlug.set(undefined);
        }),
        switchMap((slug) => {
          if (!slug) return EMPTY;
          return this.apollo.watchQuery<GQLGetPostBySlugQuery>({
            query: GetPostBySlugDocument,
            variables: { slug },
            fetchPolicy: 'cache-and-network',
            notifyOnNetworkStatusChange: true,
          }).valueChanges;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result: ApolloQueryResult<GQLGetPostBySlugQuery>) => {
        if (result.data?.postBySlug !== undefined) {
          const p = result.data.postBySlug;
          this.postBySlug.set(p ? mapFullPost(p as GQLPostFieldsFragment) : null);
        }
        this.postBySlugLoading.set(
          result.loading && this.postBySlug() === undefined,
        );
      });
  }

  ensurePublishedWatch(): void {
    if (this.publishedWatchStarted) return;
    this.publishedWatchStarted = true;
    this.publishedLoading.set(true);
    this.apollo
      .watchQuery<GQLGetPublishedPostsQuery>({
        query: GetPublishedPostsDocument,
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      })
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: ApolloQueryResult<GQLGetPublishedPostsQuery>) => {
        if (result.data?.posts != null) {
          const list = result.data.posts
            .filter((p): p is GQLPostListFieldsFragment => p != null)
            .map((p) => mapListPost(p as GQLPostListFieldsFragment));
          this.publishedPosts.set(list);
        }
        this.publishedLoading.set(
          result.loading && this.publishedPosts() === null,
        );
      });
  }

  ensureAllPostsWatch(): void {
    if (this.allPostsWatchStarted) return;
    this.allPostsWatchStarted = true;
    this.allPostsLoading.set(true);
    this.apollo
      .watchQuery<GQLGetAllPostsQuery>({
        query: GetAllPostsDocument,
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      })
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: ApolloQueryResult<GQLGetAllPostsQuery>) => {
        if (result.data?.posts != null) {
          const list = result.data.posts
            .filter((p): p is GQLPostListFieldsFragment => p != null)
            .map((p) => mapListPost(p as GQLPostListFieldsFragment));
          this.allPosts.set(list);
        }
        this.allPostsLoading.set(result.loading && this.allPosts() === null);
      });
  }

  requestPostBySlug(slug: string | null): void {
    this.slugRequests.next(slug);
  }

  fetchPostById(id: string): Observable<BlogPost | null> {
    return this.apollo
      .query<GQLGetPostByIdQuery>({
        query: GetPostByIdDocument,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((r) => {
          const p = r.data?.post;
          return p ? mapFullPost(p as GQLPostFieldsFragment) : null;
        }),
      );
  }

  createPost(input: GQLCreatePostMutationVariables): Observable<unknown> {
    return this.apollo.mutate({
      mutation: CreatePostDocument,
      variables: input,
      refetchQueries: [{ query: GetAllPostsDocument }, { query: GetPublishedPostsDocument }],
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
      refetchQueries: [{ query: GetAllPostsDocument }, { query: GetPublishedPostsDocument }],
    });
  }
}
