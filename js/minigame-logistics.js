/* FETCH 5 CRATES BEFORE THE STORM CLOSES — a tiny pixel game.
   Drawn with fillRect; no assets. The walls are the walls because the
   building only teaches you the walls it likes you to know. */

const StormShift = (() => {
  const TILE = 24, COLS = 16, ROWS = 9;
  const W = COLS * TILE, H = ROWS * TILE; // 384 x 216
  const MAP = [
    '################',
    '#..............#',
    '#..##....##....#',
    '#..#......#....#',
    '#..............#',
    '#..#......#....#',
    '#..##....##....#',
    '#..............#',
    '################',
  ];
  const CRATES = [[13, 1], [2, 4], [8, 7], [13, 6], [7, 1]];
  const START = { x: 1.5 * TILE, y: 4.5 * TILE };
  const DURATION_S = 30;

  let canvas, ctx, running = false, raf = 0;
  const keys = new Set();
  let player, crates, timeLeft, lightningAt, flashUntil, rumbleAt;

  function isWall(cx, cy) {
    if (cy < 0 || cy >= ROWS || cx < 0 || cx >= COLS) return true;
    return MAP[cy][cx] === '#';
  }

  function reset() {
    player = { x: START.x, y: START.y, size: 15, speed: 2.35 };
    crates = CRATES.map(([cx, cy]) => ({ x: cx * TILE + TILE / 2, y: cy * TILE + TILE / 2, taken: false }));
    timeLeft = DURATION_S;
    lightningAt = performance.now() + 2500;
    flashUntil = 0;
    rumbleAt = performance.now() + 4000;
  }

  function onKey(down) {
    return (e) => {
      const k = e.key.toLowerCase();
      const gameKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'];
      if (gameKeys.includes(k)) {
        if (running) e.preventDefault();
        if (down) keys.add(k); else keys.delete(k);
      }
    };
  }
  const keyDown = onKey(true), keyUp = onKey(false);

  function hitWall(nx, ny, half) {
    const pts = [[nx - half, ny - half], [nx + half, ny - half], [nx - half, ny + half], [nx + half, ny + half]];
    return pts.some(([px, py]) => isWall(Math.floor(px / TILE), Math.floor(py / TILE)));
  }

  function update(dt) {
    const k = keys;
    let dx = 0, dy = 0;
    if (k.has('arrowleft') || k.has('a')) dx -= 1;
    if (k.has('arrowright') || k.has('d')) dx += 1;
    if (k.has('arrowup') || k.has('w')) dy -= 1;
    if (k.has('arrowdown') || k.has('s')) dy += 1;
    if (dx || dy) {
      const len = Math.hypot(dx, dy);
      const step = player.speed * (dt / 16.67);
      const nx = player.x + (dx / len) * step;
      const ny = player.y + (dy / len) * step;
      if (!hitWall(nx, player.y, player.size / 2)) player.x = nx;
      if (!hitWall(player.x, ny, player.size / 2)) player.y = ny;
    }
    timeLeft -= dt / 1000;
    const now = performance.now();
    if (now > lightningAt) { flashUntil = now + 90; lightningAt = now + 4000 + Math.random() * 4500; Voice.beep(72, 340, 'sawtooth', 0.16); }
    if (now > rumbleAt) { rumbleAt = now + 5000 + Math.random() * 6000; Voice.beep(48, 420, 'sawtooth', 0.1); }
    for (const c of crates) {
      if (!c.taken && Math.hypot(c.x - player.x, c.y - player.y) < 15) {
        c.taken = true;
        Voice.beep(880 + Math.random() * 240, 110, 'square', 0.09);
      }
    }
    if (crates.every(c => c.taken)) return finish('win');
    if (timeLeft <= 0) return finish('lose');
  }

  function draw() {
    ctx.imageSmoothingEnabled = false;
    // Floor — checkered steel
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        ctx.fillStyle = (x + y) % 2 ? '#10181c' : '#131e23';
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      }
    }
    // Walls
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (MAP[y][x] !== '#') continue;
        ctx.fillStyle = '#3d4a4a';
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        ctx.fillStyle = '#5a6a6a';
        ctx.fillRect(x * TILE, y * TILE, TILE, 3);
        ctx.fillStyle = '#222c2c';
        ctx.fillRect(x * TILE + 3, y * TILE + 16, TILE - 6, 5);
      }
    }
    // Crates
    for (const c of crates) {
      if (c.taken) continue;
      ctx.fillStyle = '#e8a020';
      ctx.fillRect(c.x - 7, c.y - 7, 14, 14);
      ctx.fillStyle = '#a8620c';
      ctx.fillRect(c.x - 7, c.y - 2, 14, 3);
      ctx.fillStyle = '#ffd257';
      ctx.fillRect(c.x - 2, c.y - 7, 3, 14);
    }
    // Forklift — pixel body, mast, warning light
    ctx.save();
    ctx.translate(Math.round(player.x), Math.round(player.y));
    ctx.fillStyle = '#f7c948';
    ctx.fillRect(-9, -6, 18, 12);
    ctx.fillStyle = '#1a1611';
    ctx.fillRect(-13, -9, 4, 18);   // mast
    ctx.fillRect(-4, -9, 8, 3);
    ctx.fillStyle = '#141414';     // wheels
    ctx.fillRect(-9, 6, 4, 3);
    ctx.fillRect(5, 6, 4, 3);
    ctx.fillStyle = '#a03024';     // beacon
    ctx.fillRect(6, -9, 3, 3);
    ctx.restore();
    // Storm — vignette closes in as time runs out
    const pressure = 1 - Math.max(0, timeLeft) / DURATION_S;
    const grad = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 260);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, `rgba(0,0,5,${0.35 + pressure * 0.55})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    // Rain
    ctx.strokeStyle = 'rgba(150,180,210,0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 60; i++) {
      const sx = (i * 97 + (performance.now() / 2) % W) % W;
      const sy = (i * 53 + (performance.now() * 1.4) % H) % H;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx - 3, sy + 10); ctx.stroke();
    }
    // Lightning flash
    if (performance.now() < flashUntil) {
      ctx.fillStyle = 'rgba(220, 230, 255, 0.75)';
      ctx.fillRect(0, 0, W, H);
    }
    // HUD — timer bar + crate count
    ctx.fillStyle = '#0d0b09';
    ctx.fillRect(0, 0, W, 12);
    const frac = Math.max(0, timeLeft / DURATION_S);
    ctx.fillStyle = frac > 0.25 ? '#f7c948' : '#ff4b2e';
    ctx.fillRect(0, 0, Math.floor(W * frac), 4);
    ctx.fillStyle = '#f2ede1';
    ctx.font = '9px monospace';
    ctx.fillText('CRATES ' + crates.filter(c => c.taken).length + '/5', 4, 10);
    ctx.fillText('T-' + Math.ceil(Math.max(0, timeLeft)), W - 40, 10);
  }

  let lastTime = 0;
  function frame(now) {
    if (!running) return;
    const dt = lastTime ? now - lastTime : 16.67;
    lastTime = now;
    update(dt);
    if (running) draw();
    if (running) raf = requestAnimationFrame(frame);
  }

  function start(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    reset();
    running = true;
    lastTime = 0;
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', keyDown);
    window.removeEventListener('keyup', keyUp);
  }

  function finish(result) {
    stop();
    if (result === 'win') { Voice.beep(660, 120, 'square', 0.1); setTimeout(() => Voice.beep(990, 160, 'square', 0.12), 140); }
    else { Voice.beep(140, 300, 'sawtooth', 0.12); setTimeout(() => Voice.beep(92, 380, 'sawtooth', 0.1), 160); }
    if (window.completeStormShift) window.completeStormShift(result);
  }

  return { start, stop };
})();
