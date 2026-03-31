(function() {
	const popup = document.getElementById('glossaryPopup');
	const glossaryTerms = document.querySelectorAll('.glossary-term');

	let currentPopup = null;
	let currentTerm = null;

	glossaryTerms.forEach(term => {
		term.addEventListener('click', function(e) {
			e.stopPropagation();
			
			const definition = this.getAttribute('data-definition');
			
			// Only show popup if definition exists
			if (!definition) {
				console.warn('Missing definition for term:', this.textContent);
				return;
			}
			
			// Remove existing popup if open
			if (currentPopup) {
				currentPopup.style.display = 'none';
			}

			// Create and show popup
			popup.innerHTML = definition;
			popup.style.display = 'block';
			
			// Store current term for scroll updates
			currentTerm = this;
			
			// Force browser to reflow to get accurate dimensions
			popup.offsetHeight;
			
			// Position popup above the clicked term
			const rect = this.getBoundingClientRect();
			const popupHeight = popup.offsetHeight;
			const popupWidth = popup.offsetWidth;
			
			// Calculate position: center above the word (using scroll values for absolute positioning)
			let top = rect.top + window.scrollY - popupHeight - 12;
			let left = rect.left + window.scrollX + (rect.width / 2) - (popupWidth / 2);
			
			// Keep popup within viewport bounds
			if (left < 10) {
				left = 10;
			}
			if (left + popupWidth > window.innerWidth - 10) {
				left = window.innerWidth - popupWidth - 10;
			}
			
			// If not enough space above, show below instead
			if (top - window.scrollY < 10) {
				top = rect.bottom + window.scrollY + 12;
			}
			
			popup.style.top = top + 'px';
			popup.style.left = left + 'px';

			currentPopup = popup;
		});
	});

	// Update popup position on scroll to keep it with the word
	document.addEventListener('scroll', function() {
		if (currentPopup && currentPopup.style.display === 'block' && currentTerm) {
			const rect = currentTerm.getBoundingClientRect();
			const popupHeight = currentPopup.offsetHeight;
			const popupWidth = currentPopup.offsetWidth;
			
			let top = rect.top + window.scrollY - popupHeight - 12;
			let left = rect.left + window.scrollX + (rect.width / 2) - (popupWidth / 2);
			
			// Keep popup within viewport bounds
			if (left < 10) {
				left = 10;
			}
			if (left + popupWidth > window.innerWidth - 10) {
				left = window.innerWidth - popupWidth - 10;
			}
			
			// If not enough space above, show below instead
			if (top - window.scrollY < 10) {
				top = rect.bottom + window.scrollY + 12;
			}
			
			currentPopup.style.top = top + 'px';
			currentPopup.style.left = left + 'px';
		}
	});

	// Close popup when clicking elsewhere
	document.addEventListener('click', function() {
		if (popup.style.display === 'block') {
			popup.style.display = 'none';
			currentPopup = null;
			currentTerm = null;
		}
	});

	// Close popup when pressing Escape
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			popup.style.display = 'none';
			currentPopup = null;
			currentTerm = null;
		}
	});
})();
