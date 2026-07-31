import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, map } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { GetGithubStatsDocument, GQLGetGithubStatsQuery } from '../graphql/generated';

const GITHUB_USERNAME = 'JoshSevy';

interface GithubLanguage {
  name: string;
  repoCount: number;
  /** Width of the bar, relative to the most-used language. */
  share: number;
}

interface GithubStats {
  publicRepos: number;
  sourceRepos: number;
  memberSince: string;
  topLanguages: GithubLanguage[];
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
})
export class ResumeComponent implements OnInit {
  private readonly apollo = inject(Apollo);

  /** `null` while loading, `undefined` once we know it failed. */
  readonly stats = signal<GithubStats | null | undefined>(null);
  readonly loading = computed(() => this.stats() === null);

  ngOnInit(): void {
    this.apollo
      .query<GQLGetGithubStatsQuery>({
        query: GetGithubStatsDocument,
        variables: { username: GITHUB_USERNAME },
        // The shared InMemoryCache is configured in a way that makes the
        // cache-first default resolve to null without fetching, so every query
        // in this app sets a policy explicitly. The backend caches for an
        // hour, so going to the network here is cheap.
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result) => result.data?.githubStats),
        // The section is supplementary, so a GitHub outage should hide it
        // rather than leave the page stuck on a loading message.
        catchError((err) => {
          console.error('Failed to load GitHub stats', err);
          this.stats.set(undefined);
          return EMPTY;
        }),
      )
      .subscribe((data) => {
        if (!data) {
          this.stats.set(undefined);
          return;
        }
        const max = Math.max(...data.topLanguages.map((l) => l.repoCount), 1);
        this.stats.set({
          publicRepos: data.publicRepos,
          sourceRepos: data.sourceRepos,
          memberSince: data.memberSince,
          topLanguages: data.topLanguages.map((l) => ({
            name: l.name,
            repoCount: l.repoCount,
            share: Math.round((l.repoCount / max) * 100),
          })),
        });
      });
  }
}
