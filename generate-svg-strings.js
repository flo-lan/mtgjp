const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'src/assets');
const outputFile = path.join(__dirname, 'src/components/native-mtg-card/svgStrings.ts');

const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.svg'));

let content = `// Auto-generated file containing raw SVG strings\n\n`;

for (const file of files) {
  const filePath = path.join(assetsDir, file);
  const rawSvg = fs.readFileSync(filePath, 'utf8');
  
  // Create a valid JS variable name
  const varName = file
    .replace('.svg', '')
    .replace(/-([a-z0-9])/g, g => g[1].toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '') + 'Raw';
    
  // Escape backticks and dollar signs
  const escapedSvg = rawSvg.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  
  content += `export const ${varName} = \`${escapedSvg}\`;\n\n`;
}

fs.writeFileSync(outputFile, content);
console.log('Successfully generated svgStrings.ts');
