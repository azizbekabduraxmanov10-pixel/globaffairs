(function() {
	function formatCategoryName(categoryId) {
		const categoryMap = {
			'international_relations': 'International Relations',
			'international_law': 'International Law',
			'global_security': 'Global Security',
			'diplomacy': 'Diplomacy',
			'international_organizations': 'International Organizations',
			'global_economics': 'Global Economics',
			'human_rights': 'Human Rights',
			'environment': 'Environment',
			'culture_society': 'Culture & Society',
			'geopolitics': 'Geopolitics',
			'global_development': 'Global Development',
			'global_health': 'Global Health',
			'migration_refugee_studies': 'Migration & Refugee Studies',
			'peace_conflict_studies': 'Peace & Conflict Studies',
			'global_governance': 'Global Governance',
			'international_trade': 'International Trade',
			'energy_politics': 'Energy Politics',
			'technology_global_politics': 'Technology & Global Politics',
			'global_finance': 'Global Finance',
			'humanitarian_affairs': 'Humanitarian Affairs'
		};
		return categoryMap[categoryId] || categoryId;
	}

	document.addEventListener('DOMContentLoaded', function() {
		fetch('articles.json')
			.then(response => response.json())
			.then(articles => {
				const articlesGrid = document.getElementById('articlesGrid');
				
				articles.forEach(article => {
					const card = document.createElement('div');
					card.className = 'article-card';
					card.innerHTML = `
						<div class="article-card-content">
							<h3 class="article-card-title">${article.title}</h3>
							<p class="article-card-category">${formatCategoryName(article.category)}</p>
							<p class="article-card-description">${article.description}</p>
							<a href="articles/${article.slug}.html" class="read-more-btn">Read More &rarr;</a>
						</div>
					`;
					articlesGrid.appendChild(card);
				});
			})
			.catch(error => {
				console.error('Error loading articles:', error);
				document.getElementById('articlesGrid').innerHTML = '<p>Error loading articles. Please try again later.</p>';
			});
	});
})();
