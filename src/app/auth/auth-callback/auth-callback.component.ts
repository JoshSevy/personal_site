import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-md mx-auto mt-20 p-6 bg-black rounded-lg shadow-md">
      <h2 class="text-xl font-bold text-center mb-2">
        <ng-container *ngIf="!error; else errorTpl">Signing you in…</ng-container>
      </h2>
      <p class="text-sm text-center opacity-80" *ngIf="!error">
        You can close this tab if it doesn’t redirect automatically.
      </p>

      <ng-template #errorTpl>
        <div class="text-red-500 font-semibold mb-2">Authentication Error</div>
        <p class="text-sm text-gray-300 mb-4">{{ error }}</p>
        <button (click)="goToLogin()" class="px-4 py-2 bg-blue-600 rounded">Return to Login</button>
      </ng-template>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  error = '';

  constructor(
    private readonly supabase: SupabaseService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
  }

  async ngOnInit() {
    const { error } = await this.supabase.handleAuthCallback();

    if (error) {
      console.error('Callback auth error:', error);
      this.error = error.message || 'Failed to complete sign-in.';
      return;
    }

    const next = this.route.snapshot.queryParamMap.get('next') || '/admin';
    await this.router.navigateByUrl(next);
  }

  goToLogin() {
    void this.router.navigate(['/login']);
  }
}
