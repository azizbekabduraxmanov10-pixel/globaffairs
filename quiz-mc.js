// Quiz Multiple Choice Script - Enhanced Version
let currentQuestionIndex = 0;
let selectedFields = [];
let quizData = [];
let answeredQuestions = {};
let questionFormats = {}; // Store question format (term->def or def->term) for each question
let firstAttemptAnswers = {}; // Track first attempt separately
let isFirstAttempt = true;
let quizStartTime = null;
let quizSubmitted = false; // Track if quiz has been submitted (locks answers)

const successMessages = ['Great!', 'Awesome!', 'Good job!', 'Excellent!', 'Well done!'];
const questionFormatTypes = ['term-to-definition', 'definition-to-term'];

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

	// Randomize question order
	randomizeQuestionOrder();

	// Initialize event listeners
	setupEventListeners();

	// Record quiz start time
	quizStartTime = Date.now();

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
	const categoryDataMap = {}; // Map to store all data by category for distractor generation
	
	for (const field of fields) {
		const jsonFile = fieldToJsonFile(field);
		try {
			const response = await fetch(`data/${jsonFile}.json`);
			const data = await response.json();
			
			// Store all data for this category for distractor generation
			categoryDataMap[field] = data;
			
			// Create quiz items with additional metadata
			const fieldData = data.map((item, index) => ({
				...item,
				correctAnswer: item.advanced || item.definition,
				field: field,
				id: `${field}-${index}`,
				categoryJsonFile: jsonFile
			}));
			quizData = quizData.concat(fieldData);
		} catch (error) {
			console.error(`Error loading quiz data for ${field}:`, error);
		}
	}
	
	// Store category data map for distractor generation
	window.categoryDataMap = categoryDataMap;
	
	if (quizData.length === 0) {
		alert('Error loading quiz data. Please try again.');
		window.location.href = 'quiz-selection.html';
	}
}

// Randomize the order of questions
function randomizeQuestionOrder() {
	quizData = shuffleArray(quizData);
}

// Assign random question formats to each question
function assignQuestionFormats() {
	for (let i = 0; i < quizData.length; i++) {
		const randomFormat = questionFormatTypes[Math.floor(Math.random() * questionFormatTypes.length)];
		questionFormats[i] = randomFormat;
	}
}

