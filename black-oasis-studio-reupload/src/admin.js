import './admin.css';
import { getWorkItems, saveWorkItems } from './work-store.js';
import { escapeHtml } from './utils.js';

/* ============================================================
   ADMIN PASSWORD
   ------------------------------------------------------------
   Read from .env.local (VITE_ADMIN_PASSWORD) — that file is
   listed in .gitignore, so the password itself never gets
   committed to your repository or shown in your source history.

   Important limitation to keep in mind: this is a static site
   with no server, so this whole check runs in the visitor's
   browser. That keeps the password out of your codebase and
   stops casual visitors from finding the panel, but it is NOT
   the same as real server-side protection — anyone determined
   enough could find the password inside the published JS file
   using their browser's dev tools. Don't reuse this password
   anywhere sensitive.
   ============================================================= */
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const SESSION_KEY = 'bo_admin_session';

const loginView = document.getElementById('loginView');
const panelView = document.getElementById('panelView');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

function showPanel() {
  loginView.style.display = 'none';
  panelView.style.display = 'block';
  renderList();
}

if (sessionStorage.getItem(SESSION_KEY) === '1') {
  showPanel();
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = document.getElementById('inpPassword').value;
  if (ADMIN_PASSWORD && val === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, '1');
    loginError.classList.remove('show');
    showPanel();
  } else {
    loginError.classList.add('show');
  }
});

document.getElementById('btnLogout').addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY);
  panelView.style.display = 'none';
  loginView.style.display = 'flex';
  document.getElementById('inpPassword').value = '';
});

/* ---------- add form ---------- */
let pendingImage = null;
const fImage = document.getElementById('fImage');
const thumbPreview = document.getElementById('thumbPreview');

fImage.addEventListener('change', () => {
  const file = fImage.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    pendingImage = ev.target.result;
    thumbPreview.innerHTML = `<img src="${pendingImage}" alt="">`;
  };
  reader.readAsDataURL(file);
});

document.getElementById('addForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('fName').value.trim();
  const category = document.getElementById('fCategory').value.trim();
  const url = document.getElementById('fUrl').value.trim();
  if (!name || !url) return;

  const items = getWorkItems();
  items.push({
    id: 'site-' + Date.now(),
    name,
    category,
    url,
    image: pendingImage || '',
  });
  saveWorkItems(items);

  e.target.reset();
  pendingImage = null;
  thumbPreview.innerHTML = '';
  renderList();
});

/* ---------- list + delete ---------- */
const itemList = document.getElementById('itemList');

function renderList() {
  const items = getWorkItems();
  if (!items.length) {
    itemList.innerHTML = `<p class="admin-empty">Todavía no hay sitios en el portafolio.</p>`;
    return;
  }
  itemList.innerHTML = items.map(item => `
    <div class="admin-item" data-id="${escapeHtml(item.id)}">
      <div class="thumb" style="background-image:url('${escapeHtml(item.image || '')}');"></div>
      <div class="info">
        <h4>${escapeHtml(item.name)}</h4>
        <p>${escapeHtml(item.category || item.url)}</p>
      </div>
      <button class="btn btn-danger" data-remove="${escapeHtml(item.id)}">Quitar</button>
    </div>
  `).join('');
}

itemList.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-remove]');
  if (!btn) return;
  const id = btn.dataset.remove;
  const items = getWorkItems().filter(i => i.id !== id);
  saveWorkItems(items);
  renderList();
});

/* ---------- publish: copy code snippet ---------- */
document.getElementById('btnCopyCode').addEventListener('click', async () => {
  const items = getWorkItems();
  const code = `export const DEFAULT_WORK_ITEMS = ${JSON.stringify(items, null, 2)};\n`;
  try {
    await navigator.clipboard.writeText(code);
  } catch (e) {
    // clipboard API unavailable — fall back to a manual prompt
    window.prompt('Copia este código manualmente:', code);
    return;
  }
  const confirmEl = document.getElementById('copyConfirm');
  confirmEl.classList.add('show');
  setTimeout(() => confirmEl.classList.remove('show'), 2200);
});
