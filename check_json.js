const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'frontend/src/locales/en/landing.json');
const dePath = path.join(__dirname, 'frontend/src/locales/de/landing.json');

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    console.log(`File ${filePath} is valid JSON.`);

    if (json.dashboard && json.dashboard.progress) {
      console.log('Found dashboard.progress:', json.dashboard.progress);
    } else {
      console.log('dashboard.progress NOT found at root.');
    }

    if (json.pages && json.pages.dashboard) {
      console.log('Found pages.dashboard');
    }

    if (json.components && json.components.dashboard) {
      console.log('Found components.dashboard');
    }
  } catch (e) {
    console.error(`Error parsing ${filePath}:`, e.message);
  }
}

checkFile(enPath);
checkFile(dePath);
