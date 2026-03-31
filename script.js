(function() {
  // Map field display names to category IDs used in terms.json
  const map = {
    'International Relations': 'international_relations',
    'International Law': 'international_law',
    'Global Security': 'global_security',
    'Diplomacy': 'diplomacy',
    'International Organizations': 'international_organizations',
    'Global Economics': 'global_economics',
    'Human Rights': 'human_rights',
    'Environment': 'environment',
    'Culture & Society': 'culture_society',
    'Geopolitics': 'geopolitics',
    'Global Development': 'global_development',
    'Global Health': 'global_health',
    'Migration & Refugee Studies': 'migration_refugee_studies',
    'Peace & Conflict Studies': 'peace_conflict_studies',
    'Global Governance': 'global_governance',
    'International Trade': 'international_trade',
    'Energy Politics': 'energy_politics',
    'Technology & Global Politics': 'technology_global_politics',
    'Global Finance': 'global_finance',
    'Humanitarian Affairs': 'humanitarian_affairs'
  };

  document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.terminology-card');
    cards.forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function() {
        const field = card.querySelector('.field-name').textContent.trim();
        const category = map[field];
        if (!category) return;
        window.location.href = `terms.html?category=${encodeURIComponent(category)}`;
      });
    });
  });
})();
