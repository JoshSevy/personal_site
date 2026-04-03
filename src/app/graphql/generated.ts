import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type GQLMutation = {
  __typename?: 'Mutation';
  createPost?: Maybe<GQLPost>;
  deletePost?: Maybe<GQLPost>;
  updatePost?: Maybe<GQLPost>;
};


export type GQLMutationCreatePostArgs = {
  author?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  excerpt?: InputMaybe<Scalars['String']['input']>;
  hero_image_url?: InputMaybe<Scalars['String']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  slug: Scalars['String']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};


export type GQLMutationDeletePostArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationUpdatePostArgs = {
  author?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  excerpt?: InputMaybe<Scalars['String']['input']>;
  hero_image_url?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  published?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GQLPost = {
  __typename?: 'Post';
  author?: Maybe<Scalars['String']['output']>;
  content: Scalars['String']['output'];
  excerpt?: Maybe<Scalars['String']['output']>;
  hero_image_url?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  publish_date?: Maybe<Scalars['String']['output']>;
  published: Scalars['Boolean']['output'];
  slug: Scalars['String']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  title: Scalars['String']['output'];
  updated_at?: Maybe<Scalars['String']['output']>;
};

export type GQLQuery = {
  __typename?: 'Query';
  post?: Maybe<GQLPost>;
  postBySlug?: Maybe<GQLPost>;
  posts?: Maybe<Array<Maybe<GQLPost>>>;
  trophies?: Maybe<Scalars['String']['output']>;
};


export type GQLQueryPostArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQueryPostBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type GQLQueryPostsArgs = {
  publishedOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type GQLQueryTrophiesArgs = {
  username: Scalars['String']['input'];
};

export type GQLPostListFieldsFragment = { __typename?: 'Post', id: string, title: string, slug: string, excerpt?: string | null, author?: string | null, publish_date?: string | null, updated_at?: string | null, published: boolean, tags?: Array<string> | null, hero_image_url?: string | null };

export type GQLPostFieldsFragment = { __typename?: 'Post', id: string, title: string, slug: string, content: string, excerpt?: string | null, author?: string | null, publish_date?: string | null, updated_at?: string | null, published: boolean, tags?: Array<string> | null, hero_image_url?: string | null };

export type GQLGetPublishedPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GQLGetPublishedPostsQuery = { __typename?: 'Query', posts?: Array<{ __typename?: 'Post', id: string, title: string, slug: string, excerpt?: string | null, author?: string | null, publish_date?: string | null, updated_at?: string | null, published: boolean, tags?: Array<string> | null, hero_image_url?: string | null } | null> | null };

export type GQLGetAllPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GQLGetAllPostsQuery = { __typename?: 'Query', posts?: Array<{ __typename?: 'Post', id: string, title: string, slug: string, excerpt?: string | null, author?: string | null, publish_date?: string | null, updated_at?: string | null, published: boolean, tags?: Array<string> | null, hero_image_url?: string | null } | null> | null };

export type GQLGetPostByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GQLGetPostByIdQuery = { __typename?: 'Query', post?: { __typename?: 'Post', id: string, title: string, slug: string, content: string, excerpt?: string | null, author?: string | null, publish_date?: string | null, updated_at?: string | null, published: boolean, tags?: Array<string> | null, hero_image_url?: string | null } | null };

export type GQLGetPostBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GQLGetPostBySlugQuery = { __typename?: 'Query', postBySlug?: { __typename?: 'Post', id: string, title: string, slug: string, content: string, excerpt?: string | null, author?: string | null, publish_date?: string | null, updated_at?: string | null, published: boolean, tags?: Array<string> | null, hero_image_url?: string | null } | null };

export type GQLCreatePostMutationVariables = Exact<{
  title: Scalars['String']['input'];
  slug: Scalars['String']['input'];
  content: Scalars['String']['input'];
  excerpt?: InputMaybe<Scalars['String']['input']>;
  author?: InputMaybe<Scalars['String']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  hero_image_url?: InputMaybe<Scalars['String']['input']>;
}>;


export type GQLCreatePostMutation = { __typename?: 'Mutation', createPost?: { __typename?: 'Post', id: string, title: string, slug: string, content: string, excerpt?: string | null, author?: string | null, publish_date?: string | null, updated_at?: string | null, published: boolean, tags?: Array<string> | null, hero_image_url?: string | null } | null };

export type GQLUpdatePostMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  excerpt?: InputMaybe<Scalars['String']['input']>;
  author?: InputMaybe<Scalars['String']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  hero_image_url?: InputMaybe<Scalars['String']['input']>;
}>;


export type GQLUpdatePostMutation = { __typename?: 'Mutation', updatePost?: { __typename?: 'Post', id: string, title: string, slug: string, content: string, excerpt?: string | null, author?: string | null, publish_date?: string | null, updated_at?: string | null, published: boolean, tags?: Array<string> | null, hero_image_url?: string | null } | null };

export type GQLDeletePostMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GQLDeletePostMutation = { __typename?: 'Mutation', deletePost?: { __typename?: 'Post', id: string } | null };

export type GQLGetGithubTrophiesQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type GQLGetGithubTrophiesQuery = { __typename?: 'Query', trophies?: string | null };

export const PostListFieldsFragmentDoc = gql`
    fragment PostListFields on Post {
  id
  title
  slug
  excerpt
  author
  publish_date
  updated_at
  published
  tags
  hero_image_url
}
    `;
export const PostFieldsFragmentDoc = gql`
    fragment PostFields on Post {
  id
  title
  slug
  content
  excerpt
  author
  publish_date
  updated_at
  published
  tags
  hero_image_url
}
    `;
export const GetPublishedPostsDocument = gql`
    query GetPublishedPosts {
  posts(publishedOnly: true) {
    ...PostListFields
  }
}
    ${PostListFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GQLGetPublishedPostsGQL extends Apollo.Query<GQLGetPublishedPostsQuery, GQLGetPublishedPostsQueryVariables> {
    override document = GetPublishedPostsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAllPostsDocument = gql`
    query GetAllPosts {
  posts {
    ...PostListFields
  }
}
    ${PostListFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GQLGetAllPostsGQL extends Apollo.Query<GQLGetAllPostsQuery, GQLGetAllPostsQueryVariables> {
    override document = GetAllPostsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPostByIdDocument = gql`
    query GetPostById($id: ID!) {
  post(id: $id) {
    ...PostFields
  }
}
    ${PostFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GQLGetPostByIdGQL extends Apollo.Query<GQLGetPostByIdQuery, GQLGetPostByIdQueryVariables> {
    override document = GetPostByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPostBySlugDocument = gql`
    query GetPostBySlug($slug: String!) {
  postBySlug(slug: $slug) {
    ...PostFields
  }
}
    ${PostFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GQLGetPostBySlugGQL extends Apollo.Query<GQLGetPostBySlugQuery, GQLGetPostBySlugQueryVariables> {
    override document = GetPostBySlugDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreatePostDocument = gql`
    mutation CreatePost($title: String!, $slug: String!, $content: String!, $excerpt: String, $author: String, $published: Boolean, $tags: [String!], $hero_image_url: String) {
  createPost(
    title: $title
    slug: $slug
    content: $content
    excerpt: $excerpt
    author: $author
    published: $published
    tags: $tags
    hero_image_url: $hero_image_url
  ) {
    ...PostFields
  }
}
    ${PostFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GQLCreatePostGQL extends Apollo.Mutation<GQLCreatePostMutation, GQLCreatePostMutationVariables> {
    override document = CreatePostDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: ID!, $title: String, $slug: String, $content: String, $excerpt: String, $author: String, $published: Boolean, $tags: [String!], $hero_image_url: String) {
  updatePost(
    id: $id
    title: $title
    slug: $slug
    content: $content
    excerpt: $excerpt
    author: $author
    published: $published
    tags: $tags
    hero_image_url: $hero_image_url
  ) {
    ...PostFields
  }
}
    ${PostFieldsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GQLUpdatePostGQL extends Apollo.Mutation<GQLUpdatePostMutation, GQLUpdatePostMutationVariables> {
    override document = UpdatePostDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeletePostDocument = gql`
    mutation DeletePost($id: ID!) {
  deletePost(id: $id) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GQLDeletePostGQL extends Apollo.Mutation<GQLDeletePostMutation, GQLDeletePostMutationVariables> {
    override document = DeletePostDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetGithubTrophiesDocument = gql`
    query GetGithubTrophies($username: String!) {
  trophies(username: $username)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GQLGetGithubTrophiesGQL extends Apollo.Query<GQLGetGithubTrophiesQuery, GQLGetGithubTrophiesQueryVariables> {
    override document = GetGithubTrophiesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }