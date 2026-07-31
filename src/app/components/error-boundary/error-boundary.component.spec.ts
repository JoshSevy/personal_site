import { Component, ErrorHandler } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorBoundaryComponent } from './error-boundary.component';

@Component({
  standalone: true,
  imports: [ErrorBoundaryComponent],
  template: `<app-error-boundary [errorHandler]="handler"><p>content</p></app-error-boundary>`,
})
class HostComponent {
  handler = {} as ErrorHandler;
}

describe('ErrorBoundaryComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('projects content when there is no error', () => {
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('content');
  });

  it('shows the fallback UI when a window error fires, and recovers on Try Again', () => {
    // The window 'error' listener fires entirely outside any Angular
    // template event or signal write. Regression guard for the bug where
    // hasError/errorMessage were plain fields: under OnPush that update
    // would never schedule a re-render.
    window.dispatchEvent(new ErrorEvent('error', { message: 'boom' }));
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('boom');
    expect(text).not.toContain('content');

    const button = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('content');
  });
});
