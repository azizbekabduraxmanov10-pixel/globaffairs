const fs = require('fs');
const categories = {
  international_relations: 'International Relations',
  international_law: 'International Law',
  global_security: 'Global Security',
  diplomacy: 'Diplomacy',
  international_organizations: 'International Organizations',
  global_economics: 'Global Economics',
  human_rights: 'Human Rights',
  environment: 'Environment',
  culture_society: 'Culture & Society',
  geopolitics: 'Geopolitics',
  global_development: 'Global Development',
  global_health: 'Global Health',
  migration_refugee_studies: 'Migration & Refugee Studies',
  peace_conflict_studies: 'Peace & Conflict Studies',
  global_governance: 'Global Governance',
  international_trade: 'International Trade',
  energy_politics: 'Energy Politics',
  technology_global_politics: 'Technology & Global Politics',
  global_finance: 'Global Finance',
  humanitarian_affairs: 'Humanitarian Affairs'
};

const data = {};
Object.keys(categories).forEach(cat => {
  data[cat] = [];
  for (let i = 1; i <= 20; i++) {
    data[cat].push({
      term: `${categories[cat]} Term ${i}`,
      definition: `${categories[cat]} definition number ${i}.`, 
      example: `${categories[cat]} example usage number ${i}.`
    });
  }
});
fs.writeFileSync('terms.json', JSON.stringify(data, null, 2), 'utf8');
console.log('terms.json updated with 20 terms per category.');
