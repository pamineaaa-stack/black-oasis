import './style.css';
import { getWorkItems } from './work-store.js';
import { escapeHtml } from './utils.js';

/* ============================================================
   GENERAL UI
============================================================= */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Work section (rendered from work-store.js) ---------- */
const workGrid = document.getElementById('workGrid');
function renderWork() {
  const items = getWorkItems();
  workGrid.innerHTML = items.map(item => `
    <a class="work-card" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">
      <div class="work-thumb work-thumb-img"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)} — vista previa del sitio web" loading="lazy"></div>
      <div class="work-info"><h4>${escapeHtml(item.name)}</h4><p>${escapeHtml(item.category)}</p></div>
    </a>
  `).join('');
}
renderWork();

const siteNav = document.getElementById('siteNav');
window.addEventListener('scroll', () => {
  siteNav.classList.toggle('scrolled', window.scrollY > 20);
});

const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
navBurger.addEventListener('click', () => {
  navBurger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navBurger.classList.remove('open'); navLinks.classList.remove('open');
}));

/* ============================================================
   WIZARD STATE
============================================================= */
const FEATURES = [
  { id: 'ai_assistant',    label: 'AI assistant',       desc: 'A smart assistant trained on your business, available 24/7 for your visitors.' },
  { id: 'direct_payments', label: 'Direct payments',    desc: 'Let customers pay directly on your website.' },
  { id: 'social_links',    label: 'Social media links', desc: 'Connect all your social profiles from the site.' },
  { id: 'reviews',         label: 'Customer reviews',   desc: 'Show off testimonials and reviews from real customers.' },
  { id: 'admin_panel',     label: 'Admin control panel',desc: 'Upload images and update content yourself, anytime.' },
];
const BASE_PRICE = 500;
const INCLUDED_FEATURES = 2;
const EXTRA_FEATURE_PRICE = 150;
const TOTAL_STEPS = 4;

let currentStep = 1;
let selectedFeatures = new Set();

const overlay = document.getElementById('wizardOverlay');
const btnBack = document.getElementById('btnBack');
const btnNext = document.getElementById('btnNext');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalNav = document.getElementById('modalNav');

function openWizard() {
  overlay.classList.add('open');
  requestAnimationFrame(() => overlay.classList.add('show'));
  document.body.style.overflow = 'hidden';
  goToStep(1);
}
function closeWizard() {
  overlay.classList.remove('show');
  document.body.style.overflow = '';
  setTimeout(() => overlay.classList.remove('open'), 300);
}
document.querySelectorAll('[data-open-wizard]').forEach(el => el.addEventListener('click', openWizard));
document.getElementById('btnCloseWizard').addEventListener('click', closeWizard);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeWizard(); });

function goToStep(n) {
  currentStep = n;
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`.step-panel[data-step="${n}"]`).classList.add('active');

  document.querySelectorAll('.step-dots .d').forEach((d, i) => {
    d.classList.remove('active', 'done', 'pending');
    const dn = i + 1;
    if (dn < n) d.classList.add('done');
    else if (dn === n) d.classList.add('active');
    else d.classList.add('pending');
  });

  modalSubtitle.textContent = `Step ${n} of ${TOTAL_STEPS}`;
  btnBack.style.visibility = n === 1 ? 'hidden' : 'visible';
  btnNext.textContent = n === TOTAL_STEPS ? "Send my quote — it's free" : 'Continue';
  modalNav.style.display = 'flex';

  if (n === 3) renderFeatures();
  if (n === 4) renderReview();
}

btnNext.addEventListener('click', () => {
  if (currentStep === 1) {
    const company = document.getElementById('inpCompany').value.trim();
    const errCompany = document.getElementById('errCompany');
    const sector = document.getElementById('inpSector').value.trim();
    const errSector = document.getElementById('errSector');
    let ok = true;
    if (!company) { errCompany.classList.add('show'); ok = false; } else { errCompany.classList.remove('show'); }
    if (!sector) { errSector.classList.add('show'); ok = false; } else { errSector.classList.remove('show'); }
    if (!ok) return;
  }
  if (currentStep === TOTAL_STEPS) {
    sendQuote();
    return;
  }
  goToStep(currentStep + 1);
});
btnBack.addEventListener('click', () => {
  if (currentStep > 1) goToStep(currentStep - 1);
});

