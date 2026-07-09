// Hamburger menu with iOS-safe scroll lock
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('navMobileMenu');
if (hamburger && mobileMenu) {
  let savedScroll = 0;
  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    if (open) {
      savedScroll = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScroll}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, savedScroll);
    }
  }
  hamburger.addEventListener('click', () => toggleMenu(!hamburger.classList.contains('open')));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
}

// Nav transparency on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 70);
}, { passive: true });

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.reveal, .step, .step-row, .product-card, .proof-card, .buy-card, .persona-panel, .persona-row, .founder-tile')
  .forEach(el => observer.observe(el));

// Stat counter animation
function animateCount(el) {
  const to = parseInt(el.dataset.to, 10);
  const from = parseInt(el.dataset.from || '0', 10);
  const duration = 1500;
  const startTime = performance.now();
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function tick(now) {
    const t = Math.min((now - startTime) / duration, 1);
    el.textContent = Math.round(from + (to - from) * easeOutCubic(t));
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = to;
  }
  requestAnimationFrame(tick);
}

const statsEl = document.querySelector('.science-stats');
if (statsEl) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.count-up').forEach(animateCount);
      statsObserver.disconnect();
    }
  }, { threshold: 0.4 });
  statsObserver.observe(statsEl);
}

// Smooth nav links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const el = document.querySelector(a.getAttribute('href'));
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// Product gallery
const colourMap = {
  cobalt:   'images/alco-blue.png',
  forest:   'images/alco-green.png',
  coral:    'images/alco-coral.png',
  'hot-pink': 'images/alco-pink.png'
};
const mainImgSrc = document.getElementById('mainImgSrc');
const thumbs = document.querySelectorAll('.product-thumb');
const flavourBtns = document.querySelectorAll('.flavour-btn');

function setColour(colour) {
  if (!mainImgSrc) return;
  mainImgSrc.src = colourMap[colour] || colourMap.cobalt;
  thumbs.forEach(t => t.classList.toggle('active', t.dataset.colour === colour));
  flavourBtns.forEach(b => b.classList.toggle('active', b.dataset.flavour === colour));
}
thumbs.forEach(t => t.addEventListener('click', () => setColour(t.dataset.colour)));
flavourBtns.forEach(b => b.addEventListener('click', () => setColour(b.dataset.flavour)));

// Purchase type toggle
const purchaseOpts = document.querySelectorAll('.purchase-opt');
const priceEl = document.getElementById('displayPrice');
const perEl = document.getElementById('displayPer');
purchaseOpts.forEach(o => o.addEventListener('click', () => {
  purchaseOpts.forEach(x => x.classList.remove('active'));
  o.classList.add('active');
  if (priceEl) priceEl.textContent = '$' + o.dataset.price;
  if (perEl) perEl.textContent = o.dataset.per;
}));

// Quantity
let qty = 1;
const qtyVal = document.getElementById('qtyVal');
const qtyUp = document.getElementById('qtyUp');
const qtyDown = document.getElementById('qtyDown');
if (qtyUp) qtyUp.addEventListener('click', () => { qty++; qtyVal.textContent = qty; });
if (qtyDown) qtyDown.addEventListener('click', () => { if (qty > 1) { qty--; qtyVal.textContent = qty; } });

// Accordion
function toggleAcc(btn) {
  const body = btn.nextElementSibling;
  const icon = btn.querySelector('.accordion-icon');
  const isOpen = body.classList.contains('open');
  document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.accordion-icon').forEach(i => i.classList.remove('open'));
  if (!isOpen) { body.classList.add('open'); icon.classList.add('open'); }
}
