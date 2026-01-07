import { inject } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { provideHttpLink } from 'apollo-angular/http';
import { InMemoryCache, TypePolicy, FieldPolicy } from '@apollo/client/core';

// Define type policies for better cache handling
const typePolicies: Record<string, TypePolicy> = {
  Query: {
    fields: {
      posts: {
        // Merge function for posts array
        merge(existing: any[] = [], incoming: any[]) {
          return incoming;
        },
        // Read function for posts array
        read(existing: any[] = []) {
          return existing;
        }
      } as FieldPolicy,
      post: {
        // Merge function for single post
        merge(existing: any = null, incoming: any) {
          return incoming;
        },
        // Read function for single post
        read(existing: any = null) {
          return existing;
        }
      } as FieldPolicy,
      trophies: {
        // Merge function for trophies
        merge(existing: any = null, incoming: any) {
          return incoming;
        },
        // Read function for trophies
        read(existing: any = null) {
          return existing;
        }
      } as FieldPolicy
    }
  }
};

/**
 * Creates Apollo provider configuration
 * This is only imported by routes that need Apollo (blog, resume, admin)
 * The bundler should code-split Apollo since it's not in app.config.ts
 */
export function createApolloProvider() {
  return [
    provideHttpLink({
      uri: 'https://api.joshuasevy.com/graphql',
    }),
    provideApollo(() => ({
      cache: new InMemoryCache({
        typePolicies,
        // Enable field-level caching
        possibleTypes: {
          Post: ['Post'],
          Query: ['Query'],
          Mutation: ['Mutation']
        },
        // Cache configuration
        dataIdFromObject: (object: any) => {
          if (object.id) {
            return `${object.__typename}:${object.id}`;
          }
          return false;
        }
      }),
      // Default options for all queries
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network', // Use cache but also fetch fresh data
          errorPolicy: 'all', // Handle both network and GraphQL errors
          notifyOnNetworkStatusChange: true, // Notify on loading states
          pollInterval: 0, // Disable polling by default
        },
        query: {
          fetchPolicy: 'cache-first', // Use cache first, then network
          errorPolicy: 'all',
        },
        mutate: {
          fetchPolicy: 'no-cache', // Don't use cache for mutations
          errorPolicy: 'all',
        },
      },
    }),
  ];
}
