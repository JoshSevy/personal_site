import { Directive, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

// Lazy load PrismJS only when directive is used
let prismPromise: Promise<typeof import('prismjs')> | null = null;

async function loadPrism() {
  if (!prismPromise) {
    prismPromise = (async () => {
      const prism = await import('prismjs');
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
        import('prismjs/components/prism-php'),
      ]);
      return prism;
    })();
  }
  return prismPromise;
}

@Directive({
  selector: '[appHighlightCode]',
})
export class HighlightCodeDirective implements AfterViewInit, OnDestroy {
  private observer: MutationObserver | null = null;
  private highlightToken = 0;
  private highlighting = false;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const root = this.el.nativeElement;
    this.observer = new MutationObserver(() => {
      if (this.highlighting) return;
      requestAnimationFrame(() => void this.highlight(root));
    });
    void this.highlight(root);
  }

  private async highlight(root: HTMLElement): Promise<void> {
    if (this.highlighting) return;
    const token = ++this.highlightToken;
    const Prism = await loadPrism();
    if (token !== this.highlightToken) return;
    this.highlighting = true;
    this.observer?.disconnect();
    try {
      Prism.highlightAllUnder(root);
    } finally {
      this.highlighting = false;
      this.observer?.observe(root, { childList: true, subtree: true });
    }
  }

  ngOnDestroy(): void {
    this.highlightToken++;
    this.observer?.disconnect();
    this.observer = null;
  }
}
