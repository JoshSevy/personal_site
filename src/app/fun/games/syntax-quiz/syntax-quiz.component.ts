import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';
import type { SyntaxChallenge, SyntaxChallengeSubmit } from '../../../models/syntax-challenge.model';

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
  imports: [RouterLink, FormsModule],
  templateUrl: './syntax-quiz.component.html',
  styleUrl: './syntax-quiz.component.scss',
})
export class SyntaxQuizComponent implements OnInit, OnDestroy {
  private readonly supabase = inject(SupabaseService);
  private authUnsubscribe: (() => void) | null = null;

  readonly loadError = signal<string | null>(null);
  readonly loading = signal(true);
  readonly deck = signal<SyntaxChallenge[]>([]);
  readonly index = signal(0);
  readonly score = signal(0);
  readonly streak = signal(0);
  readonly picked = signal<number | null>(null);
  readonly showResult = signal(false);
  readonly canSubmit = signal(false);
  readonly submitMessage = signal<string | null>(null);
  readonly submitBusy = signal(false);

  submitForm: SyntaxChallengeSubmit = {
    language: '',
    question: '',
    code: '',
    choices: ['', '', '', ''],
    correct_index: 0,
    explanation: '',
  };

  async ngOnInit(): Promise<void> {
    void this.refreshSubmitGate();
    void this.supabase.subscribeAuthState((signedIn) => this.canSubmit.set(signedIn)).then((u) => {
      this.authUnsubscribe = u;
    });
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
      this.loadError.set('No challenges yet. Add rows in Supabase or submit one below (sign in required).');
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

  async refreshSubmitGate(): Promise<void> {
    const { data } = await this.supabase.getSession();
    this.canSubmit.set(!!data?.session);
  }

  async onSubmitForm(): Promise<void> {
    this.submitMessage.set(null);
    const ch = this.submitForm.choices.map((c) => c.trim());
    if (ch.length !== 4 || ch.some((c) => !c)) {
      this.submitMessage.set('Fill all four answer choices.');
      return;
    }
    if (this.submitForm.correct_index < 0 || this.submitForm.correct_index > 3) {
      this.submitMessage.set('Pick which choice is correct (1–4).');
      return;
    }
    const payload: SyntaxChallengeSubmit = {
      language: this.submitForm.language,
      question: this.submitForm.question,
      code: this.submitForm.code,
      choices: ch,
      correct_index: this.submitForm.correct_index,
      explanation: (this.submitForm.explanation ?? '').trim(),
    };
    if (!payload.language.trim() || !payload.question.trim() || !payload.code.trim()) {
      this.submitMessage.set('Language, question, and code are required.');
      return;
    }
    this.submitBusy.set(true);
    const { error } = await this.supabase.submitSyntaxChallenge(payload);
    this.submitBusy.set(false);
    if (error) {
      this.submitMessage.set(error.message);
      return;
    }
    this.submitMessage.set('Thanks! Your challenge is live for everyone.');
    this.submitForm = {
      language: '',
      question: '',
      code: '',
      choices: ['', '', '', ''],
      correct_index: 0,
      explanation: '',
    };
    await this.reloadDeck();
  }

  private async reloadDeck(): Promise<void> {
    const { data, error } = await this.supabase.fetchSyntaxChallenges();
    if (!error && data?.length) {
      this.deck.set(shuffle(data));
      this.index.set(0);
      this.loadError.set(null);
    }
  }

  ngOnDestroy(): void {
    this.authUnsubscribe?.();
  }
}
