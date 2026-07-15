const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

console.log('=== CHECKING ALL TERMS FOR MISSING DATA ===\n');

let totalTerms = 0;
let missingAdvanced = 0;
let missingSimple = 0;
let missingExample = 0;
const missingList = [];

files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
  console.log(`\n${file} (${data.length} terms):`);
  
  data.forEach((item, idx) => {
    totalTerms++;
    let issues = [];
    
    if (!item.advanced || item.advanced.trim() === '') {
      missingAdvanced++;
      issues.push('NO ADVANCED');
    }
    if (!item.simple || item.simple.trim() === '') {
      missingSimple++;
      issues.push('NO SIMPLE');
    }
    if (!item.example || item.example.trim() === '') {
      missingExample++;
      issues.push('NO EXAMPLE');
    }
    
    if (issues.length > 0) {
      console.log(`  ✗ ${item.term}: ${issues.join(', ')}`);
      missingList.push({ file, term: item.term, issues });
    }
  });
});

console.log('\n\n=== SUMMARY ===');
console.log(`Total terms: ${totalTerms}`);
console.log(`Missing advanced: ${missingAdvanced}`);
console.log(`Missing simple: ${missingSimple}`);
console.log(`Missing example: ${missingExample}`);
console.log(`Total incomplete entries: ${missingList.length}`);

if (missingList.length > 0) {
  console.log('\n=== INCOMPLETE TERMS ===');
  missingList.forEach(item => {
    console.log(`${item.file}: "${item.term}" - ${item.issues.join(', ')}`);
  });
}
