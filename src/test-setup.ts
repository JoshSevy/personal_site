import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

// Vitest runs each spec against a shared environment; without this every
// TestBed.configureTestingModule call throws "Need to call
// TestBed.initTestEnvironment() first".
//
// Angular 22 is zoneless by default, matching app.config.ts, so no extra
// change detection provider is needed here. Deliberately avoids declaring a
// decorated @NgModule: the v22 toolchain lowers decorators to
// @oxc-project/runtime helpers, which are not installed.
TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
