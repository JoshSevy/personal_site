import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HeaderComponent } from './header.component';
import { SupabaseService } from '../services/supabase.service';

type AuthCallback = (signedIn: boolean, user: { app_metadata?: Record<string, unknown> } | null) => void;

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let fireAuthChange: AuthCallback = () => undefined;

  async function setup() {
    const supabaseStub: Partial<SupabaseService> = {
      getUser: async () => ({ data: { user: null } }),
      signOut: async () => ({ error: null }),
      subscribeAuthState: async (cb: AuthCallback) => {
        fireAuthChange = cb;
        return () => undefined;
      },
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [{ provide: SupabaseService, useValue: supabaseStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // subscribeAuthState is awaited inside ngOnInit before capturing the
    // callback, so let that microtask resolve before firing it.
    await Promise.resolve();
  }

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it('renders the logout button and admin link once auth state fires signed-in + admin', async () => {
    await setup();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).not.toContain('Logout');

    // This callback runs entirely outside any template event or signal write,
    // it's Supabase's own listener. Regression guard for the bug where these
    // were plain fields: under OnPush a plain-field write here would update
    // the component's state but never schedule a re-render.
    fireAuthChange(true, { app_metadata: { blog_admin: true } });
    fixture.detectChanges();

    const updated = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(updated).toContain('Logout');
    expect(updated).toContain('Admin');
  });

  it('hides the logout button again after logging out', async () => {
    await setup();
    fireAuthChange(true, { app_metadata: {} });
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Logout');

    await component.logout();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Logout');
  });

  it('toggles the mobile menu', async () => {
    await setup();
    expect(component.mobileMenuOpen()).toBe(false);
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBe(true);
    component.closeMobileMenu();
    expect(component.mobileMenuOpen()).toBe(false);
  });
});
