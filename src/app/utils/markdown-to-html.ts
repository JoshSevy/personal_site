import { marked } from 'marked';

marked.use({
  gfm: true,
  breaks: true,
});

/**
 * Renders Markdown to HTML. If the string already looks like HTML (legacy TinyMCE posts), returns as-is.
 */
export function markdownToHtmlString(raw: string): string {
  const t = raw?.trim() ?? '';
  if (t.startsWith('<')) {
    return raw;
  }
  return marked.parse(raw, { async: false }) as string;
}
