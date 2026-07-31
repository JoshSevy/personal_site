import { NgModule, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

/**
 * The app runs zoneless (see app.config.ts) and zone.js is not a dependency,
 * so the TestBed needs the same change detection provider or it falls back to
 * NgZone and fails to bootstrap.
 */
@NgModule({
  providers: [provideZonelessChangeDetection()],
})
export class ZonelessTestingModule {}

// Vitest runs each spec against a shared environment; without this every
// TestBed.configureTestingModule call throws "Need to call
// TestBed.initTestEnvironment() first".
TestBed.initTestEnvironment(
  [BrowserTestingModule, ZonelessTestingModule],
  platformBrowserTesting(),
);
