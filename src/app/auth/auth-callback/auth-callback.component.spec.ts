import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { AuthCallbackComponent } from './auth-callback.component';
import { SupabaseService } from '../../services/supabase.service';

const activatedRouteStub: Partial<ActivatedRoute> = {
  snapshot: { queryParamMap: { get: () => null } } as unknown as ActivatedRoute['snapshot'],
};

describe('AuthCallbackComponent', () => {
  let fixture: ComponentFixture<AuthCallbackComponent>;

  async function setup(handleAuthCallback: () => Promise<{ error: { message: string } | null }>) {
    await TestBed.configureTestingModule({
      imports: [AuthCallbackComponent],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: SupabaseService, useValue: { handleAuthCallback } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthCallbackComponent);
    fixture.detectChanges();
    // ngOnInit's await resolves after this first render, matching production.
    await Promise.resolve();
    await Promise.resolve();
  }

  it('renders the error message once handleAuthCallback resolves after the initial render', async () => {
    await setup(async () => ({ error: { message: 'Invalid or expired link' } }));
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Invalid or expired link');
    expect(text).not.toContain('Signing you in');
  });

  it('stays on the signing-in message when there is no error', async () => {
    let resolveCallback: (v: { error: null }) => void;
    const pending = new Promise<{ error: null }>((resolve) => (resolveCallback = resolve));

    await TestBed.configureTestingModule({
      imports: [AuthCallbackComponent],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: SupabaseService, useValue: { handleAuthCallback: () => pending } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthCallbackComponent);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Signing you in');
    resolveCallback!({ error: null });
  });
});
