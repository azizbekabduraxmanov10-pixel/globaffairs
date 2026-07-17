// Fallback data and loader for MUN guideline steps.
const munGuidelinesData = [
  {
    "title": "Preparing Your Position",
    "advanced": "Research the country's official positions, recent votes, and relevant treaties. Prepare policy proposals grounded in primary sources and anticipate counter-arguments.",
    "simple": "Find out what your country usually says and why. Make a few clear points you can explain.",
    "example": "Cite a recent UN resolution your country supported."
  },
  {
    "title": "Speech Structure",
    "advanced": "Open with a concise thesis that frames your country's priorities, support it with evidence, and conclude with a clear call-to-action or recommendation.",
    "simple": "Start with what your country cares about, give 2-3 reasons, end by saying what you want others to do.",
    "example": "Begin: 'Thank you chair — the Republic of X believes...'"
  },
  {
    "title": "Negotiation and Amendments",
    "advanced": "Be proactive in drafting amendment language, offer compromises, and document agreed changes precisely to avoid ambiguity.",
    "simple": "Work with others to change wording so everyone can agree.",
    "example": "Propose adding a clause that clarifies financial assistance amounts."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = munGuidelinesData;
}

(async () => {
  function titleize(text) {
    return text.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  async function loadGuidelines() {
    try {
      if (window.munGuidelinesData) return window.munGuidelinesData;
      const res = await fetch('data/mun_guidelines.json');
      if (!res.ok) throw new Error('Failed to fetch data/mun_guidelines.json: ' + res.status);
      const data = await res.json();
      return data || [];
    } catch (err) {
      console.error(err);
      // fallback to embedded data
      return munGuidelinesData;
    }
  }

  function getViews() {
    const saved = localStorage.getItem('munGuidelineViews');
    if (!saved) return [];
    try { return JSON.parse(saved) || []; } catch { return []; }
  }

  function saveViews(v) { localStorage.setItem('munGuidelineViews', JSON.stringify(v)); }
  function recordView(index) {
    const idx = Number(index);
    if (Number.isNaN(idx)) return;
    const views = getViews();
    if (!views.includes(idx)) { views.push(idx); saveViews(views); }
  }

  const params = new URLSearchParams(window.location.search);
  let index = parseInt(params.get('index'), 10);

  const guidelines = await loadGuidelines();
  if (!guidelines || !guidelines.length) {
    const errorEl = document.getElementById('errorText');
    if (errorEl) {
      errorEl.textContent = 'No MUN guidelines found.';
    }
    return;
  }

  if (Number.isNaN(index) || index < 0 || index >= guidelines.length) index = 0;

  const stepTitle = document.getElementById('stepTitle');
  const advancedEl = document.getElementById('advanced');
  const simpleEl = document.getElementById('simpleText');
  const simpleContainer = document.getElementById('simpleExplanation');
  const toggleBtn = document.getElementById('toggleSimple');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const backBtn = document.getElementById('backBtn');
  const errorText = document.getElementById('errorText');

  function render() {
    const step = guidelines[index];
    stepTitle.innerText = step.title || `Step ${index + 1}`;
    advancedEl.innerHTML = `<strong>Advanced:</strong> ${step.advanced || 'No advanced text available.'}`;
    simpleEl.textContent = step.simple || 'No simpler explanation available.';
    simpleContainer.classList.remove('show');

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === guidelines.length - 1;

    history.replaceState(null, '', `mun-guideline.html?index=${index}`);
    recordView(index);
  }

  toggleBtn.addEventListener('click', () => {
    simpleContainer.classList.toggle('show');
    toggleBtn.textContent = simpleContainer.classList.contains('show') ? 'Hide simpler explanation' : 'Struggling? Show simpler explanation';
  });

  prevBtn.addEventListener('click', () => { if (index > 0) { index -= 1; render(); } });
  nextBtn.addEventListener('click', () => { if (index < guidelines.length - 1) { index += 1; render(); } });

  backBtn.href = 'index.html';

  render();
  if (errorText) errorText.textContent = '';
})();
