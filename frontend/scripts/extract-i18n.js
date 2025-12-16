#!/usr/bin/env node
// Simple extractor using @babel/parser and @babel/traverse
import fs from 'fs-extra';
import { sync as globSync } from 'glob';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
const traverseFn = traverseModule.default || traverseModule;
import path from 'path';

const SRC = process.argv.includes('--src')
  ? process.argv[process.argv.indexOf('--src') + 1]
  : 'src';
const OUT = process.argv.includes('--out')
  ? process.argv[process.argv.indexOf('--out') + 1]
  : 'src/locales';
const LANGS = (
  process.argv.includes('--langs') ? process.argv[process.argv.indexOf('--langs') + 1] : 'de,en'
).split(',');
const NS = process.argv.includes('--ns')
  ? process.argv[process.argv.indexOf('--ns') + 1]
  : 'landing';

console.log(
  `Scanning ${SRC} -> extracting strings into ${OUT} for ${LANGS.join(', ')} (ns: ${NS})`
);

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[\s_/\\]+/g, '.')
    .replace(/[^a-z0-9.]/g, '')
    .replace(/\.{2,}/g, '.');
}

const files = globSync(`${SRC}/**/*.{ts,tsx,js,jsx}`);
const found = {};

files.forEach((file) => {
  const code = fs.readFileSync(file, 'utf8');
  let ast;
  try {
    ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript', 'classProperties'] });
  } catch (e) {
    console.warn('Skip parse error', file, e.message);
    return;
  }

  traverseFn(ast, {
    CallExpression(pathNode) {
      const callee = pathNode.node.callee;
      if (callee && callee.type === 'Identifier' && callee.name === 't') {
        const arg = pathNode.node.arguments[0];
        if (arg && arg.type === 'StringLiteral') {
          found[arg.value] = found[arg.value] || { text: arg.value, file };
        }
      }
    },

    StringLiteral(pathNode) {
      const parentKey =
        pathNode.parent &&
        pathNode.parent.key &&
        (pathNode.parent.key.name || pathNode.parent.key.value);
      if (
        parentKey &&
        [
          'title',
          'subtitle',
          'description',
          'text',
          'badge',
          'benefits',
          'content',
          'answer',
          'question',
          'name',
          'role',
        ].includes(parentKey)
      ) {
        const val = pathNode.node.value.trim();
        if (val.length > 1 && /[A-Za-zÀ-ÖØ-öø-ÿ\u00C0-\u017F]/.test(val)) {
          const base = path
            .relative(SRC, file)
            .replace(/\\/g, '/')
            .replace(/\.(ts|tsx|js|jsx)$/, '');
          const key = `${NS}.${slugify(base)}.${parentKey}`;
          found[key] = found[key] || { text: val, file };
        }
      }
    },

    JSXText(pathNode) {
      const val = pathNode.node.value.trim();
      if (val.length > 1 && /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(val)) {
        const loc =
          pathNode.node.loc && pathNode.node.loc.start
            ? `line_${pathNode.node.loc.start.line}`
            : 'inline';
        const base = path
          .relative(SRC, file)
          .replace(/\\/g, '/')
          .replace(/\.(ts|tsx|js|jsx)$/, '');
        const key = `${NS}.${slugify(base)}.${loc}`;
        found[key] = found[key] || { text: val, file };
      }
    },
  });
});

const outDir = OUT;
fs.ensureDirSync(outDir);

LANGS.forEach((lng) => {
  const lngDir = path.join(outDir, lng);
  fs.ensureDirSync(lngDir);
  const filePath = path.join(lngDir, `${NS}.json`);
  let existing = {};
  if (fs.existsSync(filePath)) {
    try {
      existing = fs.readJsonSync(filePath);
    } catch (e) {
      existing = {};
    }
  }

  const merged = { ...(existing || {}) };
  Object.keys(found).forEach((keyPath) => {
    const keyParts = keyPath.split('.');
    if (keyParts[0] === NS) keyParts.shift();
    const value =
      lng === 'de'
        ? found[keyPath].text
        : (existing && keyParts.reduce((o, k) => o && o[k], existing)) || '';

    let cur = merged;
    for (let i = 0; i < keyParts.length; i++) {
      const k = keyParts[i];
      if (i === keyParts.length - 1) cur[k] = cur[k] || value;
      else cur[k] = cur[k] || {};
      cur = cur[k];
    }
  });

  fs.writeJsonSync(filePath, merged, { spaces: 2 });
  console.log(`Wrote ${Object.keys(found).length} keys to ${filePath}`);
});
