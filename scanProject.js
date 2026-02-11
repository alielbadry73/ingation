const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_KEY = process.env.ANTHROPIC_API_KEY; // Make sure your API key is set
if (!API_KEY) {
  console.error("Error: Set your ANTHROPIC_API_KEY in the environment variables.");
  process.exit(1);
}

const projectDir = path.resolve('.');
const reportFile = path.join(projectDir, 'claude_project_report.txt');

const filesToScan = [];

function findFiles(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findFiles(fullPath);
    } else if (/\.(js|html|css)$/.test(item)) {
      filesToScan.push(fullPath);
    }
  }
}

async function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Please review the following code and suggest improvements, fixes, or point out errors:\n\n${content}\n\n`
          }
        ]
      },
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      }
    );

    return `=== ${filePath} ===\n${response.data.content[0].text}\n\n`;
  } catch (err) {
    return `=== ${filePath} ===\nError: ${err.message}\n\n`;
  }
}

async function main() {
  findFiles(projectDir);
  if (filesToScan.length === 0) {
    console.log("No .js, .html, or .css files found.");
    return;
  }

  console.log(`Found ${filesToScan.length} files. Scanning...`);

  let report = '';
  for (const file of filesToScan) {
    console.log(`Scanning ${file}...`);
    const result = await scanFile(file);
    report += result;
  }

  fs.writeFileSync(reportFile, report, 'utf-8');
  console.log(`Scan complete! Report saved to ${reportFile}`);
}

main();
