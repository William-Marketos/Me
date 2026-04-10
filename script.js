/* ============================================================
   WILLIAM MARKETOS — DESERT LEGEND
   script.js
   ============================================================ */

'use strict';

// ─── GLOBAL: GUNSHOT / TWEETER TOGGLE ────────────────────────
// gunshotEnabled = true  → clicking fires gunshot + bird can be shot
// gunshotEnabled = false → "But I'm a Tweeter!" mode, birds are safe
window.gunshotEnabled = true;

(function initTweeterToggle () {
  const btn = document.getElementById('tweeter-toggle');
  if (!btn) return;

  function updateToggleAppearance () {
    if (window.gunshotEnabled) {
      btn.classList.remove('tweeter-active');
      btn.title = 'Click to protect the birds (disable gunshot)';
    } else {
      btn.classList.add('tweeter-active');
      btn.title = 'Click to re-enable gunshot';
    }
  }

  btn.addEventListener('click', () => {
    window.gunshotEnabled = !window.gunshotEnabled;
    updateToggleAppearance();
  });

  updateToggleAppearance();
})();


// ─── GUNSHOT SOUND ON CLICK ────────────────────────────────── //
const gunshotAudio = document.getElementById('gunshot');
const muzzleFlash  = document.getElementById('muzzle-flash');

document.addEventListener('click', function (e) {
  // Don't fire on nav / music controls / bird (bird handles itself)
  const isControl = e.target.closest(
    '#main-nav, .jb-btn, .track-item, .jukebox-progress, .fact-card, .lightbox-close, .scroll-cta, a, button, #bird'
  );
  if (isControl) return;

  // Muzzle flash at cursor
  if (muzzleFlash) {
    muzzleFlash.style.left = e.clientX + 'px';
    muzzleFlash.style.top  = e.clientY + 'px';
    muzzleFlash.classList.remove('fire');
    void muzzleFlash.offsetWidth; // reflow
    muzzleFlash.classList.add('fire');
    setTimeout(() => muzzleFlash.classList.remove('fire'), 180);
  }

  // Gunshot audio — only when enabled
  if (window.gunshotEnabled && gunshotAudio) {
    gunshotAudio.currentTime = 0;
    gunshotAudio.play().catch(() => {});
  }
});


