/**
 * Script to update API URLs from localhost to production URL
 * Usage: node update-api-urls.js <production-url>
 * Example: node update-api-urls.js https://ignation-backend.onrender.com
 */

const fs = require('fs');
const path = require('path');

const productionUrl = process.argv[2];

if (!productionUrl) {
  console.error('❌ Error: Please provide production URL');
  console.log('Usage: node update-api-urls.js <production-url>');
  console.log('Example: node update-api-urls.js https://ignation-backend.onrender.com');
  process.exit(1);
}

// Remove trailing slash
const cleanUrl = productionUrl.replace(/\/$/, '');

console.log(`🔄 Updating API URLs to: ${cleanUrl}`);
console.log('📁 Searching for files...\n');

const filesToUpdate = [];
const extensions = ['.html', '.js', '.json'];

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // Skip node_modules, .git, and other directories
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'build', 'logs', 'hts-cache'].includes(file)) {
        findFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext) && !filePath.includes('node_modules')) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// Find all relevant files
const allFiles = findFiles(process.cwd());

// Patterns to replace
const patterns = [
  { search: /http:\/\/localhost:3000/g, replace: cleanUrl },
  { search: /https:\/\/localhost:3000/g, replace: cleanUrl },
  { search: /http:\/\/127\.0\.0\.1:3000/g, replace: cleanUrl },
  { search: /https:\/\/127\.0\.0\.1:3000/g, replace: cleanUrl },
  { search: /'http:\/\/localhost:3000'/g, replace: `'${cleanUrl}'` },
  { search: /"http:\/\/localhost:3000"/g, replace: `"${cleanUrl}"` },
];

let totalReplacements = 0;

allFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let fileReplacements = 0;
    
    patterns.forEach(({ search, replace }) => {
      const matches = content.match(search);
      if (matches) {
        content = content.replace(search, replace);
        modified = true;
        fileReplacements += matches.length;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesToUpdate.push({ file: filePath, count: fileReplacements });
      totalReplacements += fileReplacements;
      console.log(`✅ Updated: ${filePath} (${fileReplacements} replacements)`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
});

console.log(`\n✨ Done! Updated ${filesToUpdate.length} files with ${totalReplacements} total replacements.`);

if (filesToUpdate.length === 0) {
  console.log('ℹ️  No files found with localhost:3000 references.');
}


