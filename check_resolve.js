const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'frontend/src/locales/en/landing.json');
const content = fs.readFileSync(enPath, 'utf8');
const json = JSON.parse(content);

function resolve(obj, path) {
  return path.split('.').reduce((o, i) => (o ? o[i] : null), obj);
}

console.log('dashboard.titlePart1:', resolve(json, 'dashboard.titlePart1'));
console.log('pages.dashboard.titlePart1:', resolve(json, 'pages.dashboard.titlePart1'));
console.log('dashboardPreview.progress.title:', resolve(json, 'dashboardPreview.progress.title'));
