import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FUN_GAMES } from './fun-games';

@Component({
  selector: 'app-fun-hub',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './fun-hub.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './fun-hub.component.scss',
})
export class FunHubComponent {
  readonly games = FUN_GAMES;
}
