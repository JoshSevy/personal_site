import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { vi } from 'vitest';

import { LoginComponent } from './login.component';
import { SupabaseService } from '../../services/supabase.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            navigateByUrl: vi.fn().mockResolvedValue(true),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => (key === 'returnUrl' ? '/admin' : null),
              },
            },
          },
        },
        {
          provide: SupabaseService,
          useValue: {
            signInWithPassword: vi.fn().mockResolvedValue({ data: { session: {} }, error: null }),
            signInWithMagicLink: vi.fn().mockResolvedValue({ data: {}, error: null }),
            signInWithGoogle: vi.fn().mockResolvedValue({ data: {}, error: null }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('logs in with email/password and navigates to returnUrl', async () => {
    component.email = 'test@example.com';
    component.password = 'pw';

    await component.login();

    const supabase = TestBed.inject(SupabaseService) as any;
    const router = TestBed.inject(Router) as any;

    expect(supabase.signInWithPassword).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin');
  });

  it('renders the error message in the DOM after a failed login', async () => {
    const supabase = TestBed.inject(SupabaseService) as any;
    supabase.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid credentials' },
    });

    component.email = 'test@example.com';
    component.password = 'wrong';
    // login() resolves the error after an await, outside the click handler's
    // synchronous window. Regression guard for the bug where errorMessage was
    // a plain field: under OnPush that write would never reach the DOM.
    await component.login();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Invalid credentials');
    expect(component.loading()).toBe(false);
  });

  // Magic link intentionally disabled for this site.
});
