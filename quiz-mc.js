// Quiz Multiple Choice Script
let currentQuestionIndex = 0;
let selectedFields = [];
let quizData = [];
let answeredQuestions = {};
let questionOptions = {}; // Store shuffled options for each question

const successMessages = ['Great!', 'Awesome!', 'Good job!'];

document.addEventListener('DOMContentLoaded', async function() {
	// Get selected fields from sessionStorage
	selectedFields = JSON.parse(sessionStorage.getItem('selectedQuizFields') || '[]');

	if (selectedFields.length === 0) {
		alert('No fields selected. Please select at least one field.');
		window.location.href = 'quiz-selection.html';
		return;
	}

	// Update header based on number of fields
	if (selectedFields.length === 1) {
		document.getElementById('fieldTitle').textContent = `${selectedFields[0]} Quiz`;
	} else {
		document.getElementById('fieldTitle').textContent = 'Quiz';
	}

	// Load quiz data for all selected fields
	await loadQuizDataMultipleFields(selectedFields);

	// Initialize event listeners
	setupEventListeners();

	// Display first question
	displayQuestion();
});

// Convert field name to JSON filename
function fieldToJsonFile(field) {
	const mapping = {
		'Culture & Society': 'culture_society',
		'Diplomacy': 'diplomacy',
		'Energy Politics': 'energy_politics',
		'Environment': 'environment',
		'Geopolitics': 'geopolitics',
		'Global Development': 'global_development',
		'Global Economics': 'global_economics',
		'Global Finance': 'global_finance',
		'Global Governance': 'global_governance',
		'Global Health': 'global_health',
		'Global Security': 'global_security',
		'Human Rights': 'human_rights',
		'Humanitarian Affairs': 'humanitarian_affairs',
		'International Law': 'international_law',
		'International Organizations': 'international_organizations',
		'International Relations': 'international_relations',
		'International Trade': 'international_trade',
		'Migration & Refugee Studies': 'migration_refugee_studies',
		'Peace & Conflict Studies': 'peace_conflict_studies',
		'Technology & Global Politics': 'technology_global_politics'
	};
	return mapping[field] || 'culture_society';
}

// Load quiz data from multiple fields
async function loadQuizDataMultipleFields(fields) {
	quizData = [];
	
	for (const field of fields) {
		const jsonFile = fieldToJsonFile(field);
		try {
			const response = await fetch(`data/${jsonFile}.json`);
			const data = await response.json();
			const fieldData = data.map((item, index) => ({
				...item,
				correctAnswer: item.definition,
				field: field,
				id: `${field}-${index}`
			}));
			quizData = quizData.concat(fieldData);
		} catch (error) {
			console.error(`Error loading quiz data for ${field}:`, error);
		}
	}
	
	if (quizData.length === 0) {
		alert('Error loading quiz data. Please try again.');
		window.location.href = 'quiz-selection.html';
	}
}

// Setup event listeners
function setupEventListeners() {
	const checkBtn = document.getElementById('checkBtn');
	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');
	const options = document.querySelectorAll('.option');

	checkBtn.addEventListener('click', checkAnswer);
	prevBtn.addEventListener('click', goToPreviousQuestion);
	nextBtn.addEventListener('click', goToNextQuestion);

	options.forEach((option, index) => {
		const radio = option.querySelector('input[type="radio"]');
		option.addEventListener('click', function() {
			// If selecting a different option, re-enable Check button
			const wasChecked = radio.checked;
			radio.checked = true;
			
			// Re-enable check button when a new option is selected after an incorrect answer
			if (!wasChecked) {
				const checkBtn = document.getElementById('checkBtn');
				const feedbackMessage = document.getElementById('feedbackMessage');
				
				// Only re-enable if there was an error message and a new option is selected
				if (feedbackMessage.textContent === 'Try again!' && checkBtn.disabled) {
					checkBtn.disabled = false;
					
					// Reset previous incorrect styling
					document.querySelectorAll('.option').forEach(opt => {
						if (opt !== option) {
							opt.classList.remove('incorrect', 'correct');
						}
					});
				}
			}
		});
	});
}

