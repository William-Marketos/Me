/* ═══════════════════════════════════════════════════
   WILLIAM MARKETOS — script.js
   Western / Monument Valley Theme
   Features:
     - Custom cursor tracking
     - Scroll reveal (IntersectionObserver)
     - Navbar scroll behaviour + mobile toggle
     - 3D tilt cards
     - Dust mote particle system (hero) — LARGE & DRAMATIC
     - Night sky stars (footer)
     - Stat counter animation
     - Soundboard — plays MP3s from Sounds/ folder
     - Gunshot on click (suppressed during soundboard use)
     - Keyboard shortcuts (Q W E R / A S D F / Z X C V)
     - Animated visualizer bars
     - Smooth anchor navigation
     - Back-to-top button
     - Footer year
   ═══════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. CUSTOM CURSOR + GUNSHOT ON CLICK
      (suppressed while soundboard buttons are active)
───────────────────────────────────────── */
const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

// Flag — true while a soundboard pad is being pressed
let soundboardActive = false;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Gunshot — fires on every general click, EXCEPT soundboard pads
const gunshotEl = document.getElementById('gunshot');
document.addEventListener('click', () => {
  if (soundboardActive) return;
  if (gunshotEl) {
    gunshotEl.currentTime = 0;
    gunshotEl.play().catch(() => {});
  }
});

/* ─────────────────────────────────────────
   AUDIO CONTEXT (shared across the page)
───────────────────────────────────────── */
let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function masterOut(ctx, vol = 0.7) {
  const g = ctx.createGain();
  g.gain.value = Math.min(1, vol);
  g.connect(ctx.destination);
  return g;
}

// Pre-load all soundboard MP3s once DOM is ready
window.addEventListener('DOMContentLoaded', async () => {
  const ctx = getCtx();
  await loadAllSounds(ctx);
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();


/* ─────────────────────────────────────────
   2. NAVBAR
───────────────────────────────────────── */
const navbar     = document.getElementById('navbar');
const navToggle  = document.getElementById('navToggle');
const navLinksCt = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinksCt.classList.toggle('open');
  document.body.style.overflow = navLinksCt.classList.contains('open') ? 'hidden' : '';
});

navLinksCt.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinksCt.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ─────────────────────────────────────────
   3. SCROLL REVEAL
───────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = Array.from(entry.target.parentElement.children);
    const idx      = siblings.indexOf(entry.target);
    const delay    = (idx % 5) * 90;
    entry.target.style.transitionDelay = delay + 'ms';
    entry.target.classList.add('visible');
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-img').forEach(el => revealObs.observe(el));


