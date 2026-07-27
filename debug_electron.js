const fs = require('fs');
const path = require('path');
const { downloadArtifact } = require('@electron/get');
const extract = require('extract-zip');
const { version } = require('./node_modules/electron/package.json');

console.log('Downloading version:', version);
downloadArtifact({
  version,
  artifactName: 'electron',
  platform: process.platform,
  arch: process.arch
}).then(zipPath => {
  console.log('Downloaded to:', zipPath);
  console.log('Extracting...');
  return extract(zipPath, { dir: path.join(__dirname, 'temp_dist') });
}).then(() => {
  console.log('Extraction complete! Checking contents:');
  console.log(fs.readdirSync(path.join(__dirname, 'temp_dist')));
}).catch(console.error);
