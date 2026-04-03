import { marked } from 'marked';

marked.use({
  gfm: true,
  breaks: true,
});

const LEGACY_HTML_ROOT_TAGS = new Set([
  'p',
  'div',
  'article',
  'section',
  'main',
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'blockquote',
  'pre',
  'table',
  'thead',
  'tbody',
  'tr',
  'td',
  'th',
  'figure',
  'figcaption',
  'img',
  'br',
  'hr',
  'header',
  'footer',
  'nav',
  'aside',
  'strong',
  'em',
  'b',
  'i',
  'a',
  'code',
]);

/**
 * Normalize text from APIs / Windows editors so `marked` sees consistent newlines.
 */
export function normalizeMarkdownSource(raw: string): string {
  return (raw ?? '')
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

/**
 * Legacy TinyMCE-style posts stored raw HTML. Must not treat GFM autolinks
 * (`<https://...>`, `<mailto:...>`) as HTML or they render incorrectly.
 */
export function looksLikeLegacyHtmlBlock(source: string): boolean {
  const t = source.trim();
  if (!t.startsWith('<')) return false;
  if (/^<(https?:\/\/|mailto:)/i.test(t)) return false;

  if (/^<(!DOCTYPE|html)\b/i.test(t)) return true;

  const m = t.match(/^<\/?([a-z][a-z0-9]*)\b/i);
  if (!m) return false;
  return LEGACY_HTML_ROOT_TAGS.has(m[1]!.toLowerCase());
}

/**
 * Renders Markdown to HTML. If the string already looks like HTML (legacy TinyMCE posts), returns as-is.
 */
export function markdownToHtmlString(raw: string): string {
  const normalized = normalizeMarkdownSource(raw);
  if (looksLikeLegacyHtmlBlock(normalized)) {
    return normalized;
  }
  return marked.parse(normalized, { async: false }) as string;
}
