import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-unsubscribe',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss'],
})
export class UnsubscribeComponent {
  email = '';

  readonly submitting = signal(false);
  readonly done = signal(false);
  readonly errorMessage = signal('');

  constructor(private readonly supabase: SupabaseService) {}

  async onUnsubscribe() {
    const email = this.email.trim();
    if (!email) {
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    const { error } = await this.supabase.unsubscribeEmail(email);

    this.submitting.set(false);
    if (error) {
      this.errorMessage.set('Something went wrong. Please try again.');
      return;
    }
    this.done.set(true);
  }
}
