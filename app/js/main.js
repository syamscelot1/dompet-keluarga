// Titik masuk DompetKeluarga: muat state, pasang router, render
// halaman aktif ke #app, dan simpan perubahan ke localStorage.

import { loadState, saveState } from './data.js';
import { currentPath, startRouter } from './router.js';
import { renderPage, attachHandlers } from './pages.js';

const app = document.getElementById('app');
const state = loadState();

function render(path) {
  app.innerHTML = renderPage(path, state);
  attachHandlers(app, path, state, ctx);
}

const ctx = {
  // Simpan state lalu gambar ulang halaman yang sedang dibuka.
  save() {
    saveState(state);
    render(currentPath());
  },
  // Gambar ulang tanpa menyimpan (mis. geser bulan, ganti filter).
  rerender() {
    render(currentPath());
  },
  // Gambar ulang sambil mengembalikan fokus ke input pencarian.
  rerenderKeepFocus(id, caret) {
    render(currentPath());
    const el = document.getElementById(id);
    if (el) {
      el.focus();
      try { el.setSelectionRange(caret, caret); } catch { /* abaikan */ }
    }
  },
};

// Kembalikan data contoh: hapus simpanan lokal, muat ulang state.
const resetButton = document.getElementById('reset-data');
if (resetButton) resetButton.addEventListener('click', () => {
  if (window.confirm('Kembalikan semua data ke contoh awal Keluarga Hartono? Perubahan Anda akan hilang.')) {
    localStorage.removeItem('dompetkeluarga-v1');
    window.location.hash = '#/';
    window.location.reload();
  }
});

startRouter(render);
