const fs = require('fs');

try {
  const content = fs.readFileSync('index.html', 'utf8');
  if (content.includes('.locked-paper')) {
     console.error("FAILED: .locked-paper class still exists in the file.");
     process.exit(1);
  }
  if (!content.includes('.fog-solid')) {
     console.error("FAILED: .fog-solid class is missing.");
     process.exit(1);
  }
  if (!content.includes('.fog-burned')) {
     console.error("FAILED: .fog-burned class is missing.");
     process.exit(1);
  }
  console.log("SUCCESS: Basic syntax checks passed.");
} catch (e) {
  console.error("Error reading file", e);
  process.exit(1);
}
