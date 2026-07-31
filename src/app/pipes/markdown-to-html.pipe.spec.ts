import { MarkdownToHtmlPipe } from './markdown-to-html.pipe';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

class MockDomSanitizer implements DomSanitizer {
  bypassSecurityTrustHtml(value: string): SafeHtml {
    return value as unknown as SafeHtml;
  }
  sanitize(_ctx: any, _value: any) { return null; }
  bypassSecurityTrustScript(value: string) { return value as unknown as any; }
  bypassSecurityTrustStyle(value: string) { return value as unknown as any; }
  bypassSecurityTrustUrl(value: string) { return value as unknown as any; }
  bypassSecurityTrustResourceUrl(value: string) { return value as unknown as any; }
}

describe('MarkdownToHtmlPipe', () => {
  let pipe: MarkdownToHtmlPipe;

  beforeEach(() => {
    pipe = new MarkdownToHtmlPipe(new MockDomSanitizer());
  });

  it('renders markdown to html', () => {
    const out = pipe.transform('# Title\n\nSome **bold** text.') as string;
    expect(out).toContain('<h1');
    expect(out).toContain('<strong>bold</strong>');
  });

  it('handles null and undefined', () => {
    expect(pipe.transform(null) as string).toBe('');
    expect(pipe.transform(undefined) as string).toBe('');
  });

  it('strips script tags embedded in markdown', () => {
    const out = pipe.transform('Hello\n\n<script>alert(1)</script>') as string;
    expect(out).not.toContain('<script');
    expect(out).not.toContain('alert(1)');
  });

  it('strips inline event handlers from raw html in markdown', () => {
    const out = pipe.transform('<img src="x" onerror="alert(1)">') as string;
    expect(out).not.toContain('onerror');
  });

  it('strips javascript: urls', () => {
    const out = pipe.transform('[click](javascript:alert(1))') as string;
    expect(out).not.toContain('javascript:');
  });

  it('keeps ordinary links and code blocks', () => {
    const out = pipe.transform('[site](https://example.com)\n\n`inline code`') as string;
    expect(out).toContain('href="https://example.com"');
    expect(out).toContain('<code>inline code</code>');
  });
});
