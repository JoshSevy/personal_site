import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { SanitizeHtmlPipe } from '../pipes/sanitize-html.pipe';

const GET_TROPHIES = gql`
  query GetTrophies($username: String!) {
    trophies(username: $username)
  }
`;

@Component({
  selector: 'app-resume',
  imports: [
    AsyncPipe,
    SanitizeHtmlPipe,
    NgIf
  ],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css'
})
export class ResumeComponent implements OnInit {
  trophies$: Observable<any> | undefined;

  constructor(private apollo: Apollo) {
  }

  ngOnInit() {
    this.trophies$ = this.getGithubTrophies("JoshSevy");
  }

  getGithubTrophies(username: string) {
    return this.apollo.watchQuery<{ trophies: string }>({
      query: GET_TROPHIES,
      variables: { username },
    }).valueChanges.pipe(
      map(result => result.data.trophies) // Map directly to trophies
    );
  }
}
