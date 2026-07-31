import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

@Pipe({
  name: 'sanitizeHtml',
})
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    // Used for the GitHub trophies embed, which returns raw SVG markup.
    const clean = DOMPurify.sanitize(value, { USE_PROFILES: { svg: true, html: true } });
    return this.sanitizer.bypassSecurityTrustHtml(clean);
  }
}
