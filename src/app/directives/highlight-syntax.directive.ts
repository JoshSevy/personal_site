import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import Prism from 'prismjs';

@Directive({
  selector: '[appHighlightCode]',
})
export class HighlightCodeDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    Prism.highlightAllUnder(this.el.nativeElement);
  }
}
