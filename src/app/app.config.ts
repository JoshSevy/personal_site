import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, TypePolicy, FieldPolicy } from '@apollo/client/core';

import { routes } from './app.routes';

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

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({ uri: 'https://api.joshuasevy.com/graphql' }),
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }),
  ],
};
