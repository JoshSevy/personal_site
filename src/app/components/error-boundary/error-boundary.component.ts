import { Component, ErrorHandler, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-boundary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="!hasError(); else errorTemplate">
      <ng-content></ng-content>
    </ng-container>

    <ng-template #errorTemplate>
      <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
            <p class="text-gray-600 mb-6">{{ errorMessage() }}</p>
            <button
              (click)="resetError()"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </ng-template>
  `
})
export class ErrorBoundaryComponent implements OnInit {
  @Input() errorHandler?: ErrorHandler;
  readonly hasError = signal(false);
  readonly errorMessage = signal('An unexpected error occurred.');

  ngOnInit() {
    if (this.errorHandler) {
      // This listener fires from the raw DOM error event, entirely outside
      // Angular's own event/signal notification path, so these have to be
      // signals or an OnPush component would never show the fallback UI.
      window.addEventListener('error', (event) => {
        this.hasError.set(true);
        this.errorMessage.set(event.message || 'An unexpected error occurred.');
      });
    }
  }

  resetError() {
    this.hasError.set(false);
    this.errorMessage.set('An unexpected error occurred.');
  }
} 