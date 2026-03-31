const fs = require('fs');
const fields = [
  'International Relations','International Law','Global Security','Diplomacy','International Organizations','Global Economics','Human Rights','Environment','Culture & Society','Geopolitics','Global Development','Global Health','Migration & Refugee Studies','Peace & Conflict Studies','Global Governance','International Trade','Energy Politics','Technology & Global Politics','Global Finance','Humanitarian Affairs'
];
const data = {};
fields.forEach(field => {
  data[field] = [];
  for (let i = 1; i <= 20; i++) {
    data[field].push({
      term: `Term ${i}`,
      meaning: `${field} - term ${i} meaning`,
      example: `${field} - term ${i} example`
    });
  }
});
fs.writeFileSync('terms.json', JSON.stringify(data, null, 2), 'utf8');
console.log('terms.json generated with 20 terms in each field');
