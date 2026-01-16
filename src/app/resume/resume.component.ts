
import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SanitizeHtmlPipe } from '../pipes/sanitize-html.pipe';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [AsyncPipe, SanitizeHtmlPipe],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
  trophies$: Observable<any> | undefined;

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.trophies$ = this.getGithubTrophies("JoshSevy");
  }

  private getGithubTrophies(username: string): Observable<any> {
    const query = gql`
      query GetGithubTrophies($username: String!) {
        trophies(username: $username)
      }
    `;

    return this.apollo
      .watchQuery({
        query,
        variables: { username },
      })
      .valueChanges.pipe(
        map((result: any) => result.data.trophies)
      );
  }
}
