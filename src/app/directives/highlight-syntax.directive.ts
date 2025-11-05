import { Directive, ElementRef, AfterViewInit } from '@angular/core';

// Lazy load PrismJS only when directive is used
let prismPromise: Promise<typeof import('prismjs')> | null = null;

async function loadPrism() {
  if (!prismPromise) {
    prismPromise = (async () => {
      const prism = await import('prismjs');
      // Load common languages dynamically based on what's needed (side-effect imports)
      await Promise.all([
        // @ts-expect-error - PrismJS component modules don't have type definitions
        import('prismjs/components/prism-typescript'),
        // @ts-expect-error
        import('prismjs/components/prism-javascript'),
        // @ts-expect-error
        import('prismjs/components/prism-css'),
        // @ts-expect-error
        import('prismjs/components/prism-python'),
        // @ts-expect-error
        import('prismjs/components/prism-markup'),
        // @ts-expect-error
        import('prismjs/components/prism-java'),
        // @ts-expect-error
        import('prismjs/components/prism-c'),
        // @ts-expect-error
        import('prismjs/components/prism-csharp'),
        // @ts-expect-error
        import('prismjs/components/prism-php')
      ]);
      return prism;
    })();
  }
  return prismPromise;
}

@Directive({
  selector: '[appHighlightCode]',
})
export class HighlightCodeDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  async ngAfterViewInit() {
    const Prism = await loadPrism();
    Prism.highlightAllUnder(this.el.nativeElement);
  }
}
