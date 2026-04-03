import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { markdownToHtmlString } from '../utils/markdown-to-html';

@Pipe({
  name: 'markdownToHtml',
  standalone: true,
})
export class MarkdownToHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    const html = markdownToHtmlString(value ?? '');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