/* ---------- Step 3: features + pricing ---------- */
const featureList = document.getElementById('featureList');
function renderFeatures() {
  featureList.innerHTML = '';
  FEATURES.forEach(f => {
    const card = document.createElement('div');
    card.className = 'feature-card' + (selectedFeatures.has(f.id) ? ' checked' : '');
    card.dataset.id = f.id;
    card.innerHTML = `
      <div class="feature-check"><svg viewBox="0 0 20 20" fill="none"><path d="M4 10.5l4 4L16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="feature-text"><h4>${f.label}</h4><p>${f.desc}</p></div>
    `;
    card.addEventListener('click', () => {
      if (selectedFeatures.has(f.id)) selectedFeatures.delete(f.id);
      else selectedFeatures.add(f.id);
      renderFeatures();
    });
    featureList.appendChild(card);
  });
  updatePrice();
}
function computePrice() {
  const n = selectedFeatures.size;
  const extras = Math.max(0, n - INCLUDED_FEATURES);
  return { total: BASE_PRICE + extras * EXTRA_FEATURE_PRICE, extras, n };
}
function updatePrice() {
  const { total, extras, n } = computePrice();
  document.getElementById('priceVal').textContent = '$' + total;
  const breakdown = document.getElementById('priceBreakdown');
  if (n <= INCLUDED_FEATURES) {
    breakdown.textContent = `$500 base · ${n}/${INCLUDED_FEATURES} free features used`;
  } else {
    breakdown.textContent = `$500 base + ${extras} extra feature${extras > 1 ? 's' : ''} × $150`;
  }
}

/* ---------- Step 4: review ---------- */
function renderReview() {
  const company = document.getElementById('inpCompany').value.trim();
  const sector = document.getElementById('inpSector').value.trim();
  const email = document.getElementById('inpEmail').value.trim() || '—';
  const aesthetic = document.getElementById('inpAesthetic').value.trim() || '—';
  const featureLabels = FEATURES.filter(f => selectedFeatures.has(f.id)).map(f => f.label);
  const { total } = computePrice();

  const block = document.getElementById('reviewBlock');
  block.innerHTML = `
    <div class="review-row"><span class="k">Business name</span><span class="v">${escapeHtml(company)}</span></div>
    <div class="review-row"><span class="k">Sector</span><span class="v">${escapeHtml(sector)}</span></div>
    <div class="review-row"><span class="k">Email</span><span class="v">${escapeHtml(email)}</span></div>
    <div class="review-row"><span class="k">Aesthetic</span><span class="v">${escapeHtml(aesthetic)}</span></div>
    <div class="review-row"><span class="k">Features</span><span class="v">${featureLabels.length ? featureLabels.join(', ') : 'None selected'}</span></div>
    <div class="review-row"><span class="k">Estimated total</span><span class="v" style="color:var(--sand-soft);font-weight:700;">$${total}</span></div>
  `;
}

/* ============================================================
   SEND QUOTE — OPENS GMAIL, FULLY PRE-FILLED
   ------------------------------------------------------------
   No backend, no third-party account, no API key, nothing that
   can silently fail. When the client finishes the wizard, this
   opens Gmail's own compose screen (in their browser) already
   addressed to blackoasisstudii@gmail.com, with the subject and
   the full quote written out — the client only has to hit Send.

   The client no longer attaches reference images through the
   site (that step was removed) — so the quote email is plain
   text and nothing needs to be downloaded first.
   ============================================================= */
const OWNER_EMAIL = 'blackoasisstudii@gmail.com';

function buildQuoteBody({ company, sector, clientEmail, aesthetic, featureLabels, total }) {
  const lines = [
    `Negocio: ${company}`,
    `Sector / rubro: ${sector}`,
    `Correo del cliente: ${clientEmail || 'no proporcionado'}`,
    `Estética deseada: ${aesthetic || 'no especificada'}`,
    `Funciones seleccionadas: ${featureLabels.length ? featureLabels.join(', ') : 'Ninguna'}`,
    `Precio estimado: $${total}`,
  ];
  return lines.join('\n');
}

function sendQuote() {
  const company = document.getElementById('inpCompany').value.trim();
  const sector = document.getElementById('inpSector').value.trim();
  const clientEmail = document.getElementById('inpEmail').value.trim();
  const aesthetic = document.getElementById('inpAesthetic').value.trim();
  const featureLabels = FEATURES.filter(f => selectedFeatures.has(f.id)).map(f => f.label);
  const { total } = computePrice();

  const subject = encodeURIComponent('Cotización de web');
  const body = encodeURIComponent(buildQuoteBody({ company, sector, clientEmail, aesthetic, featureLabels, total }));
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(OWNER_EMAIL)}&su=${subject}&body=${body}`;

  // Open Gmail as the VERY FIRST thing that happens on click — no
  // prompt(), no async work, nothing in between — so no browser
  // treats it as an unsolicited popup and blocks it.
  const gmailTab = window.open(gmailUrl, '_blank', 'noopener');

  // If the popup was blocked anyway, fall back to mailto (uses
  // whatever desktop mail app is installed — may not be Gmail).
  if (!gmailTab) {
    window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
  }

  goToStep('success');
  modalNav.style.display = 'none';
}
