import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

class MockDomSanitizer implements DomSanitizer {
  bypassSecurityTrustHtml(value: string): SafeHtml {
    return value as unknown as SafeHtml;
  }
  // Other methods not used in this test can throw or return dummy values
  sanitize(_ctx: any, _value: any) { return null; }
  // following methods added to satisfy the interface, not used here
  bypassSecurityTrustScript(value: string) { return value as unknown as any; }
  bypassSecurityTrustStyle(value: string) { return value as unknown as any; }
  bypassSecurityTrustUrl(value: string) { return value as unknown as any; }
  bypassSecurityTrustResourceUrl(value: string) { return value as unknown as any; }
}

describe('SanitizeHtmlPipe', () => {
  let pipe: SanitizeHtmlPipe;

  beforeEach(() => {
    pipe = new SanitizeHtmlPipe(new MockDomSanitizer());
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('strips script tags', () => {
    const out = pipe.transform('<p>hi</p><script>alert(1)</script>') as string;
    expect(out).not.toContain('<script');
    expect(out).not.toContain('alert(1)');
    expect(out).toContain('<p>hi</p>');
  });

  it('strips inline event handlers', () => {
    const out = pipe.transform('<img src="x" onerror="alert(1)">') as string;
    expect(out).not.toContain('onerror');
  });

  it('keeps svg markup, which the GitHub trophies embed relies on', () => {
    const out = pipe.transform('<svg><rect width="10" height="10"></rect></svg>') as string;
    expect(out).toContain('<svg');
    expect(out).toContain('<rect');
  });
});
