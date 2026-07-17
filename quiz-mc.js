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

function getQuizHistoryKey() {
	return `quizHistory:${selectedFields.slice().sort().join('|')}`;
}

function loadQuizHistory() {
	const saved = localStorage.getItem(getQuizHistoryKey());
	if (!saved) return [];
	try {
		return JSON.parse(saved) || [];
	} catch (error) {
		console.warn('Could not parse quiz history:', error);
		return [];
	}
}

function saveQuizResult(historyEntry) {
	const history = loadQuizHistory();
	history.push(historyEntry);
	const key = getQuizHistoryKey();
	const value = JSON.stringify(history);
	console.log(`SAVE KEY: ${key}`);
	console.log(`SAVE VALUE: ${value}`);
	localStorage.setItem(key, value);
	return history;
}

function formatScoreText(score, total) {
	const percent = total === 0 ? 0 : Math.round((score / total) * 100);
	return `${score}/${total} (${percent}%)`;
}

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
	const overviewBtn = document.getElementById('overviewBtn');
	const navigatorCloseBtn = document.getElementById('navigatorCloseBtn');
	const navigatorOverlay = document.getElementById('questionNavigatorOverlay');
	const options = document.querySelectorAll('.option');
	const retakeBtn = document.getElementById('retakeBtn');
	const homeBtn = document.getElementById('homeBtn');
	const newQuizBtn = document.getElementById('newQuizBtn');

	checkBtn.addEventListener('click', checkAnswer);
	prevBtn.addEventListener('click', goToPreviousQuestion);
	nextBtn.addEventListener('click', goToNextQuestion);
	if (overviewBtn) overviewBtn.addEventListener('click', openQuestionNavigator);
	if (navigatorCloseBtn) navigatorCloseBtn.addEventListener('click', closeQuestionNavigator);
	if (navigatorOverlay) navigatorOverlay.addEventListener('click', function(event) {
		if (event.target === navigatorOverlay) {
			closeQuestionNavigator();
		}
	});

	if (retakeBtn) retakeBtn.addEventListener('click', retakeQuiz);
	if (homeBtn) homeBtn.addEventListener('click', goHome);
	if (newQuizBtn) newQuizBtn.addEventListener('click', selectNewQuiz);

	options.forEach((option) => {
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

	updateQuestionNavigator();
}

// Reset question UI
function resetQuestionUI() {
	const options = document.querySelectorAll('.option');
	const feedbackMessage = document.getElementById('feedbackMessage');
	const checkBtn = document.getElementById('checkBtn');
	const radios = document.querySelectorAll('input[type="radio"]');

	options.forEach(option => {
		option.classList.remove('correct', 'incorrect', 'disabled');
	});

	radios.forEach(radio => {
		radio.checked = false;
		radio.disabled = false;
	});

	feedbackMessage.textContent = '';
	feedbackMessage.className = 'feedback-message';
	checkBtn.disabled = false;
	checkBtn.textContent = 'Check';
}

function disableQuestionInteractivity() {
	document.querySelectorAll('input[type="radio"]').forEach(radio => {
		radio.disabled = true;
	});
	document.querySelectorAll('.option').forEach(option => {
		option.classList.add('disabled');
	});
}

function findCorrectLabel() {
	return Array.from(document.querySelectorAll('[id^="optionLabel"]')).find(label => label.dataset.isCorrect === 'true');
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
	const correctLabel = findCorrectLabel();

	// Store the answer
	answeredQuestions[currentQuestionIndex] = {
		selectedIndex: selectedIndex,
		isCorrect: isCorrect,
		selectedValue: selectedLabel.dataset.optionValue,
		correctValue: correctLabel ? correctLabel.dataset.optionValue : ''
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
		if (correctLabel) {
			correctLabel.closest('.option').classList.add('correct');
		}
		feedbackMessage.textContent = 'Incorrect.';
		feedbackMessage.className = 'feedback-message error';
	}

	disableQuestionInteractivity();
	checkBtn.disabled = true;
	updateQuestionNavigator();
}

// Restore answer state
function restoreAnswerState(questionIndex) {
	const answer = answeredQuestions[questionIndex];
	if (answer) {
		const selectedLabel = document.getElementById(`optionLabel${answer.selectedIndex}`);
		const optionElement = selectedLabel.closest('.option');
		const feedbackMessage = document.getElementById('feedbackMessage');
		const radios = document.querySelectorAll('input[type="radio"]');
		const correctLabel = findCorrectLabel();

		radios[answer.selectedIndex].checked = true;

		if (answer.isCorrect) {
			optionElement.classList.add('correct');
			const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
			feedbackMessage.textContent = randomMessage;
			feedbackMessage.className = 'feedback-message success';
		} else {
			optionElement.classList.add('incorrect');
			if (correctLabel) {
				correctLabel.closest('.option').classList.add('correct');
			}
			feedbackMessage.textContent = 'Incorrect.';
			feedbackMessage.className = 'feedback-message error';
		}

		disableQuestionInteractivity();
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

function openQuestionNavigator() {
	document.getElementById('questionNavigatorOverlay').style.display = 'flex';
	renderQuestionNavigator();
}

function closeQuestionNavigator() {
	document.getElementById('questionNavigatorOverlay').style.display = 'none';
}

function renderQuestionNavigator() {
	const grid = document.getElementById('questionNavigatorGrid');
	grid.innerHTML = '';

	for (let i = 0; i < quizData.length; i++) {
		const state = answeredQuestions[i] ? (answeredQuestions[i].isCorrect ? 'correct' : 'incorrect') : 'unanswered';
		const item = document.createElement('button');
		item.type = 'button';
		item.className = `navigator-item ${state}`;
		if (i === currentQuestionIndex) {
			item.classList.add('active');
		}
		item.textContent = i + 1;
		item.addEventListener('click', function() {
			currentQuestionIndex = i;
			displayQuestion();
			closeQuestionNavigator();
		});
		grid.appendChild(item);
	}
}

function updateQuestionNavigator() {
	const overlay = document.getElementById('questionNavigatorOverlay');
	if (overlay && overlay.style.display === 'flex') {
		renderQuestionNavigator();
	}
}

function getFormattedQuestionInfo(index) {
	const question = quizData[index];
	const format = questionFormats[index];
	if (format === 'term-to-definition') {
		return {
			questionText: `What is the meaning of ${question.term}?`,
			correctAnswer: question.advanced || question.definition
		};
	}
	return {
		questionText: `Which term matches this definition: "${question.advanced || question.definition}"?`,
		correctAnswer: question.term
	};
}

function populateReviewList() {
	const reviewContainer = document.getElementById('reviewList');
	reviewContainer.innerHTML = '';
	const incorrectIndices = Object.keys(answeredQuestions)
		.map(Number)
		.filter(index => !answeredQuestions[index].isCorrect)
		.sort((a, b) => a - b);

	if (incorrectIndices.length === 0) {
		reviewContainer.innerHTML = '<p class="no-incorrect">You answered all questions correctly. Great job!</p>';
		return;
	}

	incorrectIndices.forEach(index => {
		const info = getFormattedQuestionInfo(index);
		const answer = answeredQuestions[index];
		const item = document.createElement('div');
		item.className = 'review-item';
		item.innerHTML = `
			<div><span class="review-label">Question ${index + 1}:</span> ${info.questionText}</div>
			<p><span class="review-label">Your answer:</span> <span class="review-answer incorrect">${answer.selectedValue}</span></p>
			<p><span class="review-label">Correct answer:</span> <span class="review-answer correct">${answer.correctValue || info.correctAnswer}</span></p>
		`;
		reviewContainer.appendChild(item);
	});
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

	const previousHistory = loadQuizHistory();
	const lastAttempt = previousHistory.length ? previousHistory[previousHistory.length - 1] : null;
	const bestAttempt = previousHistory.length ? previousHistory.reduce((best, attempt) => {
		return attempt.percentage > best.percentage ? attempt : best;
	}, previousHistory[0]) : null;

	sessionStorage.setItem('lastQuizResults', JSON.stringify(quizResults));
	saveQuizResult({
		score: currentScore,
		percentage: currentPercentage,
		totalQuestions: totalQuestions,
		timestamp: quizResults.timestamp
	});

	// Hide quiz container and show completion screen
	document.querySelector('.quiz-container').style.display = 'none';
	document.getElementById('completionScreen').style.display = 'flex';
	document.getElementById('completionScreen').scrollTop = 0;

	// Populate completion screen
	document.getElementById('firstAttemptScore').textContent = `${firstAttemptScore}/${totalQuestions} (${firstAttemptPercentage}%)`;
	document.getElementById('currentScore').textContent = `${currentScore}/${totalQuestions} (${currentPercentage}%)`;
	document.getElementById('finalScoreSummary').textContent = `${currentScore}/${totalQuestions} correct (${currentPercentage}%)`;

	const previousSummaryEl = document.getElementById('previousAttemptSummary');
	const bestSummaryEl = document.getElementById('bestAttemptSummary');
	const improvementSummaryEl = document.getElementById('improvementSummary');

	if (lastAttempt) {
		previousSummaryEl.textContent = `Last attempt: ${lastAttempt.score}/${lastAttempt.totalQuestions} (${lastAttempt.percentage}%)`;
	} else {
		previousSummaryEl.textContent = 'First attempt';
	}

	if (bestAttempt && (!lastAttempt || bestAttempt.percentage !== lastAttempt.percentage)) {
		bestSummaryEl.textContent = `Best score: ${bestAttempt.score}/${bestAttempt.totalQuestions} (${bestAttempt.percentage}%)`;
	} else {
		bestSummaryEl.textContent = '';
	}

	if (!lastAttempt) {
		improvementSummaryEl.textContent = 'Improvement: First attempt';
	} else {
		const diff = currentPercentage - lastAttempt.percentage;
		const sign = diff >= 0 ? '+' : '';
		improvementSummaryEl.textContent = `${sign}${diff}% from last attempt`;
	}

	document.getElementById('scoreImprovement').textContent = currentScore - firstAttemptScore;
	populateReviewList();
	
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

// Retake quiz - reset without creating new quiz session
function retakeQuiz() {
	currentQuestionIndex = 0;
	answeredQuestions = {}; // Reset attempts but keep first attempt tracked
	firstAttemptAnswers = {};
	isFirstAttempt = true;
	quizSubmitted = false;
	questionFormats = {};
	randomizeQuestionOrder();
	quizStartTime = Date.now();
	
	// Hide completion screen and show quiz
	document.querySelector('.quiz-container').style.display = 'block';
	document.getElementById('completionScreen').style.display = 'none';
	
	// Reset UI
	resetQuestionUI();
	displayQuestion();
}

// Return to home
function goHome() {
	window.location.href = 'index.html';
}

// Return to quiz selection
function selectNewQuiz() {
	window.location.href = 'quiz-selection.html';
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