// Helper function to shuffle array
function shuffleArray(array) {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

// Display current question
function displayQuestion() {
	if (currentQuestionIndex < 0 || currentQuestionIndex >= quizData.length) {
		return;
	}

	const question = quizData[currentQuestionIndex];
	const questionId = currentQuestionIndex;

	// Check if we've already shuffled options for this question
	if (!questionOptions[questionId]) {
		const otherDefinitions = quizData
			.filter((item, index) => index !== currentQuestionIndex)
			.map(item => item.definition);

		// Shuffle to get 3 random incorrect options
		const shuffledIncorrect = shuffleArray(otherDefinitions).slice(0, 3);
		const allOptions = shuffleArray([question.correctAnswer, ...shuffledIncorrect]);

		// Store the shuffled options for this question
		questionOptions[questionId] = allOptions;
	}

	const allOptions = questionOptions[questionId];

	// Update question text
	document.getElementById('questionText').innerHTML = `What is the meaning of <strong>${question.term}</strong>?`;
	document.getElementById('questionCounter').textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;

	// Update options
	const optionLabels = document.querySelectorAll('[id^="optionLabel"]');
	optionLabels.forEach((label, index) => {
		label.textContent = allOptions[index];
		label.dataset.definition = allOptions[index];
		label.dataset.isCorrect = allOptions[index] === question.correctAnswer;
	});

	// Reset UI
	resetQuestionUI();

	// Update button states
	updateButtonStates();

	// If question was already answered, restore the state
	if (answeredQuestions[currentQuestionIndex]) {
		restoreAnswerState(currentQuestionIndex);
	}
}

// Reset question UI
function resetQuestionUI() {
	const options = document.querySelectorAll('.option');
	const feedbackMessage = document.getElementById('feedbackMessage');
	const checkBtn = document.getElementById('checkBtn');
	const radios = document.querySelectorAll('input[type="radio"]');

	options.forEach(option => {
		option.classList.remove('correct', 'incorrect');
	});

	radios.forEach(radio => {
		radio.checked = false;
	});

	feedbackMessage.textContent = '';
	feedbackMessage.className = 'feedback-message';
	checkBtn.disabled = false;
	checkBtn.textContent = 'Check';
}

// Check answer
function checkAnswer() {
	const selectedOption = document.querySelector('input[type="radio"]:checked');

	if (!selectedOption) {
		alert('Please select an option first!');
		return;
	}

	const selectedIndex = parseInt(selectedOption.value);
	const selectedLabel = document.getElementById(`optionLabel${selectedIndex}`);
	const isCorrect = selectedLabel.dataset.isCorrect === 'true';
	const optionElement = selectedLabel.closest('.option');
	const feedbackMessage = document.getElementById('feedbackMessage');
	const checkBtn = document.getElementById('checkBtn');

	// Store the answer
	answeredQuestions[currentQuestionIndex] = {
		selectedIndex: selectedIndex,
		isCorrect: isCorrect
	};

	if (isCorrect) {
		optionElement.classList.add('correct');
		optionElement.classList.remove('incorrect');
		const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
		feedbackMessage.textContent = randomMessage;
		feedbackMessage.className = 'feedback-message success';
	} else {
		optionElement.classList.add('incorrect');
		optionElement.classList.remove('correct');
		feedbackMessage.textContent = 'Try again!';
		feedbackMessage.className = 'feedback-message error';
	}

	checkBtn.disabled = true;
}

// Restore answer state
function restoreAnswerState(questionIndex) {
	const answer = answeredQuestions[questionIndex];
	if (answer) {
		const selectedLabel = document.getElementById(`optionLabel${answer.selectedIndex}`);
		const optionElement = selectedLabel.closest('.option');
		const feedbackMessage = document.getElementById('feedbackMessage');
		const radios = document.querySelectorAll('input[type="radio"]');

		radios[answer.selectedIndex].checked = true;

		if (answer.isCorrect) {
			optionElement.classList.add('correct');
			const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
			feedbackMessage.textContent = randomMessage;
			feedbackMessage.className = 'feedback-message success';
		} else {
			optionElement.classList.add('incorrect');
			feedbackMessage.textContent = 'Try again!';
			feedbackMessage.className = 'feedback-message error';
		}

		document.getElementById('checkBtn').disabled = true;
	}
}

// Navigate to previous question
function goToPreviousQuestion() {
	if (currentQuestionIndex > 0) {
		currentQuestionIndex--;
		displayQuestion();
	}
}

// Navigate to next question
function goToNextQuestion() {
	if (currentQuestionIndex < quizData.length - 1) {
		currentQuestionIndex++;
		displayQuestion();
	}
}

// Update button states
function updateButtonStates() {
	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');

	prevBtn.disabled = currentQuestionIndex === 0;
	nextBtn.disabled = currentQuestionIndex === quizData.length - 1;
}