// Setup event listeners
function setupEventListeners() {
	const checkBtn = document.getElementById('checkBtn');
	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');
	const options = document.querySelectorAll('.option');
	const retakeBtn = document.getElementById('retakeBtn');
	const homeBtn = document.getElementById('homeBtn');
	const newQuizBtn = document.getElementById('newQuizBtn');

	checkBtn.addEventListener('click', checkAnswer);
	prevBtn.addEventListener('click', goToPreviousQuestion);
	nextBtn.addEventListener('click', goToNextQuestion);
	
	if (retakeBtn) retakeBtn.addEventListener('click', retakeQuiz);
	if (homeBtn) homeBtn.addEventListener('click', goHome);
	if (newQuizBtn) newQuizBtn.addEventListener('click', selectNewQuiz);

	options.forEach((option, index) => {
		const radio = option.querySelector('input[type="radio"]');
		option.addEventListener('click', function() {
			// If quiz is submitted, prevent any clicks
			if (quizSubmitted) {
				return;
			}
			
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

// Get intelligent distractors from the SAME category
function getIntelligentDistractors(questionIndex, numDistracters = 3) {
	const question = quizData[questionIndex];
	const questionField = question.field;
	
	// Get all terms from the same category/field
	const sameFieldTerms = quizData.filter(item => 
		item.field === questionField && 
		item.id !== question.id
	);
	
	if (sameFieldTerms.length < numDistracters) {
		// If not enough terms in category, use what we have
		return sameFieldTerms.map(item => ({
			term: item.term,
			definition: item.advanced || item.definition
		})).slice(0, numDistracters);
	}
	
	// Randomly select distractors from same category
	const shuffledTerms = shuffleArray(sameFieldTerms);
	return shuffledTerms.slice(0, numDistracters).map(item => ({
		term: item.term,
		definition: item.advanced || item.definition
	}));
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

// Display current question with variable format
function displayQuestion() {
	if (currentQuestionIndex < 0 || currentQuestionIndex >= quizData.length) {
		return;
	}

	// Initialize question formats if not done yet
	if (Object.keys(questionFormats).length === 0) {
		assignQuestionFormats();
	}

	const question = quizData[currentQuestionIndex];
	const questionId = currentQuestionIndex;
	const format = questionFormats[questionId];
	let allOptions = [];
	let questionText = '';
	let correctAnswerDisplay = '';

	// Generate options based on question format
	if (format === 'term-to-definition') {
		// Format: "What is the meaning of [TERM]?"
		questionText = `What is the meaning of <strong>${question.term}</strong>?`;
		correctAnswerDisplay = question.advanced || question.definition;
		
		// Get distractors from same category
		const distractors = getIntelligentDistractors(questionId);
		const distractorDefinitions = distractors.map(d => d.definition);
		
		allOptions = shuffleArray([correctAnswerDisplay, ...distractorDefinitions]);
	} else {
		// Format: "Which term matches this definition?"
		questionText = `Which term matches this definition: <strong>"${question.advanced || question.definition}"</strong>?`;
		correctAnswerDisplay = question.term;
		
		// Get distractors from same category
		const distractors = getIntelligentDistractors(questionId);
		const distractorTerms = distractors.map(d => d.term);
		
		allOptions = shuffleArray([correctAnswerDisplay, ...distractorTerms]);
	}

	// Update question text
	document.getElementById('questionText').innerHTML = questionText;
	document.getElementById('questionCounter').textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;

	// Update options
	const optionLabels = document.querySelectorAll('[id^="optionLabel"]');
	optionLabels.forEach((label, index) => {
		label.textContent = allOptions[index];
		label.dataset.optionValue = allOptions[index];
		label.dataset.isCorrect = allOptions[index] === correctAnswerDisplay;
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
		isCorrect: isCorrect,
		selectedValue: selectedLabel.dataset.optionValue
	};

	// Track first attempt separately
	if (isFirstAttempt && !firstAttemptAnswers[currentQuestionIndex]) {
		firstAttemptAnswers[currentQuestionIndex] = {
			isCorrect: isCorrect
		};
	}

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

// Check if all questions have been answered (regardless of correctness)
function areAllQuestionsAnswered() {
	for (let i = 0; i < quizData.length; i++) {
		if (!answeredQuestions[i]) {
			return false;
		}
	}
	return true;
}

// Calculate score
function calculateScore() {
	let totalCorrect = 0;
	for (let i = 0; i < quizData.length; i++) {
		if (answeredQuestions[i] && answeredQuestions[i].isCorrect) {
			totalCorrect++;
		}
	}
	return totalCorrect;
}

// Calculate first attempt score
function calculateFirstAttemptScore() {
	let totalCorrect = 0;
	for (let i = 0; i < quizData.length; i++) {
		if (firstAttemptAnswers[i] && firstAttemptAnswers[i].isCorrect) {
			totalCorrect++;
		}
	}
	return totalCorrect;
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
	} else {
		// On last question, check if user wants to submit
		checkAndShowCompletion();
	}
}

// Check if quiz is complete and show completion screen
function checkAndShowCompletion() {
	if (!areAllQuestionsAnswered()) {
		alert('Please answer all questions before submitting.');
		return;
	}
	
	showCompletionScreen();
}

// Show quiz completion screen
function showCompletionScreen() {
	// Mark quiz as submitted - locks all answers
	quizSubmitted = true;
	
	// Disable all radio buttons and check button
	document.querySelectorAll('input[type="radio"]').forEach(radio => {
		radio.disabled = true;
	});
	document.getElementById('checkBtn').disabled = true;
	
	// Record that first attempt is complete
	isFirstAttempt = false;
	
	const firstAttemptScore = calculateFirstAttemptScore();
	const currentScore = calculateScore();
	const totalQuestions = quizData.length;
	const firstAttemptPercentage = Math.round((firstAttemptScore / totalQuestions) * 100);
	const currentPercentage = Math.round((currentScore / totalQuestions) * 100);
	
	// Store scores in sessionStorage for profile access
	const quizResults = {
		categories: selectedFields,
		firstAttemptScore: firstAttemptScore,
		firstAttemptPercentage: firstAttemptPercentage,
		currentScore: currentScore,
		currentPercentage: currentPercentage,
		totalQuestions: totalQuestions,
		timestamp: new Date().toISOString(),
		timeTaken: Math.round((Date.now() - quizStartTime) / 1000)
	};
	
	sessionStorage.setItem('lastQuizResults', JSON.stringify(quizResults));
	
	// Hide quiz container and show completion screen
	document.querySelector('.quiz-container').style.display = 'none';
	document.getElementById('completionScreen').style.display = 'flex';
	
	// Populate completion screen
	document.getElementById('firstAttemptScore').textContent = `${firstAttemptScore}/${totalQuestions} (${firstAttemptPercentage}%)`;
	document.getElementById('currentScore').textContent = `${currentScore}/${totalQuestions} (${currentPercentage}%)`;
	document.getElementById('scoreImprovement').textContent = currentScore - firstAttemptScore;
	
	// Generate and show results review
	generateResultsReview();
	
	// Show appropriate message based on performance
	const messageEl = document.getElementById('completionMessage');
	if (currentPercentage === 100) {
		messageEl.textContent = 'Perfect Score! 🎉';
		messageEl.className = 'completion-message perfect';
	} else if (currentPercentage >= 80) {
		messageEl.textContent = 'Excellent Work! 🌟';
		messageEl.className = 'completion-message excellent';
	} else if (currentPercentage >= 60) {
		messageEl.textContent = 'Good Effort! 👍';
		messageEl.className = 'completion-message good';
	} else {
		messageEl.textContent = 'Keep Practicing! 💪';
		messageEl.className = 'completion-message fair';
	}
}

// Retake quiz - creates a new fresh quiz attempt with new question order
function retakeQuiz() {
	// Go back to quiz selection to start a completely new attempt
	// This ensures new question order and resets all tracking
	window.location.href = 'quiz-selection.html';
}

// Return to home
function goHome() {
	window.location.href = 'index.html';
}

// Return to quiz selection
function selectNewQuiz() {
	window.location.href = 'quiz-selection.html';
}

// Generate and display results review showing correct/wrong answers
function generateResultsReview() {
	const reviewContainer = document.getElementById('resultsReview');
	if (!reviewContainer) return;
	
	let reviewHTML = '<h2>Review Your Answers</h2>';
	
	for (let i = 0; i < quizData.length; i++) {
		const question = quizData[i];
		const answer = answeredQuestions[i];
		const format = questionFormats[i];
		
		// Determine correct answer display
		let correctAnswerDisplay = '';
		let questionText = '';
		
		if (format === 'term-to-definition') {
			questionText = `What is the meaning of <strong>${question.term}</strong>?`;
			correctAnswerDisplay = question.advanced || question.definition;
		} else {
			questionText = `Which term matches this definition: <strong>"${question.advanced || question.definition}"</strong>?`;
			correctAnswerDisplay = question.term;
		}
		
		const isCorrect = answer.selectedValue === correctAnswerDisplay;
		const resultClass = isCorrect ? 'correct-answer' : 'incorrect-answer';
		const resultIcon = isCorrect ? '✓' : '✗';
		
		reviewHTML += `
			<div class="review-item ${resultClass}">
				<div class="review-question">
					<strong>Question ${i + 1}:</strong> ${questionText}
				</div>
				<div class="review-user-answer">
					<span class="result-icon ${isCorrect ? 'icon-correct' : 'icon-incorrect'}">${resultIcon}</span>
					<strong>Your Answer:</strong> ${answer.selectedValue}
		`;
		
		if (!isCorrect) {
			reviewHTML += `
					<div class="review-correct-answer">
						<strong>Correct Answer:</strong> ${correctAnswerDisplay}
					</div>
			`;
		}
		
		reviewHTML += `
				</div>
			</div>
		`;
	}
	
	reviewContainer.innerHTML = reviewHTML;
	reviewContainer.style.display = 'block';
}

// Update button states
function updateButtonStates() {
	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');
	const checkBtn = document.getElementById('checkBtn');

	prevBtn.disabled = currentQuestionIndex === 0;
	
	// On last question, check if answered before enabling next
	if (currentQuestionIndex === quizData.length - 1) {
		nextBtn.textContent = answeredQuestions[currentQuestionIndex] ? 'Submit Quiz' : 'Next';
		nextBtn.disabled = false;
	} else {
		nextBtn.textContent = 'Next';
		nextBtn.disabled = false;
	}
}
