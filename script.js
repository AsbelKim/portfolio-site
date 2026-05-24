// ── Tech background canvas ────────────────────────────────────
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, items;

  const CODE_SYMBOLS = [
    '</>','{ }','[ ]','( )','=>','&&','||','!=','==',
    '++','--','#!','//','/**','*/','fn','const','let',
    'var','if','for','true','null','01','10','00','11',
    '0x','>>','<<','~~','::','...',
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeItem() {
    const isSymbol = Math.random() > 0.35;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      text: isSymbol ? CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)] : null,
      r: isSymbol ? 0 : Math.random() * 1.6 + 0.5,
      dx: (Math.random() - 0.5) * 0.28,
      dy: (Math.random() - 0.5) * 0.28,
      alpha: Math.random() * 0.28 + 0.07,
      size: Math.floor(Math.random() * 5 + 10),
    };
  }

  function init() {
    resize();
    items = Array.from({ length: 90 }, makeItem);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // draw faint connecting lines first
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i], b = items[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(56,189,248,${0.07 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // draw symbols and dots
    items.forEach(p => {
      if (p.text) {
        ctx.font = `${p.size}px 'Courier New', monospace`;
        ctx.fillStyle = `rgba(56,189,248,${p.alpha})`;
        ctx.fillText(p.text, p.x, p.y);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,189,248,${p.alpha + 0.1})`;
        ctx.fill();
      }

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < -40 || p.x > W + 40) p.dx *= -1;
      if (p.y < -20 || p.y > H + 20) p.dy *= -1;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

// ── Rest of scripts ───────────────────────────────────────────
// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

// Close menu on link click
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// Navbar background on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50
    ? 'rgba(2, 6, 23, 0.97)'
    : 'rgba(2, 6, 23, 0.85)';
});

// Active nav link highlight
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 80) current = s.id;
  });
  navAnchors.forEach(a => {
    const isActive = a.getAttribute('href') === '#' + current;
    a.style.color = isActive ? 'var(--accent-soft)' : '';
    a.style.background = isActive ? 'var(--accent-dim)' : '';
  });
});

// Scroll-reveal
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
document.querySelectorAll(
  '.skill-cat, .timeline-item, .project-card, .edu-card, .ref-card, .contact-card, .about-grid'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});
