// ---------- Theme toggle ----------
(() => {
  const root = document.documentElement;
  const btn = document.querySelector('.theme-btn');
  const isDark = () => root.dataset.theme
    ? root.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  btn?.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    window.dispatchEvent(new Event('themechange'));
  });
})();

// ---------- Mobile menu ----------
(() => {
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  btn?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open'); btn.setAttribute('aria-expanded', false);
  }));
})();

// ---------- Publication filters ----------
(() => {
  const chips = document.querySelectorAll('.chip');
  const pubs = document.querySelectorAll('.pub');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.toggle('active', x === c));
    const f = c.dataset.filter;
    pubs.forEach(p => { p.hidden = f !== 'all' && p.dataset.type !== f; });
  }));
})();

document.getElementById('yr').textContent = new Date().getFullYear();

// ---------- Hero: meshfree node field with an MLS support domain ----------
(() => {
  const canvas = document.getElementById('field');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const capN = document.getElementById('cap-n');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, h = 34, nodes = [], colors = {};
  let target = null, pos = { x: 0, y: 0 }, t0 = performance.now(), lastMove = 0;

  const readColors = () => {
    const cs = getComputedStyle(document.documentElement);
    colors = { node: cs.getPropertyValue('--node').trim(), accent: cs.getPropertyValue('--accent').trim(), copper: cs.getPropertyValue('--copper').trim() };
  };

  // simple seeded RNG so the node cloud is the same every load
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  function layout() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    h = W < 760 ? 28 : 34;
    seed = 7; nodes = [];
    for (let y = h / 2; y < H; y += h)
      for (let x = h / 2; x < W; x += h)
        nodes.push({ x: x + (rnd() - .5) * .6 * h, y: y + (rnd() - .5) * .6 * h });
    pos = { x: W * .72, y: H * .5 };
  }

  // cubic spline weight, normalised to w(0) = 1
  const weight = s => s <= .5 ? (2/3 - 4*s*s + 4*s*s*s) * 1.5
                    : s <= 1 ? (4/3 - 4*s + 4*s*s - 4/3*s*s*s) * 1.5 : 0;

  function draw(now) {
    const dm = 2.5 * h;
    // Idle: evaluation point drifts along a Lissajous path over the right half
    if (!target || now - lastMove > 2500) {
      const t = (now - t0) / 1000;
      target = { x: W * (.66 + .24 * Math.sin(t * .23)), y: H * (.5 + .3 * Math.sin(t * .37 + 1)) };
    }
    pos.x += (target.x - pos.x) * .08;
    pos.y += (target.y - pos.y) * .08;

    ctx.clearRect(0, 0, W, H);
    let n = 0;
    for (const p of nodes) {
      const d = Math.hypot(p.x - pos.x, p.y - pos.y);
      const w = weight(d / dm);
      if (w > 0) {
        n++;
        ctx.strokeStyle = colors.accent; ctx.globalAlpha = .15 + .45 * w; ctx.lineWidth = .8;
        ctx.beginPath(); ctx.moveTo(pos.x, pos.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        ctx.globalAlpha = .55 + .45 * w; ctx.fillStyle = colors.accent;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2 + 2.5 * w, 0, 7); ctx.fill();
      } else {
        ctx.globalAlpha = .28; ctx.fillStyle = colors.node;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 7); ctx.fill();
      }
    }
    // support domain
    ctx.globalAlpha = .7; ctx.strokeStyle = colors.accent; ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(pos.x, pos.y, dm, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    // evaluation point
    ctx.globalAlpha = 1; ctx.fillStyle = colors.copper;
    ctx.beginPath(); ctx.arc(pos.x, pos.y, 5, 0, 7); ctx.fill();
    ctx.globalAlpha = .9; ctx.font = 'italic 14px Newsreader, Georgia, serif';
    ctx.fillText('x', pos.x + 8, pos.y - 8);
    ctx.globalAlpha = 1;
    if (capN) capN.textContent = n;
    if (!reduce) requestAnimationFrame(draw);
  }

  const hero = canvas.parentElement;
  hero.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    target = { x: e.clientX - r.left, y: e.clientY - r.top }; lastMove = performance.now();
  });

  readColors(); layout();
  window.addEventListener('resize', () => { layout(); if (reduce) draw(performance.now()); });
  window.addEventListener('themechange', () => { readColors(); if (reduce) draw(performance.now()); });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readColors);
  requestAnimationFrame(draw);
})();
