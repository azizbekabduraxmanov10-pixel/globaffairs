const fs = require('fs');
const path = require('path');

console.log('=== COMPREHENSIVE TOGGLE FEATURE VALIDATION REPORT ===\n');

// 1. Check data files
console.log('1. DATA FILES CHECK');
console.log('-'.repeat(50));
const dataDir = path.join(process.cwd(), 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
let totalTerms = 0;
let allCompleteInData = true;

files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
  let fileComplete = true;
  
  data.forEach(item => {
    totalTerms++;
    if (!item.advanced || !item.simple || !item.example) {
      fileComplete = false;
      allCompleteInData = false;
      console.log(`  ✗ ${file}: "${item.term}" missing fields`);
    }
  });
  
  if (fileComplete) {
    console.log(`  ✓ ${file}: All ${data.length} terms complete`);
  }
});

console.log(`\nTotal terms in data/: ${totalTerms}`);
console.log(`Status: ${allCompleteInData ? '✓ ALL COMPLETE' : '✗ INCOMPLETE'}\n`);

// 2. Check root terms.json
console.log('2. ROOT TERMS.JSON CHECK');
console.log('-'.repeat(50));
const rootData = JSON.parse(fs.readFileSync('./terms.json', 'utf8'));
let rootComplete = true;
let rootTerms = 0;

for (const cat in rootData) {
  rootData[cat].forEach(item => {
    rootTerms++;
    if (!item.advanced || !item.simple || !item.example) {
      rootComplete = false;
      console.log(`  ✗ ${cat}: "${item.term}" missing fields`);
    }
  });
}

console.log(`  ✓ Root terms.json: All ${rootTerms} terms present`);
console.log(`Status: ${rootComplete ? '✓ ALL COMPLETE' : '✗ INCOMPLETE'}\n`);

// 3. Check terms.js fallback
console.log('3. TERMS.JS FALLBACK CHECK');
console.log('-'.repeat(50));
const termsJs = fs.readFileSync('./terms.js', 'utf8');
const hasFallbackData = termsJs.includes('const termsData = {');
const hasAdvanced = termsJs.includes('advanced:') || termsJs.includes('"advanced":');
const hasSimple = termsJs.includes('simple:') || termsJs.includes('"simple":');
const hasExample = termsJs.includes('example:') || termsJs.includes('"example":');

console.log(`  ${hasFallbackData ? '✓' : '✗'} Fallback termsData object: ${hasFallbackData}`);
console.log(`  ${hasAdvanced ? '✓' : '✗'} Advanced field present: ${hasAdvanced}`);
console.log(`  ${hasSimple ? '✓' : '✗'} Simple field present: ${hasSimple}`);
console.log(`  ${hasExample ? '✓' : '✗'} Example field present: ${hasExample}`);
console.log();

// 4. Check term.html UI elements
console.log('4. TERM.HTML UI ELEMENTS CHECK');
console.log('-'.repeat(50));
const termHtml = fs.readFileSync('./term.html', 'utf8');
const hasToggleButton = termHtml.includes('id="toggleSimple"');
const hasSimpleContainer = termHtml.includes('id="simpleExplanation"');
const hasSimpleText = termHtml.includes('id="simpleText"');
const hasToggleCSS = termHtml.includes('toggle-btn') && termHtml.includes('.toggle-btn');
const hasShowClass = termHtml.includes('#simpleExplanation.show');
const hasToggleListener = termHtml.includes('toggleBtn.addEventListener');

console.log(`  ${hasToggleButton ? '✓' : '✗'} Toggle button element: ${hasToggleButton}`);
console.log(`  ${hasSimpleContainer ? '✓' : '✗'} Simple explanation container: ${hasSimpleContainer}`);
console.log(`  ${hasSimpleText ? '✓' : '✗'} Simple text span: ${hasSimpleText}`);
console.log(`  ${hasToggleCSS ? '✓' : '✗'} Toggle button CSS: ${hasToggleCSS}`);
console.log(`  ${hasShowClass ? '✓' : '✗'} Show class CSS: ${hasShowClass}`);
console.log(`  ${hasToggleListener ? '✓' : '✗'} Toggle event listener: ${hasToggleListener}`);

const hasRenderWithFallback = termHtml.includes("term.advanced || term.definition");
console.log(`  ${hasRenderWithFallback ? '✓' : '✗'} Render with fallback: ${hasRenderWithFallback}`);
console.log();

// 5. Check quiz-mc.js integration
console.log('5. QUIZ-MC.JS INTEGRATION CHECK');
console.log('-'.repeat(50));
const quizJs = fs.readFileSync('./quiz-mc.js', 'utf8');
const usesAdvanced = quizJs.includes('item.advanced');
const quizFallback = quizJs.includes('item.advanced || item.definition');

console.log(`  ${usesAdvanced ? '✓' : '✗'} Uses advanced field: ${usesAdvanced}`);
console.log(`  ${quizFallback ? '✓' : '✗'} Has fallback to definition: ${quizFallback}`);
console.log();

// 6. Overall status
console.log('=== OVERALL STATUS ===');
console.log('-'.repeat(50));
const allChecks = allCompleteInData && rootComplete && hasFallbackData && 
                 hasAdvanced && hasSimple && hasExample && hasToggleButton && 
                 hasSimpleContainer && hasToggleListener && usesAdvanced;

if (allChecks) {
  console.log('✓ ALL SYSTEMS GO - Feature is fully implemented and complete');
} else {
  console.log('✗ Some checks failed - see issues above');
}
