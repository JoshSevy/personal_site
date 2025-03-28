import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private imageCache = new Map<string, string>();
  private loadingImages = new Set<string>();
  private imageLoadSubject = new BehaviorSubject<number>(0);

  constructor() {
    // Initialize service worker for caching if available
    if ('serviceWorker' in navigator) {
      this.initializeServiceWorker();
    }
  }

  /**
   * Preloads an image and caches it
   */
  preloadImage(url: string): Observable<boolean> {
    return new Observable(subscriber => {
      if (this.imageCache.has(url)) {
        subscriber.next(true);
        subscriber.complete();
        return;
      }

      if (this.loadingImages.has(url)) {
        subscriber.next(false);
        subscriber.complete();
        return;
      }

      this.loadingImages.add(url);
      const img = new Image();
      
      img.onload = () => {
        this.imageCache.set(url, url);
        this.loadingImages.delete(url);
        this.imageLoadSubject.next(this.imageLoadSubject.value + 1);
        subscriber.next(true);
        subscriber.complete();
      };

      img.onerror = () => {
        this.loadingImages.delete(url);
        subscriber.next(false);
        subscriber.complete();
      };

      img.src = url;
    });
  }

  /**
   * Gets a cached image URL
   */
  getCachedImage(url: string): string | undefined {
    return this.imageCache.get(url);
  }

  /**
   * Clears the image cache
   */
  clearImageCache(): void {
    this.imageCache.clear();
    this.loadingImages.clear();
    this.imageLoadSubject.next(0);
  }

  /**
   * Gets the number of images currently loading
   */
  getLoadingImagesCount(): Observable<number> {
    return this.imageLoadSubject.asObservable();
  }

  /**
   * Initializes the service worker for caching
   */
  private async initializeServiceWorker(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('ServiceWorker registration successful');
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  }

  /**
   * Measures and reports performance metrics
   */
  reportPerformanceMetrics(): void {
    if ('performance' in window) {
      const performance = window.performance as Performance;
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');

      const metrics = {
        // Navigation timing
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnection: navigation.connectEnd - navigation.connectStart,
        serverResponse: navigation.responseEnd - navigation.requestStart,
        domLoad: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        fullPageLoad: navigation.loadEventEnd - navigation.navigationStart,

        // Paint timing
        firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
        firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,

        // Resource timing
        resources: performance.getEntriesByType('resource').map(resource => ({
          name: resource.name,
          duration: resource.duration,
          size: (resource as PerformanceResourceTiming).transferSize
        }))
      };

      // Send metrics to your analytics service
      console.log('Performance metrics:', metrics);
    }
  }
} 