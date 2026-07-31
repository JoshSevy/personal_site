import { Component, HostListener, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

const STORAGE_KEY = 'lightning-tap-best-ms';

type Phase = 'intro' | 'waiting' | 'go' | 'result' | 'early';

@Component({
  selector: 'app-reaction-game',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reaction-game.component.html',
  styleUrl: './reaction-game.component.scss',
})
export class ReactionGameComponent implements OnDestroy {
  readonly phase = signal<Phase>('intro');
  readonly lastMs = signal<number | null>(null);
  readonly bestMs = signal<number | null>(null);
  readonly hint = signal('');

  private timerId: ReturnType<typeof setTimeout> | null = null;
  private goAt = 0;

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      const n = raw ? parseInt(raw, 10) : NaN;
      this.bestMs.set(Number.isFinite(n) ? n : null);
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.timerId != null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  startRound(): void {
    this.clearTimer();
    this.lastMs.set(null);
    this.phase.set('waiting');
    this.hint.set('Wait for green…');
    const delay = 900 + Math.random() * 2200;
    this.timerId = setTimeout(() => {
      this.timerId = null;
      this.phase.set('go');
      this.goAt = performance.now();
      this.hint.set('Tap now!');
    }, delay);
  }

  @HostListener('document:keydown', ['$event'])
  onDocKey(ev: KeyboardEvent): void {
    if (ev.code === 'Space' || ev.code === 'Enter') {
      ev.preventDefault();
      this.onTap();
    }
  }

  onTap(): void {
    const p = this.phase();
    if (p === 'intro' || p === 'result' || p === 'early') {
      this.startRound();
      return;
    }
    if (p === 'waiting') {
      this.clearTimer();
      this.phase.set('early');
      this.hint.set('Too soon! Tap to try again.');
      return;
    }
    if (p === 'go') {
      const ms = Math.round(performance.now() - this.goAt);
      this.lastMs.set(ms);
      this.phase.set('result');
      this.hint.set('Tap to play again');
      const prev = this.bestMs();
      if (prev == null || ms < prev) {
        this.bestMs.set(ms);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, String(ms));
        }
      }
    }
  }

}
