import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownToHtmlPipe } from '../pipes/markdown-to-html.pipe';

@Component({
  selector: 'app-markdown-editor',
  standalone: true,
  imports: [FormsModule, MarkdownToHtmlPipe],
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss'],
})
export class MarkdownEditorComponent {
  @Input() content = '';
  @Output() contentChange = new EventEmitter<string>();
}
