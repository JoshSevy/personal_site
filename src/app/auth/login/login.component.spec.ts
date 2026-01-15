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

  it('sends a magic link when email is provided', async () => {
    component.email = 'test@example.com';

    await component.sendMagicLink();

    const supabase = TestBed.inject(SupabaseService) as any;
    expect(supabase.signInWithMagicLink).toHaveBeenCalled();
    expect(component.infoMessage).toContain('Magic link sent');
  });
});
