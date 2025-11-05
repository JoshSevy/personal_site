import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EditorModule } from '@tinymce/tinymce-angular';
import { environment } from "../../environments/environment";
import { FormsModule } from '@angular/forms';

// Dynamically import PrismJS only when needed
let prismPromise: Promise<typeof import('prismjs')> | null = null;

async function loadPrism() {
  if (!prismPromise) {
    prismPromise = (async () => {
      const prism = await import('prismjs');
      // Load only the languages we need for the editor (side-effect imports)
      await Promise.all([
        // @ts-expect-error - PrismJS component modules don't have type definitions
        import('prismjs/components/prism-typescript'),
        // @ts-expect-error
        import('prismjs/components/prism-javascript'),
        // @ts-expect-error
        import('prismjs/components/prism-css'),
        // @ts-expect-error
        import('prismjs/components/prism-python')
      ]);
      return prism;
    })();
  }
  return prismPromise;
}

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
      const highlightCode = async () => {
        const Prism = await loadPrism();
        editor.contentDocument.querySelectorAll('pre code').forEach((block: HTMLElement) => {
          Prism.highlightElement(block);
        });
      };
      
      editor.on('init', () => {
        void highlightCode();
      });
      editor.on('SetContent', () => {
        void highlightCode();
      });
    }
  };

  handleContentChange(updatedContent: string) {
    this.contentChange.emit(updatedContent); // Emit updated content to the parent
  }
}
