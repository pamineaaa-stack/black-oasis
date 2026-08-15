/* ============================================================
   WORK ITEMS — data behind the "Work" section on the public site
   ------------------------------------------------------------
   DEFAULT_WORK_ITEMS is what ships in the built site — it's what
   every visitor sees. The admin panel (admin.html) lets you add
   more items and preview them instantly in THIS browser (saved to
   localStorage), but that preview only lives on this computer/
   browser — it is not visible to your site's real visitors.

   To make new items visible to everyone, use the "Copiar código
   para publicar" button in the admin panel: it copies an updated
   version of DEFAULT_WORK_ITEMS below. Paste it here, replacing
   the array, then rebuild and redeploy the site (npm run build +
   upload the dist/ folder, or push to whatever host you're using).
   ============================================================= */
export const DEFAULT_WORK_ITEMS = [
  {
    id: 'coral-auto-ranch',
    name: "Coral's Auto Ranch",
    category: 'Colisión y carrocería — San Antonio, TX',
    url: 'https://coralsautoranch.com',
    image: '/corals-auto-ranch.png',
  },
];

const STORAGE_KEY = 'bo_work_items';

export function getWorkItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) { /* ignore malformed storage */ }
  return DEFAULT_WORK_ITEMS;
}

export function saveWorkItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function hasLocalOverrides() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
