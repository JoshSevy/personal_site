import { inject } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache, TypePolicy, FieldPolicy } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { SupabaseService } from '../services/supabase.service';

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
        merge(existing: any = null, incoming: any) {
          return incoming;
        },
        read(existing: any = null) {
          return existing;
        }
      } as FieldPolicy,
      postBySlug: {
        merge(existing: any = null, incoming: any) {
          return incoming;
        },
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
    HttpLink,
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const supabase = inject(SupabaseService);

      const authLink = setContext(async (_, prev) => {
        const headers = { ...(prev['headers'] as Record<string, string> | undefined) };
        const { data } = await supabase.getSession();
        const token = data?.session?.access_token;
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        return { headers };
      });

      const http = httpLink.create({ uri: 'https://api.joshuasevy.com/graphql' });

      return {
        link: ApolloLink.from([authLink, http]),
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
      };
    }),
  ];
}
