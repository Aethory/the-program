/* THE PROGRAM — voice lines. No audio files. The building speaks with the
   cheapest horror we own: the browser's built-in speech synthesis, plus
   WebAudio for machine beeps. Off by default; one tap enables it. */

const Voice = (() => {
  let enabled = false;
  let voice = null;
  const synth = window.speechSynthesis;

  function pick() {
    const voices = synth ? synth.getVoices() : [];
    if (!voices.length) return null;
    const english = voices.filter(v => /\ben/i.test(v.lang));
    const pool = english.length ? english : voices;
    const score = (v) => {
      const n = v.name.toLowerCase();
      if (n.includes('google uk english female')) return 100;
      if (n.includes('google uk english male')) return 95;
      if (n.includes('google us english')) return 90;
      if (/natural|neural/.test(n)) return 85;
      if (n.startsWith('google')) return 70;
      if (n.includes('microsoft zira')) return 20;
      return 10;
    };
    return pool.slice().sort((a, b) => score(b) - score(a))[0];
  }

  function enable(on) {
    enabled = on;
    if (synth) synth.cancel();
    if (enabled && !voice) voice = pick();
    document.getElementById('voice-state').textContent = enabled ? '[ON]' : '[OFF]';
  }

  function speak(text) {
    if (!enabled || !synth || !text) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice || pick();
    voice = u.voice;
    u.rate = 0.96;          // unhurried and calm
    u.pitch = 0.88;         // slightly low, deliberate
    u.volume = 1.0;
    try { synth.speak(u); } catch { /* silent failure is fine */ }
  }

  /* Short machine beep via WebAudio oscillator — for pickups/stamps. */
  let ctx = null;
  function beep(freq = 880, ms = 90, type = 'square', gain = 0.06) {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + ms / 1000);
      o.connect(g); g.connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + ms / 1000);
    } catch { /* no audio available — the building stays quiet */ }
  }

  window.speechSynthesis && window.speechSynthesis.onvoiceschanged === undefined;
  if (synth) synth.onvoiceschanged = () => { voice = pick(); };

  return { enable, speak, beep, get enabled() { return enabled; }, get picked() { return voice ? voice.name : null; } };
})();
