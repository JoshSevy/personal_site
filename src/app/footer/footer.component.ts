import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [
    RouterLink,
    FormsModule,
  ],
})
export class FooterComponent {
  subscribeEmail = '';

  readonly subscribing = signal(false);
  readonly subscribed = signal(false);
  readonly subscribeError = signal('');

  constructor(private readonly supabase: SupabaseService) {}

  async onSubscribe() {
    const email = this.subscribeEmail.trim();
    if (!email) {
      return;
    }

    this.subscribing.set(true);
    this.subscribeError.set('');

    const { error } = await this.supabase.subscribeToNewsletter(email);

    this.subscribing.set(false);
    if (error) {
      this.subscribeError.set('Something went wrong. Please try again.');
      return;
    }
    this.subscribed.set(true);
    this.subscribeEmail = '';
  }
}
