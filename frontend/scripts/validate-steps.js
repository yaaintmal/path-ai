#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const stepsPath = path.join(
  __dirname,
  '..',
  'src',
  'components',
  'landing',
  'onboarding',
  'config',
  'steps.json'
);
const raw = fs.readFileSync(stepsPath, 'utf8');
let steps;
try {
  steps = JSON.parse(raw);
} catch (err) {
  console.error('Failed to parse steps.json:', err);
  process.exit(2);
}

const ids = steps.map((s) => s.id);
const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
if (duplicates.length) {
  console.error('Duplicate step ids found:', Array.from(new Set(duplicates)).join(', '));
  process.exit(1);
}
console.log('No duplicate step ids found.');
process.exit(0);