/* ─────────────────────────────────────────
   4. 3D TILT CARDS
───────────────────────────────────────── */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const dx  = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy  = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    card.style.transform = `perspective(700px) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});


/* ─────────────────────────────────────────
   5. STAT COUNTER
───────────────────────────────────────── */
const statObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const end = parseInt(el.dataset.target, 10);
    if (!end) return;
    let cur   = 0;
    const inc = Math.max(1, Math.floor(end / 55));
    const t   = setInterval(() => {
      cur += inc;
      if (cur >= end) { cur = end; clearInterval(t); }
      el.textContent = cur;
    }, 25);
    statObs.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-num').forEach(el => statObs.observe(el));


/* ─────────────────────────────────────────
   6. DUST MOTES PARTICLE SYSTEM (HERO)
      Large, dramatic Monument Valley dust
───────────────────────────────────────── */
function initDustMotes() {
  const container = document.getElementById('dustMotes');
  if (!container) return;
  container.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:3;overflow:hidden;';

  const count = 55;
  for (let i = 0; i < count; i++) {
    const mote  = document.createElement('div');

    // Mix of small sparks and large drifting dust clouds
    const isBig  = Math.random() > 0.55;
    const size   = isBig
      ? Math.random() * 22 + 10    // large: 10–32px
      : Math.random() * 7  + 3;    // small: 3–10px
    const x      = Math.random() * 110 - 5;  // allow slight off-screen
    const startY = Math.random() * 100;
    const dur    = Math.random() * 22 + 14;
    const delay  = Math.random() * -30;
    const drift  = (Math.random() - 0.5) * 120;

    // Colour palette: warm golds, oranges, and dusty whites
    const palettes = [
      `rgba(${220 + (Math.random()*20|0)}, ${140 + (Math.random()*40|0)}, ${30 + (Math.random()*20|0)},`,   // gold-orange
      `rgba(${200 + (Math.random()*30|0)}, ${100 + (Math.random()*30|0)}, ${20 + (Math.random()*20|0)},`,   // burnt orange
      `rgba(${240 + (Math.random()*15|0)}, ${200 + (Math.random()*30|0)}, ${120 + (Math.random()*30|0)},`,  // pale gold
      `rgba(${180 + (Math.random()*30|0)}, ${80  + (Math.random()*30|0)}, ${10 + (Math.random()*15|0)},`,   // deep rust
    ];
    const col = palettes[Math.floor(Math.random() * palettes.length)];
    const alpha = isBig
      ? (Math.random() * 0.25 + 0.08)   // large: softer
      : (Math.random() * 0.55 + 0.25);  // small: punchier

    mote.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${startY}%;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${col}${alpha});
      ${isBig ? `filter: blur(${Math.random()*4+2}px);` : ''}
      animation: moteFloat ${dur}s ${delay}s ease-in-out infinite;
      --drift: ${drift}px;
    `;
    container.appendChild(mote);
  }

  // Inject mote keyframes once
  if (!document.getElementById('moteKF')) {
    const s = document.createElement('style');
    s.id = 'moteKF';
    s.textContent = `
      @keyframes moteFloat {
        0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
        8%   { opacity: 1; }
        45%  { transform: translateY(-35vh) translateX(var(--drift)) scale(1.4); }
        88%  { opacity: 0.5; }
        100% { transform: translateY(-85vh) translateX(calc(var(--drift)*1.6)) scale(0.5); opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }
}
initDustMotes();


/* ─────────────────────────────────────────
   7. NIGHT SKY STARS (FOOTER)
───────────────────────────────────────── */
function initNightSky() {
  const sky = document.getElementById('footerSky');
  if (!sky) return;
  sky.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;';

  const starCount = 120;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    const s    = Math.random() * 2.5 + 0.5;
    const twinkle = Math.random() > 0.4;
    const dur  = Math.random() * 3 + 2;
    const del  = Math.random() * -5;

    star.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top:  ${Math.random() * 80}%;
      width: ${s}px; height: ${s}px;
      border-radius: 50%;
      background: rgba(212,184,140, ${Math.random() * 0.6 + 0.3});
      ${twinkle ? `animation: starTwinkle ${dur}s ${del}s ease-in-out infinite;` : ''}
    `;
    sky.appendChild(star);
  }

  // Occasional shooting star
  function shootingStar() {
    const el = document.createElement('div');
    const y  = Math.random() * 40;
    el.style.cssText = `
      position: absolute;
      top: ${y}%;
      left: -5%;
      width: 120px; height: 2px;
      background: linear-gradient(90deg, transparent, rgba(232,184,75,0.9), transparent);
      border-radius: 50%;
      animation: shootStar 1.2s ease forwards;
      transform: rotate(-25deg);
    `;
    sky.appendChild(el);
    setTimeout(() => el.remove(), 1400);
    setTimeout(shootingStar, Math.random() * 8000 + 4000);
  }
  setTimeout(shootingStar, 3000);

  if (!document.getElementById('skyKF')) {
    const s = document.createElement('style');
    s.id = 'skyKF';
    s.textContent = `
      @keyframes starTwinkle {
        0%, 100% { opacity: 1;   transform: scale(1); }
        50%       { opacity: 0.15; transform: scale(0.6); }
      }
      @keyframes shootStar {
        0%   { transform: rotate(-25deg) translateX(0);     opacity: 0; }
        10%  { opacity: 1; }
        100% { transform: rotate(-25deg) translateX(110vw); opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }
}
initNightSky();


/* ─────────────────────────────────────────
   8. SMOOTH ANCHOR SCROLLING
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ─────────────────────────────────────────
   9. FOOTER YEAR + BACK TO TOP
───────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ─────────────────────────────────────────
   10. TRACK ITEM INTERACTION
───────────────────────────────────────── */
document.querySelectorAll('.track-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.track-item').forEach(t => t.style.background = '');
    item.style.background = 'rgba(212,150,26,0.18)';
  });
});


/* ─────────────────────────────────────────
   11. SOUNDBOARD — MP3 PLAYBACK
       Each pad plays from Sounds/*.mp3
       (place your own files there)
───────────────────────────────────────── */
// ─── SOUND FILE MAP ───
const soundFiles = {
  kick:    'Sounds/kick.mp3',
  snare:   'Sounds/snare.mp3',
  hihat:   'Sounds/hihat.mp3',
  clap:    'Sounds/clap.mp3',
  bass:    'Sounds/bass.mp3',
  synth:   'Sounds/synth.mp3',
  laser:   'Sounds/laser.mp3',
  airhorn: 'Sounds/airhorn.mp3',
  vinyl:   'Sounds/vinyl.mp3',
  woosh:   'Sounds/woosh.mp3',
  chime:   'Sounds/chime.mp3',
  boom:    'Sounds/boom.mp3'
};

const audioBuffers = {};

async function loadAllSounds(ctx) {
  for (const [name, url] of Object.entries(soundFiles)) {
    try {
      const response    = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      audioBuffers[name] = await ctx.decodeAudioData(arrayBuffer);
    } catch (err) {
      // File not yet added — pad will silently skip
      console.warn(`Sound "${name}" not loaded (${err.message}). Add ${url} to enable.`);
    }
  }
}

// ─── PLAY A BUFFER ───
function playBuffer(name, volume = 0.85) {
  const ctx = getCtx();
  const buf = audioBuffers[name];
  if (!buf) return; // file not loaded yet — no error shown to user

  const source = ctx.createBufferSource();
  source.buffer = buf;

  const gain = ctx.createGain();
  gain.gain.value = volume;
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start(ctx.currentTime);
}


/* ─── Visualiser ─── */
const vizBarsEl = document.querySelectorAll('.vb');
const soundDisplayEl = document.getElementById('soundDisplay');
let vizTimer = null;

const padColors = {
  kick:    '#C1440E',
  snare:   '#A03010',
  hihat:   '#D4961A',
  clap:    '#C4813A',
  bass:    '#6B3B2A',
  synth:   '#8B5A2B',
  laser:   '#C1440E',
  airhorn: '#A03010',
  vinyl:   '#8B5A2B',
  woosh:   '#7A9B6E',
  chime:   '#D4961A',
  boom:    '#6B3B2A'
};

function runViz(colour) {
  if (vizTimer) clearInterval(vizTimer);
  vizBarsEl.forEach(b => b.style.background = `linear-gradient(to top, ${colour || '#C1440E'}, #D4961A)`);
  let frames = 0;
  const total = 35;
  vizTimer = setInterval(() => {
    frames++;
    vizBarsEl.forEach(b => {
      const h = frames < total
        ? Math.random() * 42 + 6
        : Math.max(5, parseFloat(b.style.height || '5') * 0.88);
      b.style.height = h + 'px';
    });
    if (frames >= total + 18) clearInterval(vizTimer);
  }, 55);
}

function triggerSound(name, padEl) {
  // Suppress gunshot while pad is being triggered
  soundboardActive = true;
  setTimeout(() => { soundboardActive = false; }, 350);

  playBuffer(name);

  if (padEl) {
    padEl.classList.add('active');
    setTimeout(() => padEl.classList.remove('active'), 220);
  }

  const label = padEl ? padEl.dataset.label : name.toUpperCase();
  soundDisplayEl.textContent = '▶  ' + label;
  soundDisplayEl.style.color = padColors[name] || '#D4961A';
  clearTimeout(soundDisplayEl._timer);
  soundDisplayEl._timer = setTimeout(() => {
    soundDisplayEl.textContent = '— Mosey on over and press a pad —';
    soundDisplayEl.style.color = '';
  }, 1800);

  runViz(padColors[name]);

  // Screen flash on pad
  spawnDustBurst(padEl);
}

/* ── Click events ── */
document.querySelectorAll('.sound-pad').forEach(pad => {
  pad.addEventListener('click', () => triggerSound(pad.dataset.sound, pad));
});

/* ── Keyboard map ── */
const keyMap = {
  q: 'kick',   w: 'snare',  e: 'hihat',   r: 'clap',
  a: 'bass',   s: 'synth',  d: 'laser',   f: 'airhorn',
  z: 'vinyl',  x: 'woosh',  c: 'chime',   v: 'boom'
};
document.addEventListener('keydown', e => {
  if (e.repeat || e.target.tagName === 'INPUT') return;
  const key  = e.key.toLowerCase();
  const snd  = keyMap[key];
  if (!snd) return;
  const pad  = document.querySelector(`[data-sound="${snd}"]`);
  triggerSound(snd, pad);
});


/* ─────────────────────────────────────────
   12. DUST BURST on sound pad press
       Large, dramatic explosion of particles
───────────────────────────────────────── */
function spawnDustBurst(pad) {
  if (!pad) return;
  const rect = pad.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;

  // Spawn 16 particles: a mix of large blobs and small sparks
  for (let i = 0; i < 16; i++) {
    const p       = document.createElement('div');
    const angle   = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const dist    = Math.random() * 90 + 40;
    const dx      = Math.cos(angle) * dist;
    const dy      = Math.sin(angle) * dist;
    const isBig   = i < 6;
    const s       = isBig
      ? Math.random() * 18 + 10    // big blobs: 10–28px
      : Math.random() * 8  + 4;    // small sparks: 4–12px
    const blur    = isBig ? `filter:blur(${Math.random()*3+1}px);` : '';

    p.style.cssText = `
      position: fixed;
      left: ${cx}px; top: ${cy}px;
      width: ${s}px; height: ${s}px;
      border-radius: 50%;
      background: rgba(${200 + (Math.random()*40|0)}, ${100 + (Math.random()*60|0)}, ${10 + (Math.random()*40|0)}, ${isBig ? 0.55 : 0.85});
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      animation: dustBurst ${isBig ? 0.75 : 0.5}s ease-out forwards;
      ${blur}
      --dx: ${dx}px; --dy: ${dy}px;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), isBig ? 800 : 550);
  }
}

if (!document.getElementById('dustBurstKF')) {
  const s = document.createElement('style');
  s.id = 'dustBurstKF';
  s.textContent = `
    @keyframes dustBurst {
      0%   { opacity: 1;   transform: translate(-50%,-50%) scale(1); }
      100% { opacity: 0;   transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.4); }
    }
  `;
  document.head.appendChild(s);
}


/* ─────────────────────────────────────────
   13. PAGE LOAD FADE IN
───────────────────────────────────────── */
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.7s ease';
window.addEventListener('load', () => {
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