// ─── HERO STARFIELD CANVAS ───────────────────────────────────
(function initStarfield () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize () {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Background stars ─────────────────────────────────────
  // Increased count with sparkling twinkle animation
  const NUM_STARS = 350;
  const stars     = [];

  const starColors = [
    '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff',
    '#ffe8c0', '#ffd080', '#c8d8ff', '#ffb8b8', '#f0e8ff',
  ];

  for (let i = 0; i < NUM_STARS; i++) {
    const sparkle = Math.random() > 0.85; // 15% of stars are sparklers
    stars.push({
      rx:      Math.random(),
      ry:      Math.random() * 0.82,
      size:    Math.pow(Math.random(), 2.8) * 2.2 + 0.3,
      color:   starColors[Math.floor(Math.random() * starColors.length)],
      // Variable twinkling speeds for more dynamic effect
      twSpeed: sparkle ? (Math.random() * 0.012 + 0.008) : (Math.random() * 0.003 + 0.0008),
      twOff:   Math.random() * Math.PI * 2,
      sparkle: sparkle, // Special sparkling stars
    });
  }


  // ── Constellation: Southern Cross (Crux) ─────────────────
  const CRUX = {
    label: '',
    labelStar: 1,
    stars: [
      { rx: 0.732, ry: 0.60, r: 3.4, color: '#cce0ff', name: 'Acrux'   },
      { rx: 0.732, ry: 0.36, r: 2.6, color: '#ffcccc', name: 'Gacrux'  },
      { rx: 0.688, ry: 0.48, r: 3.0, color: '#cce0ff', name: 'Mimosa'  },
      { rx: 0.776, ry: 0.48, r: 2.1, color: '#f0f0f0', name: 'Delta'   },
      { rx: 0.736, ry: 0.465, r: 1.4, color: '#ffe8c0', name: 'Epsilon'},
    ]
  };

  // ── Constellation: Scorpius ───────────────────────────────
  const SCORPIUS = {
    label: '',
    labelStar: 5,
    stars: [
      { rx: 0.195, ry: 0.20, r: 1.8, color: '#f0f0f0', name: 'Nu'     },
      { rx: 0.215, ry: 0.24, r: 1.6, color: '#d0e4ff', name: 'Beta1'  },
      { rx: 0.183, ry: 0.29, r: 1.9, color: '#f0f0f0', name: 'Pi'     },
      { rx: 0.228, ry: 0.32, r: 2.0, color: '#f0f0f0', name: 'Delta'  },
      { rx: 0.242, ry: 0.37, r: 2.2, color: '#f0f0ff', name: 'Sigma'  },
      { rx: 0.252, ry: 0.43, r: 3.8, color: '#ff6030', name: 'Antares'},
      { rx: 0.264, ry: 0.49, r: 2.0, color: '#f0f0f0', name: 'Tau'    },
      { rx: 0.278, ry: 0.55, r: 1.8, color: '#f0f0f0', name: 'Eps'    },
      { rx: 0.305, ry: 0.60, r: 1.9, color: '#f0f0f0', name: 'Mu'     },
      { rx: 0.336, ry: 0.62, r: 2.0, color: '#d0e4ff', name: 'Zeta'   },
      { rx: 0.364, ry: 0.60, r: 1.8, color: '#f0f0f0', name: 'Eta'    },
      { rx: 0.383, ry: 0.55, r: 2.1, color: '#f0f0f0', name: 'Theta'  },
      { rx: 0.393, ry: 0.49, r: 1.9, color: '#f0f0f0', name: 'Iota'   },
      { rx: 0.400, ry: 0.44, r: 1.9, color: '#f0f0f0', name: 'Kappa'  },
      { rx: 0.404, ry: 0.39, r: 2.1, color: '#ffe8c0', name: 'Lambda' },
      { rx: 0.412, ry: 0.34, r: 2.1, color: '#ffe8c0', name: 'Upsilon'},
    ]
  };
  

  // ── Regular shooting stars (small, white, frequent) ──────
  let shooters      = [];
  let nextShooterAt = 4000;

  function spawnShooter (t) {
    const dir   = Math.random() > 0.45 ? 1 : -1;
    const speed = Math.random() * 8 + 5;
    const angle = (Math.random() * 25 + 20) * (Math.PI / 180);
    shooters.push({
      x:    dir === 1 ? canvas.width * (Math.random() * 0.4)
                      : canvas.width * (0.6 + Math.random() * 0.4),
      y:    canvas.height * (Math.random() * 0.45),
      vx:   dir * speed * Math.cos(angle),
      vy:   speed * Math.sin(angle),
      life: 1.0,
      len:  Math.random() * 140 + 60,
    });
    nextShooterAt = t + Math.random() * 6000 + 3000;
  }

  // ── Colorful shooting stars (rare, large, spectacular) ───
  // These are the big colourful ones — appear every 18–35 seconds
  let colorShooters      = [];
  let nextColorShooterAt = 18000 + Math.random() * 17000;

  const colorShooterPalette = [
    { r: 0,   g: 255, b: 200 }, // aurora teal
    { r: 160, g: 60,  b: 255 }, // cosmic violet
    { r: 255, g: 90,  b: 30  }, // deep amber-red
    { r: 50,  g: 140, b: 255 }, // electric blue
    { r: 255, g: 220, b: 40  }, // golden solar
    { r: 255, g: 80,  b: 160 }, // rose nebula
  ];

  function rgba (c, a) {
    return `rgba(${c.r},${c.g},${c.b},${a})`;
  }

  function spawnColorShooter (t) {
    const dir   = Math.random() > 0.5 ? 1 : -1;
    const speed = Math.random() * 3.5 + 2.5; // Noticeably slower
    const angle = (Math.random() * 1 + 12) * (Math.PI / 180);
    const col   = colorShooterPalette[Math.floor(Math.random() * colorShooterPalette.length)];
    colorShooters.push({
      x:    dir === 1 ? canvas.width * (Math.random() * 0.35)
                      : canvas.width * (0.65 + Math.random() * 0.35),
      y:    canvas.height * (0.05 + Math.random() * 0.35),
      vx:   dir * speed * Math.cos(angle),
      vy:   speed * Math.sin(angle),
      life: 1.0,
      len:  320 + Math.random() * 200, // Long, sweeping trail
      col:  col,
      headR: 3.8 + Math.random() * 2.2, // Big glowing head
    });
    nextColorShooterAt = t + 18000 + Math.random() * 17000;
  }

  // ── Draw helpers ─────────────────────────────────────────
  function drawBg () {
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0,    '#010108');
    g.addColorStop(0.42, '#040412');
    g.addColorStop(0.72, '#0c081c');
    g.addColorStop(0.82, '#180c05');
    g.addColorStop(1,    '#0a0703');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawMilkyWay () {
    ctx.save();
    ctx.globalAlpha = 0.38;
    const g = ctx.createLinearGradient(
      canvas.width * 0.05, canvas.height * 0.02,
      canvas.width * 0.95, canvas.height * 0.78
    );
    g.addColorStop(0,    'transparent');
    g.addColorStop(0.15, 'rgba(120,100,180,0.16)');
    g.addColorStop(0.25, 'rgba(140,120,200,0.22)');
    g.addColorStop(0.5,  'rgba(130,110,190,0.25)');
    g.addColorStop(0.75, 'rgba(110,80,160,0.18)');
    g.addColorStop(0.9,  'rgba(100,70,140,0.12)');
    g.addColorStop(1,    'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.0,  0);
    ctx.lineTo(canvas.width * 0.55, 0);
    ctx.lineTo(canvas.width * 1.0,  canvas.height * 0.82);
    ctx.lineTo(canvas.width * 0.45, canvas.height * 0.82);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawStars (t) {
    stars.forEach(s => {
      const tw = 0.65 + 0.35 * Math.sin(t * s.twSpeed + s.twOff);
      
      // Extra shimmer for sparkle stars
      const shimmer = s.sparkle ? (0.3 + 0.7 * Math.abs(Math.sin(t * s.twSpeed * 2.5 + s.twOff))) : 0;
      const sparkleAlpha = tw * (0.5 + s.size * 0.2) + shimmer * 0.3;
      
      ctx.save();
      ctx.globalAlpha = sparkleAlpha;
      ctx.fillStyle   = s.color;
      
      if (s.size > 1.4 || s.sparkle) {
        ctx.shadowBlur  = s.size * (3 + (s.sparkle ? 4 : 0));
        ctx.shadowColor = s.color;
      }
      
      ctx.beginPath();
      ctx.arc(s.rx * canvas.width, s.ry * canvas.height * 0.82, s.size * tw, 0, Math.PI * 2);
      ctx.fill();
      
      // Add extra sparkle rays for high-shimmer moments
      if (s.sparkle && shimmer > 0.6) {
        ctx.globalAlpha = (shimmer - 0.6) * sparkleAlpha;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 0.8;
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          const rayLen = s.size * (2 + shimmer * 2);
          const x0 = s.rx * canvas.width + Math.cos(angle) * s.size * tw;
          const y0 = s.ry * canvas.height * 0.82 + Math.sin(angle) * s.size * tw;
          const x1 = s.rx * canvas.width + Math.cos(angle) * rayLen;
          const y1 = s.ry * canvas.height * 0.82 + Math.sin(angle) * rayLen;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }
      }
      
      ctx.restore();
    });
  }

  function drawConstellationLines (c) {
    const W = canvas.width;
    const H = canvas.height * 0.82;
    ctx.save();
    ctx.strokeStyle = 'rgba(160,200,255,0.18)';
    ctx.lineWidth   = 0.9;
    ctx.setLineDash([3, 5]);
    c.lines.forEach(([a, b]) => {
      const sa = c.stars[a], sb = c.stars[b];
      ctx.beginPath();
      ctx.moveTo(sa.rx * W, sa.ry * H);
      ctx.lineTo(sb.rx * W, sb.ry * H);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawConstellationStars (c, t) {
    const W = canvas.width;
    const H = canvas.height * 0.82;
    c.stars.forEach(s => {
      const tw = 0.7 + 0.3 * Math.sin(t * 0.007 + s.rx * 12 + s.ry * 8);
      ctx.save();
      ctx.globalAlpha  = tw;
      ctx.fillStyle    = s.color;
      ctx.shadowBlur   = s.r * 6;
      ctx.shadowColor  = s.color;
      ctx.beginPath();
      ctx.arc(s.rx * W, s.ry * H, s.r * tw, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawConstellationLabel (c, fadeAlpha) {
    if (fadeAlpha <= 0) return;
    const W  = canvas.width;
    const H  = canvas.height * 0.82;
    const ls = c.stars[c.labelStar];
    ctx.save();
    ctx.globalAlpha  = fadeAlpha * 0.55;
    ctx.fillStyle    = '#a8c8ff';
    ctx.font         = '600 11px "Oswald", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(c.label, ls.rx * W + 18, ls.ry * H - 8);
    ctx.restore();
  }

  // ── Regular small shooting stars ─────────────────────────
  function drawShooters () {
    shooters = shooters.filter(s => s.life > 0.02);
    shooters.forEach(s => {
      const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      const nx    = -s.vx / speed;
      const ny    = -s.vy / speed;
      const trail = s.len * s.life;

      ctx.save();
      ctx.globalAlpha = s.life * 0.9;

      const g = ctx.createLinearGradient(s.x, s.y, s.x + nx * trail, s.y + ny * trail);
      g.addColorStop(0, 'rgba(255,255,240,1)');
      g.addColorStop(0.3, 'rgba(220,230,255,0.6)');
      g.addColorStop(1, 'rgba(200,220,255,0)');

      ctx.strokeStyle = g;
      ctx.lineWidth   = 2 * s.life;
      ctx.lineCap     = 'round';
      ctx.shadowBlur  = 8;
      ctx.shadowColor = 'rgba(200,220,255,0.7)';
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + nx * trail, s.y + ny * trail);
      ctx.stroke();

      ctx.shadowBlur  = 12;
      ctx.shadowColor = 'rgba(255,255,255,1)';
      ctx.fillStyle   = 'rgba(255,255,250,1)';
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2 * s.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      s.x    += s.vx;
      s.y    += s.vy;
      s.life -= 0.020;
    });
  }

  // ── Colorful large shooting stars ────────────────────────
  function drawColorShooters () {
    colorShooters = colorShooters.filter(s => s.life > 0.02);
    colorShooters.forEach(s => {
      const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      const nx    = -s.vx / speed;
      const ny    = -s.vy / speed;
      const trail = s.len * s.life;

      ctx.save();
      ctx.globalAlpha = s.life * 0.95;

      // Colourful gradient trail
      const g = ctx.createLinearGradient(s.x, s.y, s.x + nx * trail, s.y + ny * trail);
      g.addColorStop(0,   rgba(s.col, 1.0));
      g.addColorStop(0.3, rgba(s.col, 0.7));
      g.addColorStop(0.7, rgba(s.col, 0.25));
      g.addColorStop(1,   rgba(s.col, 0));

      ctx.strokeStyle = g;
      ctx.lineWidth   = 4.5 * s.life;
      ctx.lineCap     = 'round';
      ctx.shadowBlur  = 28;
      ctx.shadowColor = rgba(s.col, 0.9);
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + nx * trail, s.y + ny * trail);
      ctx.stroke();

      // Large bright glowing head
      ctx.shadowBlur  = 35;
      ctx.shadowColor = rgba(s.col, 1.0);
      ctx.fillStyle   = rgba(s.col, 1.0);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.headR * s.life, 0, Math.PI * 2);
      ctx.fill();

      // Soft white core inside the head
      ctx.shadowBlur = 0;
      ctx.fillStyle  = 'rgba(255,255,255,0.85)';
      ctx.beginPath();
      ctx.arc(s.x, s.y, (s.headR * 0.4) * s.life, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      s.x    += s.vx;
      s.y    += s.vy;
      s.life -= 0.007; // Much slower fade — makes the arc long and dramatic
    });
  }

  // ── Ground atmosphere / horizon glow ─────────────────────
  function drawHorizonGlow () {
    const g = ctx.createLinearGradient(0, canvas.height * 0.72, 0, canvas.height * 0.88);
    g.addColorStop(0, 'rgba(160,70,10,0)');
    g.addColorStop(0.5, 'rgba(160,70,10,0.12)');
    g.addColorStop(1, 'rgba(160,70,10,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, canvas.height * 0.72, canvas.width, canvas.height * 0.16);
  }

  // ── Main loop ─────────────────────────────────────────────
  let startTime = null;
  let labelFade = 0;

  function frame (ts) {
    if (!startTime) startTime = ts;
    const t = ts - startTime;

    drawBg();
    drawMilkyWay();
    drawHorizonGlow();
    drawStars(t);

    drawConstellationLines(CRUX);
    drawConstellationLines(SCORPIUS);
    drawConstellationStars(CRUX, t);
    drawConstellationStars(SCORPIUS, t);

    labelFade = Math.min(1, (t - 2500) / 2500);
    drawConstellationLabel(CRUX, labelFade);
    drawConstellationLabel(SCORPIUS, labelFade);

    drawShooters();
    drawColorShooters();

    if (t >= nextShooterAt)      spawnShooter(t);
    if (t >= nextColorShooterAt) spawnColorShooter(t);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();


// ─── FOOTER MINI-STARFIELD ────────────────────────────────────
(function initFooterCanvas () {
  const canvas = document.getElementById('footer-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize () {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const fstars = Array.from({ length: 180 }, () => ({
    rx: Math.random(),
    ry: Math.random(),
    r:  Math.random() * 1.2 + 0.2,
    tw: Math.random() * 0.02 + 0.005,
    to: Math.random() * Math.PI * 2,
  }));

  function footerFrame (ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0, '#010108');
    g.addColorStop(1, '#050310');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fstars.forEach(s => {
      const a = 0.4 + 0.6 * Math.sin(ts * s.tw + s.to);
      ctx.save();
      ctx.globalAlpha = a * 0.75;
      ctx.fillStyle   = '#f0f0ff';
      ctx.shadowBlur  = 4;
      ctx.shadowColor = '#a8c8ff';
      ctx.beginPath();
      ctx.arc(s.rx * canvas.width, s.ry * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(footerFrame);
  }
  requestAnimationFrame(footerFrame);
})();


// ─── BIRD OF PARADISE (PNG Image Version) ─────────────────────
(function initBird () {
  const bird    = document.getElementById('bird');
  const birdImg = document.getElementById('bird-img');
  if (!bird || !birdImg) return;

  // ════════════════════════════════════════════════════════════
  // EASY TO CHANGE: Bird fall speed after being shot
  //   Lower number  = slower, more dramatic fall (e.g. 0.8)
  //   Higher number = faster fall                (e.g. 4.0)
  const BIRD_FALL_SPEED = 0.5; // pixels per animation frame
  // ════════════════════════════════════════════════════════════

  // Bird state: 'idle' | 'flying' | 'falling' | 'dead'
  let birdState     = 'idle';
  let flightTimeout = null;

  const MIN_WAIT = 18000; // ms between flights
  const MAX_WAIT = 45000;

  function resetBird () {
    birdState             = 'idle';
    bird.style.opacity    = '0';
    bird.style.transition = 'none';
    bird.style.animation  = 'none';
    bird.style.top        = '20%';
    bird.style.left       = '-220px';
    bird.style.right      = 'auto';
    bird.style.transform  = 'none';
    birdImg.src           = 'images/Bird_Right.png';
  }

  function scheduleFlight () {
    const wait = MIN_WAIT + Math.random() * (MAX_WAIT - MIN_WAIT);
    flightTimeout = setTimeout(flyBird, wait);
  }

  function flyBird () {
    if (birdState !== 'idle') { scheduleFlight(); return; }
    birdState = 'flying';

    const goRight  = Math.random() > 0.45; // true = left→right
    const yFrac    = 0.08 + Math.random() * 0.55;
    const yPos     = window.innerHeight * yFrac;
    const duration = 5000 + window.innerWidth * 2.5;

    // Set correct directional image before the flight starts
    birdImg.src = goRight ? 'images/Bird_Right.png' : 'images/Bird_Left.png';

    bird.style.top        = yPos + 'px';
    bird.style.animation  = 'none';
    bird.style.transition = 'none';
    bird.style.transform  = 'none';

    if (goRight) {
      bird.style.left  = '-220px';
      bird.style.right = 'auto';
    } else {
      bird.style.left  = 'auto';
      bird.style.right = '-220px';
    }

    bird.style.opacity = '0';
    void bird.offsetWidth; // force reflow

    bird.style.opacity    = '1';
    bird.style.transition = `left ${duration}ms linear, right ${duration}ms linear`;
    bird.style.animation  = `birdBob ${0.6 + Math.random() * 0.3}s ease-in-out infinite alternate`;

    if (goRight) {
      bird.style.left  = (window.innerWidth + 240) + 'px';
    } else {
      bird.style.right = (window.innerWidth + 240) + 'px';
    }

    flightTimeout = setTimeout(() => {
      if (birdState === 'flying') {
        bird.style.opacity   = '0';
        bird.style.animation = 'none';
        birdState = 'idle';
        scheduleFlight();
      }
    }, duration + 600);
  }

  // ── Click the bird to shoot it ───────────────────────────
  bird.addEventListener('click', (e) => {
    e.stopPropagation(); // Don't trigger the global click handler

    // Only shootable when gunshot mode is active and bird is flying
    if (!window.gunshotEnabled) return;
    if (birdState !== 'flying')  return;

    birdState = 'falling';

    // Play the gunshot on click
    if (gunshotAudio) {
      gunshotAudio.currentTime = 0;
      gunshotAudio.play().catch(() => {});
    }

    // Cancel the flight-end timer
    clearTimeout(flightTimeout);



    // Muzzle flash at bird's position (centre of bird element)
    const birdRect = bird.getBoundingClientRect();
    if (muzzleFlash) {
      const bx = birdRect.left + birdRect.width  / 2;
      const by = birdRect.top  + birdRect.height / 2;
      muzzleFlash.style.left = bx + 'px';
      muzzleFlash.style.top  = by + 'px';
      muzzleFlash.classList.remove('fire');
      void muzzleFlash.offsetWidth;
      muzzleFlash.classList.add('fire');
      setTimeout(() => muzzleFlash.classList.remove('fire'), 180);
    }

    // Freeze the bird's current horizontal position
    // (getBoundingClientRect gives viewport position for fixed elements)
    const rect = bird.getBoundingClientRect();
    bird.style.transition = 'none';
    bird.style.animation  = 'none';
    bird.style.left       = rect.left + 'px';
    bird.style.right      = 'auto';
    bird.style.top        = rect.top  + 'px';

    const screenBottom = window.innerHeight;
    let   fallTop      = rect.top;
    const birdH        = bird.offsetHeight;
    let   hitPlayed    = false;

    // ── Falling loop: moves bird STRAIGHT DOWN only ──────────
    // The bird falls perpendicular to the screen bottom.
    // Adjust BIRD_FALL_SPEED at the top of initBird() to change the pace.
    function fallFrame () {

      // Play music/test.mp3 as the bird hits the bottom
      if (!hitPlayed) {
        hitPlayed = true;
        
        // Pause only the music player, keep gunshot playing
        const musicPlayer = document.getElementById('music-player');
        if (musicPlayer) {
          musicPlayer.pause();
        }
        
        const impactAudio = new Audio('music/dead_bird.mp3');
        impactAudio.play().catch(() => {});
      }

      if (birdState !== 'falling') return;

      fallTop += BIRD_FALL_SPEED;
      bird.style.top = fallTop + 'px';

      // Check if bird has reached the bottom of the screen
      if (fallTop + birdH >= screenBottom) {

        // Snap to exact bottom
        bird.style.top = (screenBottom - birdH) + 'px';
        birdState = 'dead';

        // Switch to dead bird image on impact
        birdImg.src = 'images/Bird_Dead.png';

        // Lie there for 10 seconds, then fade out gracefully
        setTimeout(() => {
          bird.style.transition = 'opacity 1.8s ease';
          bird.style.opacity    = '0';

          // After fade completes, reset and schedule next visit
          setTimeout(() => {
            resetBird();
            scheduleFlight();
          }, 1900);
        }, 20000);
// parking length
        return; // Stop the falling rAF loop
      }

      requestAnimationFrame(fallFrame);
    }

    requestAnimationFrame(fallFrame);
  });

  // Gentle bobbing animation while in flight
  const birdStyle = document.createElement('style');
  birdStyle.textContent = `
    @keyframes birdBob {
      from { margin-top: 0px; }
      to   { margin-top: -18px; }
    }
  `;
  document.head.appendChild(birdStyle);

  scheduleFlight();
})();


// ─── NAVIGATION ───────────────────────────────────────────────
(function initNav () {
  const nav    = document.getElementById('main-nav');
  const burger = document.getElementById('nav-burger');
  const links  = nav ? nav.querySelector('.nav-links') : null;

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  if (burger && links) {
    burger.addEventListener('click', () => {
      links.classList.toggle('open');
      burger.textContent = links.classList.contains('open') ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        burger.textContent = '☰';
      });
    });
  }

  const sections   = document.querySelectorAll('section[id], footer[id]');
  const navAnchors = nav ? nav.querySelectorAll('.nav-links a') : [];

  function updateActive () {
    const scroll = window.scrollY + 100;
    let current  = '';
    sections.forEach(s => {
      if (s.offsetTop <= scroll) current = s.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();


// ─── SCROLL REVEAL ────────────────────────────────────────────
(function initReveal () {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();


// ─── PROGRESS BARS (animate on scroll into view) ─────────────
(function initProgressBars () {
  const bars = document.querySelectorAll('.progress-fill');
  const io   = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = e.target.style.width;
        e.target.style.width = '0';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            e.target.style.width = target;
          });
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => {
    const w = b.style.width;
    b.dataset.targetWidth = w;
    b.style.width = '0';
    io.observe(b);
  });
})();


// ─── FUN FACT CARD FLIP ───────────────────────────────────────
(function initFactCards () {
  document.querySelectorAll('.fact-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
})();


// ─── MUSIC PLAYER ─────────────────────────────────────────────
(function initMusicPlayer () {
  // ── Track list — all pointing to music/test.mp3 ──────────
  // Replace src paths with your own mp3 files when ready.
  const TRACKS = [
    {
      src:    'music/birds.wav',
      title:  'Sweet Birdsong',
      artist: 'Nature',
      desc:   '',
    },
    {
      src:    'music/fireplace.mp3',
      title:  'Crackling Fire',
      artist: 'Nature',
      desc:   '',
    },
    {
      src:    'music/desert.mp3',
      title:  'Desert Wind',
      artist: 'Nature',
      desc:   '',
    },
    {
      src:    'music/thunderstorm.mp3',
      title:  'Booming Thunderstorm',
      artist: 'Nature',
      desc:   '',
    },
    {
      src:    'music/Rest stop.mp3',
      title:  'Rest-stop along the N14',
      artist: 'Nature',
      desc:   '',
    },
    {
      src:    'music/baxter_theatre.m4a',
      title:  'Baxter Theatre Classical',
      artist: 'Philharmonic Orchestra',
      desc:   '',
    },
  ];

  const audio       = document.getElementById('music-player');
  const jukebox     = document.querySelector('.jukebox');
  const trackList   = document.getElementById('track-list');
  const btnPlay     = document.getElementById('btn-play');
  const btnPrev     = document.getElementById('btn-prev');
  const btnNext     = document.getElementById('btn-next');
  const npTitle     = document.getElementById('np-title');
  const npArtist    = document.getElementById('np-artist');
  const timeCurrent = document.getElementById('time-current');
  const timeTotal   = document.getElementById('time-total');
  const progressBar = document.getElementById('jb-progress-bar');
  const progressFil = document.getElementById('jb-progress-fill');

  if (!audio || !trackList) return;

  let currentIndex = -1;
  let isPlaying    = false;

  function buildTrackList () {
    trackList.innerHTML = '';
    TRACKS.forEach((t, i) => {
      const item = document.createElement('div');
      item.className = 'track-item';
      item.innerHTML = `
        <span class="track-play-icon">▶</span>
        <span class="track-num">${String(i + 1).padStart(2, '0')}</span>
        <div class="track-info">
          <div class="track-name">${t.title}</div>
          <div class="track-desc">${t.desc}</div>
        </div>
        <span class="track-duration" id="dur-${i}">—</span>
      `;
      item.addEventListener('click', () => {
        if (currentIndex === i && isPlaying) {
          pauseTrack();
        } else {
          loadAndPlay(i);
        }
      });
      trackList.appendChild(item);
    });
  }

  function setActiveTrack (idx) {
    document.querySelectorAll('.track-item').forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });
  }

  function fmtTime (secs) {
    if (!isFinite(secs)) return '—';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function loadAndPlay (idx) {
    currentIndex  = idx;
    const track   = TRACKS[idx];
    audio.src     = track.src;
    npTitle.textContent  = track.title;
    npArtist.textContent = track.artist;
    setActiveTrack(idx);
    progressFil.style.width = '0%';
    audio.play().then(() => {
      isPlaying = true;
      btnPlay.textContent = '⏸';
      jukebox && jukebox.classList.add('playing');
    }).catch(err => {
      console.warn('Audio play failed:', err.message);
    });
  }

  function pauseTrack () {
    audio.pause();
    isPlaying = false;
    btnPlay.textContent = '▶';
    jukebox && jukebox.classList.remove('playing');
  }

  function resumeTrack () {
    audio.play().then(() => {
      isPlaying = true;
      btnPlay.textContent = '⏸';
      jukebox && jukebox.classList.add('playing');
    }).catch(() => {});
  }

  btnPlay.addEventListener('click', () => {
    if (currentIndex < 0) { loadAndPlay(0); return; }
    if (isPlaying) { pauseTrack(); } else { resumeTrack(); }
  });

  btnPrev.addEventListener('click', () => {
    if (currentIndex <= 0) { loadAndPlay(TRACKS.length - 1); }
    else                   { loadAndPlay(currentIndex - 1); }
  });

  btnNext.addEventListener('click', () => {
    if (currentIndex >= TRACKS.length - 1) { loadAndPlay(0); }
    else                                    { loadAndPlay(currentIndex + 1); }
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFil.style.width = pct + '%';
    timeCurrent.textContent = fmtTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    timeTotal.textContent = fmtTime(audio.duration);
    const durEl = document.getElementById(`dur-${currentIndex}`);
    if (durEl) durEl.textContent = fmtTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    if (currentIndex < TRACKS.length - 1) {
      loadAndPlay(currentIndex + 1);
    } else {
      isPlaying = false;
      btnPlay.textContent = '▶';
      jukebox && jukebox.classList.remove('playing');
    }
  });

  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const rect = progressBar.getBoundingClientRect();
      const pct  = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pct * audio.duration;
    });
  }

  buildTrackList();
})();


// ─── GALLERY / LIGHTBOX ───────────────────────────────────────
(function initGallery () {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbCap    = document.getElementById('lightbox-caption');
  const lbClose  = document.getElementById('lightbox-close');

  if (!lightbox) return;

  document.querySelectorAll('.gallery-frame').forEach(frame => {
    frame.addEventListener('click', () => {
      const img = frame.querySelector('img');
      const cap = frame.querySelector('.gallery-caption');

      if (img && img.src && !img.src.endsWith('/')) {
        lbImg.src = img.src;
        lbImg.alt = img.alt || '';
        lbCap.textContent = cap ? cap.textContent : '';
        lightbox.classList.add('open');
      } else {
        const icon = frame.querySelector('.photo-icon');
        const span = frame.querySelector('.photo-placeholder span:not(.photo-icon)');
        if (span) {
          lbImg.src     = '';
          lbImg.alt     = '';
          lbImg.style.display = 'none';
          lbCap.textContent   = (icon ? icon.textContent + ' ' : '') + (span.textContent || '');
          lightbox.classList.add('open');
        }
      }
    });
  });

  function closeLightbox () {
    lightbox.classList.remove('open');
    setTimeout(() => {
      lbImg.src = '';
      lbImg.style.display = '';
    }, 300);
  }

  lbClose && lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();


// ─── PARALLAX HERO DUNES ─────────────────────────────────────
(function initParallax () {
  const mw = document.querySelector('.mountain-wrap');
  if (!mw) return;
  window.addEventListener('scroll', () => {
    const depth = window.scrollY * 0.15;
    mw.style.transform = `translateY(${depth}px)`;
  }, { passive: true });
})();


// ─── SMOOTH SCROLL FOR NAV LINKS ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = document.getElementById('main-nav') ?
        document.getElementById('main-nav').offsetHeight : 60;
      window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
    }
  });
});


// ─── DUST PARTICLE TRAIL ON HOVER ────────────────────────────
(function initDustTrail () {
  let lastX = 0, lastY = 0, throttle = 0;

  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99990;overflow:hidden;';
  document.body.appendChild(container);

  function makeParticle (x, y) {
    const p   = document.createElement('div');
    const size = Math.random() * 5 + 2;
    const hue  = 25 + Math.random() * 30;
    const dur  = 0.6 + Math.random() * 0.6;
    const dx   = (Math.random() - 0.5) * 40;
    const dy   = -(Math.random() * 30 + 10);

    p.style.cssText = `
      position:absolute;left:${x}px;top:${y}px;
      width:${size}px;height:${size}px;border-radius:50%;
      background:hsla(${hue},60%,55%,0.55);pointer-events:none;
      transition:transform ${dur}s ease-out,opacity ${dur}s ease-out;
      transform:translate(-50%,-50%);opacity:0.6;`;
    container.appendChild(p);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      p.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2)`;
      p.style.opacity   = '0';
    }));
    setTimeout(() => p.remove(), dur * 1000 + 50);
  }

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - throttle < 45) return;
    throttle = now;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    if (Math.sqrt(dx * dx + dy * dy) > 8) {
      makeParticle(e.clientX, e.clientY);
      lastX = e.clientX; lastY = e.clientY;
    }
  }, { passive: true });
})();


// ─── STAR-CURSOR CLICK BURST ─────────────────────────────────
(function initClickBurst () {
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99991;overflow:hidden;';
  document.body.appendChild(container);

  document.addEventListener('click', (e) => {
    const count = 8;
    for (let i = 0; i < count; i++) {
      const p    = document.createElement('div');
      const size = Math.random() * 4 + 2;
      const ang  = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 30 + Math.random() * 50;
      const dx   = Math.cos(ang) * dist;
      const dy   = Math.sin(ang) * dist;
      const col  = `hsl(${30 + Math.random() * 30}, 80%, ${60 + Math.random() * 30}%)`;
      const dur  = 0.45 + Math.random() * 0.3;

      p.style.cssText = `
        position:absolute;left:${e.clientX}px;top:${e.clientY}px;
        width:${size}px;height:${size}px;border-radius:50%;
        background:${col};pointer-events:none;opacity:0.9;
        transform:translate(-50%,-50%);
        transition:transform ${dur}s ease-out,opacity ${dur}s ease-out;
        box-shadow:0 0 6px ${col};`;
      container.appendChild(p);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        p.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.1)`;
        p.style.opacity   = '0';
      }));
      setTimeout(() => p.remove(), (dur + 0.1) * 1000);
    }
  });
})();


// ─── SECTION TITLE GLOW ON SCROLL ────────────────────────────
(function initTitleGlow () {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('glow-active');
    });
  }, { threshold: 0.4 });

  const style = document.createElement('style');
  style.textContent = `
    .section-title { transition: text-shadow 1.2s ease; }
    .glow-active .section-title {
      text-shadow: 0 0 30px rgba(245,166,35,0.4), 0 0 60px rgba(245,166,35,0.15);
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.section-header').forEach(h => io.observe(h));
})();
