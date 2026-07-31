import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';
import type { SyntaxChallenge } from '../../../models/syntax-challenge.model';

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

@Component({
  selector: 'app-syntax-quiz',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './syntax-quiz.component.html',
  styleUrl: './syntax-quiz.component.scss',
})
export class SyntaxQuizComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);

  readonly loadError = signal<string | null>(null);
  readonly loading = signal(true);
  readonly deck = signal<SyntaxChallenge[]>([]);
  readonly index = signal(0);
  readonly score = signal(0);
  readonly streak = signal(0);
  readonly picked = signal<number | null>(null);
  readonly showResult = signal(false);

  async ngOnInit(): Promise<void> {
    const { data, error } = await this.supabase.fetchSyntaxChallenges();
    this.loading.set(false);
    if (error) {
      const msg = error.message;
      const permission =
        /permission denied|42501/i.test(msg) ||
        msg.toLowerCase().includes('row-level security');
      this.loadError.set(
        msg.includes('relation') || msg.includes('does not exist')
          ? 'The syntax_challenges table is not set up yet. Run tools/supabase-syntax-challenges.sql in the Supabase SQL editor.'
          : permission
            ? 'Database blocked reading syntax_challenges. In the Supabase SQL editor, run the GRANT lines (and policies) from tools/supabase-syntax-challenges.sql.'
            : msg,
      );
      return;
    }
    if (!data?.length) {
      this.loadError.set('No challenges yet. Add rows in the Supabase SQL editor or dashboard.');
      return;
    }
    this.deck.set(shuffle(data));
  }

  current(): SyntaxChallenge | null {
    const d = this.deck();
    const i = this.index();
    return d[i] ?? null;
  }

  pick(i: number): void {
    if (this.showResult()) return;
    const c = this.current();
    if (!c) return;
    this.picked.set(i);
    this.showResult.set(true);
    if (i === c.correct_index) {
      this.score.update((s) => s + 1 + Math.min(2, this.streak()));
      this.streak.update((n) => n + 1);
    } else {
      this.streak.set(0);
    }
  }

  next(): void {
    this.picked.set(null);
    this.showResult.set(false);
    const d = this.deck();
    const i = this.index() + 1;
    if (i >= d.length) {
      this.deck.set(shuffle(d));
      this.index.set(0);
    } else {
      this.index.set(i);
    }
  }

  restartDeck(): void {
    const d = this.deck();
    if (!d.length) return;
    this.deck.set(shuffle([...d]));
    this.index.set(0);
    this.picked.set(null);
    this.showResult.set(false);
  }
}
