import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorBoundaryComponent } from './components/error-boundary/error-boundary.component';
import { SupabaseService } from './services/supabase.service';

// HeaderComponent.ngOnInit subscribes to auth state. Without this stub the real
// service builds a Supabase client from empty test env vars and throws.
const supabaseStub: Partial<SupabaseService> = {
  subscribeAuthState: async () => () => undefined,
};

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HeaderComponent, FooterComponent, ErrorBoundaryComponent, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: {} }, params: of({}), queryParams: of({}) } },
        { provide: SupabaseService, useValue: supabaseStub },
      ]
    }).compileComponents();
  });

  it(`should have the 'plans' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('plans');
  });

  it('should render the header component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
  });
});
