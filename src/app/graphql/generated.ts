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
  title: Scalars['String']['input'];
};


export type GQLMutationDeletePostArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationUpdatePostArgs = {
  author?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GQLPost = {
  __typename?: 'Post';
  author?: Maybe<Scalars['String']['output']>;
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  publish_date?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type GQLQuery = {
  __typename?: 'Query';
  post?: Maybe<GQLPost>;
  posts?: Maybe<Array<Maybe<GQLPost>>>;
  trophies?: Maybe<Scalars['String']['output']>;
};


export type GQLQueryPostArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQueryTrophiesArgs = {
  username: Scalars['String']['input'];
};

export type GQLGetPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GQLGetPostsQuery = { __typename?: 'Query', posts?: Array<{ __typename?: 'Post', id: string, title: string, content: string, author?: string | null } | null> | null };

export type GQLGetPostQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GQLGetPostQuery = { __typename?: 'Query', post?: { __typename?: 'Post', id: string, title: string, content: string, author?: string | null } | null };

export type GQLUpdatePostMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  author?: InputMaybe<Scalars['String']['input']>;
}>;


export type GQLUpdatePostMutation = { __typename?: 'Mutation', updatePost?: { __typename?: 'Post', id: string, title: string, content: string, author?: string | null } | null };

export type GQLCreatePostMutationVariables = Exact<{
  title: Scalars['String']['input'];
  content: Scalars['String']['input'];
  author: Scalars['String']['input'];
}>;


export type GQLCreatePostMutation = { __typename?: 'Mutation', createPost?: { __typename?: 'Post', id: string, title: string, content: string, author?: string | null } | null };

export type GQLDeletePostMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GQLDeletePostMutation = { __typename?: 'Mutation', deletePost?: { __typename?: 'Post', id: string } | null };

export const GetPostsDocument = gql`
    query GetPosts {
  posts {
    id
    title
    content
    author
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GQLGetPostsGQL extends Apollo.Query<GQLGetPostsQuery, GQLGetPostsQueryVariables> {
    override document = GetPostsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetPostDocument = gql`
    query GetPost($id: ID!) {
  post(id: $id) {
    id
    title
    content
    author
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GQLGetPostGQL extends Apollo.Query<GQLGetPostQuery, GQLGetPostQueryVariables> {
    override document = GetPostDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: ID!, $title: String, $content: String, $author: String) {
  updatePost(id: $id, title: $title, content: $content, author: $author) {
    id
    title
    content
    author
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GQLUpdatePostGQL extends Apollo.Mutation<GQLUpdatePostMutation, GQLUpdatePostMutationVariables> {
    override document = UpdatePostDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreatePostDocument = gql`
    mutation CreatePost($title: String!, $content: String!, $author: String!) {
  createPost(title: $title, content: $content, author: $author) {
    id
    title
    content
    author
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GQLCreatePostGQL extends Apollo.Mutation<GQLCreatePostMutation, GQLCreatePostMutationVariables> {
    override document = CreatePostDocument;
    
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