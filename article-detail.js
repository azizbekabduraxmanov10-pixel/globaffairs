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

	function getArticleIdFromUrl() {
		const params = new URLSearchParams(window.location.search);
		return params.get('id');
	}

	document.addEventListener('DOMContentLoaded', function() {
		const articleId = getArticleIdFromUrl();
		
		if (!articleId) {
			document.querySelector('.article-detail-container').innerHTML = '<p>Article not found.</p>';
			return;
		}

		fetch('articles.json')
			.then(response => response.json())
			.then(articles => {
				const article = articles.find(a => a.id === parseInt(articleId));
				
				if (!article) {
					document.querySelector('.article-detail-container').innerHTML = '<p>Article not found.</p>';
					return;
				}

				// Populate article content
				document.getElementById('articleTitle').textContent = article.title;
				document.getElementById('articleCategory').textContent = formatCategoryName(article.category);
				document.getElementById('articleExplanation').textContent = article.explanation;
				document.getElementById('articleBackground').textContent = article.background;

				// Populate solutions
				const solutionsList = document.getElementById('articleSolutions');
				article.solutions.forEach(solution => {
					const li = document.createElement('li');
					li.textContent = solution;
					solutionsList.appendChild(li);
				});

				// Populate discussion questions
				const questionsDiv = document.getElementById('articleQuestions');
				article.discussionQuestions.forEach((question, index) => {
					const questionDiv = document.createElement('div');
					questionDiv.className = 'discussion-question';
					questionDiv.innerHTML = `
						<h4>Question ${index + 1}</h4>
						<p>${question}</p>
					`;
					questionsDiv.appendChild(questionDiv);
				});
			})
			.catch(error => {
				console.error('Error loading article:', error);
				document.querySelector('.article-detail-container').innerHTML = '<p>Error loading article. Please try again later.</p>';
			});
	});
})();
