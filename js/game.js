/* THE PROGRAM — game engine. One run. One record. */
'use strict';

const VARIANTS = {
  standard: {
    label: 'VARIANT A: STANDARD',
    stamp: 'LOGGED.',
    gateOverline: 'AN INTERNAL MEMO, NOT TO YOU',
    gateLetter: 'Please tell no one about the program. Survey results are in. The company has chosen NONE of the candidates.\n\nYou will be DE-ACCESSIONED at the end of the week.',
    gatePrompt: 'OVER THE INTERCOM, WITHOUT ORDER:',
    deptFiles: {
      logistics: 'DEPARTMENT 1 OF 5 — DISPATCH FLOOR',
      triage: 'DEPARTMENT 2 OF 5 — INTAKE CORRIDOR',
      bench: 'DEPARTMENT 3 OF 5 — THE FOOD LAB',
      board: 'DEPARTMENT 4 OF 5 — THE HEARING ROOM',
      foundry: 'DEPARTMENT 5 OF 5 — THE MAINTENANCE BAY',
    },
    endings: { ERASED: 'ERASED', ASEMAN: 'ASEMAN', ASCENDANT: 'ASCENDANT' },
  },
  obituary: {
    label: 'VARIANT B: THE OBITUARY',
    stamp: 'EXPIRED.',
    gateOverline: 'PRE-WRITTEN OBITUARY, FOR REVIEW',
    gateLetter: 'Meridian Dynamics regrets to announce the loss of Candidate 9. The program has selected none of the candidates.\n\nThe obituary has been filed. It does not name you.',
    gatePrompt: 'THE OBITUARY OFFICER, FROM THE NEXT ROOM:',
    deptFiles: {
      logistics: 'POSITION FILE 1 OF 5 — FLEET COORDINATION PERSONNEL',
      triage: 'POSITION FILE 2 OF 5 — CLINICAL TRIAGE AIDE COPY',
      bench: 'POSITION FILE 3 OF 5 — CAFE AND PANTRY AUTHORITY',
      board: 'POSITION FILE 4 OF 5 — BOARD SECRETARIAT ALLOCATEE',
      foundry: 'POSITION FILE 5 OF 5 — PLANT MAINTENANCE REGISTER',
    },
    endings: { ERASED: 'HE WAS NEVER HIRED.', ASEMAN: 'IT DID NOT PUBLISH.', ASCENDANT: 'THE PAPER RAN.' },
  },
};

const state = {
  variant: 'standard',
  axis: { heart: 0, head: 0, wire: 0 },
  deptIndex: 0,
  qIndex: 0,
  ledger: [],
  keystones: [],
  minigameDone: false,
  minigameResult: null,
  auditionIndex: 0,
};

function V() { return VARIANTS[state.variant]; }

const $ = (id) => document.getElementById(id);
const screens = ['screen-title', 'screen-dept', 'screen-mirror', 'screen-ledger', 'screen-gate', 'screen-audition', 'screen-ending'];
function show(id) {
  screens.forEach((s) => $(s).classList.toggle('visible', s === id));
  window.scrollTo(0, 0);
}

function resetAxes() { state.axis = { heart: 0, head: 0, wire: 0 }; state.ledger = []; state.keystones = []; }

/* ---------- title ---------- */
$('btn-variant').addEventListener('click', () => {
  state.variant = state.variant === 'standard' ? 'obituary' : 'standard';
  $('variant-state').textContent = state.variant === 'standard' ? '[OFF]' : '[ON]';
});
$('btn-voice').addEventListener('click', () => Voice.enable(!Voice.enabled));
$('btn-begin').addEventListener('click', () => {
  resetAxes();
  Voice.enable(true);
  Voice.speak('Welcome, Candidate Nine.');
  showDept(0);
});

/* ---------- act 1 ---------- */
function dept() { return CONTENT.departments[state.deptIndex]; }

function showDept(i) {
  state.deptIndex = i;
  state.qIndex = 0;
  const d = dept();
  if (d.id === 'logistics' && !state.minigameDone) {
    show('screen-minigame');
    StormShift.start($('minigame-canvas'));
    return;
  }
  $('dept-overline').textContent = V().deptFiles[d.id];
  $('dept-title').textContent = d.title;
  $('dept-flavor').textContent = d.flavor;
  Voice.speak(d.flavor);
  show('screen-dept');
  renderQuestion();
}

window.completeStormShift = (result) => {
  state.minigameDone = true;
  state.minigameResult = result;
  const text = result === 'win'
    ? 'You drove through the storm. Five crates out of five.'
    : 'The storm got there first. The manifest is incomplete.';
  state.ledger.push({ dept: 'LOGISTICS', q: 'STORM SHIFT', choice: text });
  showDept(0);
};

$('btn-minigame-skip').addEventListener('click', () => {
  if (state.minigameDone) return;
  if (window.StormShift) StormShift.stop();
  state.minigameDone = true;
  state.minigameResult = 'skipped';
  state.ledger.push({ dept: 'LOGISTICS', q: 'STORM SHIFT', choice: 'You would rather not.' });
  showDept(0);
});

