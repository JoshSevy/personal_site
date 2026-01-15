import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div class="max-w-md mx-auto mt-20 p-6 bg-black rounded-lg shadow-md">
      <h2 class="text-xl font-bold text-center mb-2">Signing you in…</h2>
      <p class="text-sm text-center opacity-80">You can close this tab if it doesn’t redirect automatically.</p>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
  }

  async ngOnInit() {
    // For PKCE flows, Supabase may need to exchange the URL code for a session.
    // If it isn't needed, this should be a no-op.
    await this.supabase.maybeExchangeCodeForSession();

    const next = this.route.snapshot.queryParamMap.get('next') || '/admin';
    await this.router.navigateByUrl(next);
  }
}

