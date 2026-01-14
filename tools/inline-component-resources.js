#!/usr/bin/env node
// Inline external component templates and styles so Vitest's TestBed can load them
// without needing the Angular CLI resource loader.

const fs = require('fs').promises;
const path = require('path');

const SRC = path.resolve(__dirname, '..', 'src');
const OUT = path.resolve(__dirname, '..', '.vitest-src', 'src');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function escapeBackticks(s) {
  return s.replace(/`/g, '\\`').replace(/\${/g, '\\${');
}

async function processFile(srcPath, outPath) {
  const rel = path.relative(SRC, srcPath);
  const content = await fs.readFile(srcPath, 'utf8');
  if (srcPath.endsWith('.component.ts')) {
    let replaced = content;
    // templateUrl
    const templateUrlMatch = content.match(/templateUrl\s*:\s*["'`](.+?)["'`]/);
    if (templateUrlMatch) {
      const tplRel = templateUrlMatch[1];
      const tplPath = path.resolve(path.dirname(srcPath), tplRel);
      try {
        const tpl = await fs.readFile(tplPath, 'utf8');
        const escaped = escapeBackticks(tpl);
        replaced = replaced.replace(/templateUrl\s*:\s*["'`].+?["'`]/, `template: ` + "`" + escaped + "`");
      } catch (e) {
        console.warn(`Warning: failed to inline template ${tplPath} for ${rel}: ${e.message}`);
      }
    }
    // styleUrls (array)
    const styleUrlsMatch = content.match(/styleUrls\s*:\s*\[([^\]]*)\]/);
    if (styleUrlsMatch) {
      const inside = styleUrlsMatch[1];
      // find all quoted paths
      const paths = Array.from(inside.matchAll(/["'`](.+?)["'`]/g)).map(m => m[1]);
      const stylesArray = [];
      for (const s of paths) {
        const stylePath = path.resolve(path.dirname(srcPath), s);
        try {
          const st = await fs.readFile(stylePath, 'utf8');
          stylesArray.push('`' + escapeBackticks(st) + '`');
        } catch (e) {
          console.warn(`Warning: failed to inline style ${stylePath} for ${rel}: ${e.message}`);
        }
      }
      if (stylesArray.length > 0) {
        replaced = replaced.replace(/styleUrls\s*:\s*\[[^\]]*\]/, `styles: [${stylesArray.join(',')}]`);
      }
    }

    await ensureDir(path.dirname(outPath));
    await fs.writeFile(outPath, replaced, 'utf8');
  } else {
    // copy as-is
    await ensureDir(path.dirname(outPath));
    await fs.copyFile(srcPath, outPath);
  }
}

async function walkDir(src, out) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const e of entries) {
    const srcPath = path.join(src, e.name);
    const outPath = path.join(out, e.name);
    if (e.isDirectory()) {
      await walkDir(srcPath, outPath);
    } else if (e.isFile()) {
      await processFile(srcPath, outPath);
    }
  }
}

async function main() {
  try {
    // remove existing .vitest-src if exists
    await fs.rm(path.resolve(__dirname, '..', '.vitest-src'), { recursive: true, force: true });
  } catch (e) {}
  try {
    await walkDir(SRC, OUT);
    console.log('Generated inlined sources in .vitest-src/src');
  } catch (e) {
    console.error('Failed to generate inlined sources:', e);
    process.exit(1);
  }
}

main();