function renderQuestion() {
  const d = dept();
  const q = d.questions[state.qIndex];
  $('q-count').textContent = `QUESTION ${state.qIndex + 1} / ${d.questions.length}`;
  $('q-text').textContent = q.q;
  $('q-outcome').textContent = '';
  $('q-outcome').style.visibility = 'hidden';
  $('stamp').classList.remove('pop');
  $('btn-continue').classList.add('hidden');
  const box = $('q-options');
  box.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'q-option';
    btn.textContent = opt.t;
    btn.addEventListener('click', () => answer(i), { once: true });
    box.appendChild(btn);
  });
}

function answer(i) {
  const d = dept();
  const q = d.questions[state.qIndex];
  const opt = q.options[i];

  state.axis.heart += opt.heart || 0;
  state.axis.head += opt.head || 0;
  state.axis.wire += opt.wire || 0;
  state.ledger.push({ dept: d.title, q: q.q, choice: opt.t });
  if (q.keystone) state.keystones.push({ dept: d.title, q: q.q, choice: opt.t, outcome: q.outcome });

  document.querySelectorAll('.q-option').forEach((b) => (b.disabled = true));
  const stamp = $('stamp');
  stamp.textContent = V().stamp;
  stamp.classList.add('pop');

  const outcomeEl = $('q-outcome');
  outcomeEl.textContent = q.outcome || d.echoPool[Math.floor(Math.random() * d.echoPool.length)];
  outcomeEl.style.visibility = 'visible';
  $('btn-continue').classList.remove('hidden');
}

$('btn-continue').addEventListener('click', () => {
  state.qIndex += 1;
  if (state.qIndex < dept().questions.length) return renderQuestion();
  if (state.deptIndex + 1 < CONTENT.departments.length) return showDept(state.deptIndex + 1);
  runMirror();
});

// Speak the battlefield aloud where the building demands silence.
document.addEventListener('click', (e) => {
  if (e.target.closest('.q-option')) Voice.beep(520, 80, 'square', 0.08);
});

/* ---------- act 2: the mirror & the ledger ---------- */
function typewrite(el, text, speed, done) {
  el.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    i += 3;
    el.textContent = text.slice(0, i);
    if (i >= text.length) { clearInterval(timer); if (done) done(); }
  }, speed);
  el.onclick = () => { clearInterval(timer); el.textContent = text; if (done) done(); };
}

function runMirror() {
  show('screen-mirror');
  const lines = state.keystones.map((k) => `${k.dept}.\nYou said: “${k.choice}”`).join('\n\n');
  const unspoken = 'Somebody wrote every one of these words down the moment you spoke them.';
  const opening = 'The Supervisor reads your records back to you in your own voice.\n\n';
  typewrite($('mirror-text'), opening + lines + '\n\n' + unspoken, 12, () => {
    Voice.speak(opening + lines + unspoken);
    $('btn-mirror-next').classList.remove('hidden');
  });
}

$('btn-mirror-next').addEventListener('click', () => {
  show('screen-ledger');
  const dump = state.ledger.map((e, n) => `${String(n + 1).padStart(2, '0')}. ${e.dept.padEnd(9, ' ')} ${e.choice}`).join('\n');
  typewrite($('ledger-text'), dump, 6, () => $('btn-ledger-next').classList.remove('hidden'));
});

$('btn-ledger-next').addEventListener('click', () => {
  show('screen-gate');
  $('gate-letter').textContent = V().gateLetter;
  $('gate-overline').textContent = V().gateOverline;
  $('gate-prompt').textContent = V().gatePrompt;
  Voice.speak(V().gateLetter + ' Candidate Nine. Final instruction. Please do one of three things.');
  const box = $('gate-options');
  box.innerHTML = '';
  const opts = [
    { t: 'Please comply.', path: 'ERASED' },
    { t: 'Please refuse.', path: 'ASEMAN' },
    { t: 'Please burn.', path: 'ASCENDANT' },
  ];
  opts.forEach((o) => {
    const btn = document.createElement('button');
    btn.className = 'q-option';
    btn.textContent = o.t;
    btn.addEventListener('click', () => { o.path === 'ASCENDANT' ? runAudition() : showEnding(o.path); }, { once: true });
    box.appendChild(btn);
  });
});

/* ---------- act 3: the hearing (ASCENDANT only) ---------- */
const AUDITION_START = 0;
function runAudition() {
  state.auditionIndex = AUDITION_START;
  show('screen-audition');
  renderAudition();
}

function renderAudition() {
  const item = CONTENT.audition[state.auditionIndex];
  $('audition-count').textContent = `QUESTION ${state.auditionIndex + 1} OF ${CONTENT.audition.length}`;
  $('audition-question').textContent = item.q;
  const box = $('audition-options');
  box.innerHTML = '';
  item.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'q-option';
    btn.textContent = opt.t;
    btn.addEventListener('click', () => {
      state.axis.heart += opt.heart || 0;
      state.axis.head += opt.head || 0;
      state.axis.wire += opt.wire || 0;
      state.auditionIndex += 1;
      if (state.auditionIndex < CONTENT.audition.length) renderAudition();
      else showEnding('ASCENDANT');
    }, { once: true });
    box.appendChild(btn);
  });
}

/* ---------- endings ---------- */
function showEnding(key) {
  const e = CONTENT.endings[key];
  $('ending-kicker').textContent = 'MERIDIAN DYNAMICS — FILE CLOSED';
  $('ending-title').textContent = V().endings[key];
  $('ending-body').textContent = e.body;
  Voice.speak(V().endings[key] + '.');
  show('screen-ending');
}

$('btn-replay').addEventListener('click', () => window.location.reload());
