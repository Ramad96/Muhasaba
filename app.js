/* === Prompts === */
const PROMPTS = [
  "What is one thing you are grateful to Allah for today, and why does it feel significant right now?",
  "Where did you feel closest to Allah today — even in a small moment?",
  "Is there something weighing on your heart? Write it down honestly, as if speaking to One who already knows.",
  "What intention do you want to carry into tomorrow?",
  "Reflect on a moment today when you could have shown more patience. What made it hard?",
  "Who in your life deserves more of your kindness? What is one small way you could show it?",
  "What does your heart most need to let go of right now?",
  "Think of a blessing you often overlook. Describe it as if seeing it for the first time.",
  "Is there something you have been delaying that you know, in your heart, is right to do?",
  "What does contentment (قناعة) mean to you in this season of your life?",
  "Write about a quality in someone you admire. How might you cultivate a little of it in yourself?",
  "How have you experienced the mercy of Allah — this week, this month, this year?",
  "What are you afraid of? Offer that fear gently to Allah in writing.",
  "Reflect on a time you made a mistake. What did it teach you? Have you been gentle enough with yourself since?",
  "What does your day look like when your heart is at peace? What would bring you closer to that today?",
  "Write a letter of thanks — to Allah, or to someone in your life — that you may never send.",
  "What part of your character feels like it is growing? What part still needs tending?",
  "Where do you find stillness? How often do you return to it?",
  "Describe something beautiful you witnessed today — in nature, in a person, in a moment.",
  "What does it mean to trust Allah fully? Where do you find that trust hardest to hold?",
  "If you could ask Allah one question, what would it be?",
  "What habit or pattern keeps pulling you away from your best self? Write about it without judgement.",
  "What small act of sadaqah — generosity — could you offer tomorrow?",
  "Reflect on the word sabr (صبر). Where is Allah asking you for patience right now?",
  "What would you like people to remember about you? Are you living in a way that reflects that?",
  "Write about a du'a that has been on your lips lately. What are you really asking for?",
  "Who needs your forgiveness — including yourself?",
  "What does home feel like to you? Where do you feel most like yourself?",
  "Reflect on a verse or hadith that has stayed with you. Why does it hold you?",
  "If today were your last day, what would you most wish you had said or done? Let that answer guide something this week.",
];

/* === Ayahs === */
const AYAHS = [
  { text: "Verily, with hardship comes ease.", ref: "Quran 94:6" },
  { text: "And He is with you wherever you are.", ref: "Quran 57:4" },
  { text: "Indeed, Allah is with the patient.", ref: "Quran 2:153" },
  { text: "And your Lord says, 'Call upon Me; I will respond to you.'", ref: "Quran 40:60" },
  { text: "Unquestionably, by the remembrance of Allah hearts are assured.", ref: "Quran 13:28" },
  { text: "He knows what is within the hearts.", ref: "Quran 3:119" },
  { text: "And We are closer to him than his jugular vein.", ref: "Quran 50:16" },
  { text: "Do not lose hope in the mercy of Allah.", ref: "Quran 39:53" },
  { text: "So remember Me; I will remember you.", ref: "Quran 2:152" },
  { text: "Indeed, Allah does not allow to be lost the reward of those who do good.", ref: "Quran 9:120" },
];

/* === State === */
let todayKey = getTodayKey();
let currentPromptIndex = getDailyPromptIndex();
let saveTimer = null;

/* === Init === */
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  renderDate();
  renderPrompt();
  renderAyah();
  loadReflection();
  loadReminder();
  if (localStorage.getItem('muhasabah_prompt_open_' + getTodayKey()) === '1') {
    showPrompt();
  }
});

/* ============================================================
   THEME
   ============================================================ */
function setTheme(pref) {
  localStorage.setItem('muhasabah_theme', pref);
  applyTheme(pref);
  updateThemePicker(pref);
}

function applyTheme(pref) {
  const root = document.documentElement;
  const resolved = pref === 'device'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : pref;
  root.setAttribute('data-theme', resolved);
  root.setAttribute('data-theme-pref', pref);
}

