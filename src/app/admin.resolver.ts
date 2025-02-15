import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminResolver implements Resolve<boolean> {
  constructor() {}

  resolve(): Observable<boolean> {
    // Add any logic you need to resolve before loading the page
    console.log('Resolving admin page dependencies...');
    // Simulate preloading resources (e.g., ensuring styles or data)
    return of(true);
  }
}
