// Quiz Selection Script
document.addEventListener('DOMContentLoaded', function() {
	// Clear any previous selections to reset when switching sections
	sessionStorage.removeItem('selectedQuizFields');

	// Define the 20 fields based on the data files available
	const fields = [
		'Culture & Society',
		'Diplomacy',
		'Energy Politics',
		'Environment',
		'Geopolitics',
		'Global Development',
		'Global Economics',
		'Global Finance',
		'Global Governance',
		'Global Health',
		'Global Security',
		'Human Rights',
		'Humanitarian Affairs',
		'International Law',
		'International Organizations',
		'International Relations',
		'International Trade',
		'Migration & Refugee Studies',
		'Peace & Conflict Studies',
		'Technology & Global Politics'
	];

	const fieldsGrid = document.getElementById('fieldsGrid');
	const selectAllBtn = document.getElementById('selectAllBtn');
	const clearBtn = document.getElementById('clearBtn');
	const startQuizBtn = document.getElementById('startQuizBtn');
	const validationMessage = document.getElementById('validationMessage');
	const successMessage = document.getElementById('successMessage');
	const selectionCounter = document.getElementById('selectionCounter');

	// Track selected fields
	let selectedFields = new Set();

	// Create field cards
	fields.forEach((field, index) => {
		const fieldCard = document.createElement('div');
		fieldCard.className = 'field-card';
		fieldCard.dataset.field = field;
		fieldCard.dataset.index = index;

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = `field-${index}`;
		checkbox.className = 'field-checkbox';
		checkbox.value = field;

		const label = document.createElement('label');
		label.htmlFor = `field-${index}`;
		label.className = 'field-label';
		label.textContent = field;

		fieldCard.appendChild(checkbox);
		fieldCard.appendChild(label);

		// Handle card click and checkbox change
		fieldCard.addEventListener('click', function(e) {
			// Prevent double trigger if clicking checkbox directly
			if (e.target !== checkbox) {
				checkbox.checked = !checkbox.checked;
			}
			updateSelection(field, checkbox.checked);
		});

		checkbox.addEventListener('change', function(e) {
			e.stopPropagation();
			updateSelection(field, checkbox.checked);
		});

		fieldsGrid.appendChild(fieldCard);
	});

	// Update selection state
	function updateSelection(field, isSelected) {
		if (isSelected) {
			selectedFields.add(field);
		} else {
			selectedFields.delete(field);
		}

		updateUI();
	}

	// Update UI elements
	function updateUI() {
		const count = selectedFields.size;
		selectionCounter.textContent = `Selected: ${count} / 20 fields`;

		// Update card visual states
		document.querySelectorAll('.field-card').forEach(card => {
			const checkbox = card.querySelector('input[type="checkbox"]');
			if (checkbox.checked) {
				card.classList.add('selected');
			} else {
				card.classList.remove('selected');
			}
		});

		// Show/hide validation message
		if (count === 0 && validationMessage.classList.contains('show')) {
			validationMessage.classList.remove('show');
		}

		// Enable/disable start button
		if (count > 0) {
			startQuizBtn.disabled = false;
		} else {
			startQuizBtn.disabled = true;
		}
	}

	// Select All button
	selectAllBtn.addEventListener('click', function() {
		document.querySelectorAll('.field-checkbox').forEach(checkbox => {
			checkbox.checked = true;
			selectedFields.add(checkbox.value);
		});
		updateUI();
	});

	// Clear button
	clearBtn.addEventListener('click', function() {
		document.querySelectorAll('.field-checkbox').forEach(checkbox => {
			checkbox.checked = false;
		});
		selectedFields.clear();
		updateUI();
		validationMessage.classList.remove('show');
		successMessage.classList.remove('show');
	});

	// Start Quiz button
	startQuizBtn.addEventListener('click', function() {
		if (selectedFields.size === 0) {
			validationMessage.classList.add('show');
			return;
		}

		// Show success message
		validationMessage.classList.remove('show');
		successMessage.classList.add('show');

		// Store selected fields in localStorage or session storage
		const selectedArray = Array.from(selectedFields);
		sessionStorage.setItem('selectedQuizFields', JSON.stringify(selectedArray));

		// Redirect to quiz page after a short delay
		setTimeout(function() {
			window.location.href = 'quiz.html';
		}, 500);
	});

	// Initial UI update
	updateUI();
});
