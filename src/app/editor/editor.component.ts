import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EditorModule } from '@tinymce/tinymce-angular';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import { environment } from "../../environments/environment";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'], // Optional for specific styling
  imports: [ EditorModule, FormsModule ]
})
export class EditorComponent {
  @Input() content: string = ''; // The content of the editor
  @Output() contentChange = new EventEmitter<string>(); // Emit updated content to the parent component
  protected mdcKey= environment.mdcKey;

  editorConfig = {
    height: 500,
    menubar: 'insert',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
      'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'codesample'
    ],
    toolbar:
      'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | codesample image | removeformat | help',
    codesample_languages: [
      { text: 'HTML/XML', value: 'markup' },
      { text: 'JavaScript', value: 'javascript' },
      { text: 'TypeScript', value: 'typescript' },
      { text: 'CSS', value: 'css' },
      { text: 'Python', value: 'python' },
      { text: 'Java', value: 'java' },
      { text: 'C', value: 'c' },
      { text: 'C#', value: 'csharp' },
      { text: 'PHP', value: 'php' },
    ],
    setup: (editor: any) => {
      editor.on('init', () => {
        editor.contentDocument.querySelectorAll('pre code').forEach((block: HTMLElement) => {
          Prism.highlightElement(block);
        });
      });
      editor.on('SetContent', () => {
        editor.contentDocument.querySelectorAll('pre code').forEach((block: HTMLElement) => {
          Prism.highlightElement(block);
        });
      });
    }
  };

  handleContentChange(updatedContent: string) {
    this.contentChange.emit(updatedContent); // Emit updated content to the parent
  }
}
