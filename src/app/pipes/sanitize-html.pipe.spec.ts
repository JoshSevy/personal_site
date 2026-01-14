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
  it('create an instance', () => {
    const pipe = new SanitizeHtmlPipe(new MockDomSanitizer());
    expect(pipe).toBeTruthy();
  });
});