function updateThemePicker(pref) {
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeOpt === pref);
  });
}

function loadTheme() {
  const saved = localStorage.getItem('muhasabah_theme') || 'device';
  applyTheme(saved);
  updateThemePicker(saved);
  // Respond to OS theme changes when in device mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if ((localStorage.getItem('muhasabah_theme') || 'device') === 'device') {
      applyTheme('device');
    }
  });
}

/* === Navigation === */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelector(`[data-page="${name}"]`).classList.add('active');
}

/* === Date === */
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function renderDate() {
  const el = document.getElementById('date-display');
  const d = new Date();
  el.textContent = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

/* === Prompt === */
function getDailyPromptIndex() {
  const stored = localStorage.getItem('muhasabah_prompt_' + getTodayKey());
  if (stored !== null) return parseInt(stored, 10);
  const seed = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return parseInt(seed, 10) % PROMPTS.length;
}

function renderPrompt() {
  document.getElementById('prompt-text').textContent = PROMPTS[currentPromptIndex];
}

function showPrompt() {
  document.getElementById('prompt-card').style.display = 'block';
  document.getElementById('prompt-toggle-btn').innerHTML = '<span class="prompt-toggle-icon">✦</span> Hide prompt';
  localStorage.setItem('muhasabah_prompt_open_' + todayKey, '1');
}

function hidePrompt() {
  document.getElementById('prompt-card').style.display = 'none';
  document.getElementById('prompt-toggle-btn').innerHTML = '<span class="prompt-toggle-icon">✦</span> Suggest a prompt';
  localStorage.removeItem('muhasabah_prompt_open_' + todayKey);
}

function togglePrompt() {
  const card = document.getElementById('prompt-card');
  if (card.style.display === 'none' || card.style.display === '') {
    showPrompt();
  } else {
    hidePrompt();
  }
}

function newPrompt() {
  currentPromptIndex = (currentPromptIndex + 1) % PROMPTS.length;
  localStorage.setItem('muhasabah_prompt_' + todayKey, currentPromptIndex);
  document.getElementById('prompt-text').textContent = PROMPTS[currentPromptIndex];
}

/* === Ayah === */
function renderAyah() {
  const seed = parseInt(getTodayKey().replace(/-/g, ''), 10);
  const a = AYAHS[seed % AYAHS.length];
  document.getElementById('ayah-text').textContent = `"${a.text}"`;
  document.getElementById('ayah-ref').textContent = a.ref;
}

/* === Reflection === */
function loadReflection() {
  const saved = localStorage.getItem('muhasabah_reflection_' + todayKey) || '';
  const ta = document.getElementById('reflection-input');
  ta.value = saved;
  updateWordCount(saved);
}

function saveReflection() {
  const text = document.getElementById('reflection-input').value;
  localStorage.setItem('muhasabah_reflection_' + todayKey, text);
  updateWordCount(text);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flashSaved, 800);
}

function updateWordCount(text) {
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  document.getElementById('word-count').textContent = words === 1 ? '1 word' : `${words} words`;
}

function flashSaved() {
  const el = document.getElementById('saved-notice');
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 1800);
}

function saveAndFinish() {
  saveReflection();
  flashSaved();
}

/* === Settings === */
function registerInterest() {
  const email = document.getElementById('reminder-email').value.trim();
  if (!email || !email.includes('@')) {
    document.getElementById('reminder-email').focus();
    return;
  }
  localStorage.setItem('muhasabah_reminder_interest', email);
  document.getElementById('reminder-form').style.display = 'none';
  document.getElementById('registered-confirm').style.display = 'block';
}

function loadReminder() {
  if (localStorage.getItem('muhasabah_reminder_interest')) {
    document.getElementById('reminder-form').style.display = 'none';
    document.getElementById('registered-confirm').style.display = 'block';
  }
}

function clearAllData() {
  const confirmed = window.confirm(
    'This will permanently delete all your saved reflections. This cannot be undone. Continue?'
  );
  if (!confirmed) return;
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith('muhasabah_')) localStorage.removeItem(k);
  });
  loadReflection();
  alert('All reflections cleared.');
}
