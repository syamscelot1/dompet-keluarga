// Router hash sederhana: #/dasbor, #/transaksi, #/anggaran,
// #/tujuan, #/laporan, #/panduan. Setiap rute dipetakan ke satu
// fungsi render di pages.js; nav aktif ikut berubah.

export const ROUTES = [
  { path: '/', name: 'Dasbor', hash: '#/' },
  { path: '/transaksi', name: 'Transaksi', hash: '#/transaksi' },
  { path: '/anggaran', name: 'Anggaran', hash: '#/anggaran' },
  { path: '/tujuan', name: 'Tujuan', hash: '#/tujuan' },
  { path: '/laporan', name: 'Laporan', hash: '#/laporan' },
  { path: '/panduan', name: 'Panduan', hash: '#/panduan' },
];

export function currentPath() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const path = raw.split('?')[0];
  return ROUTES.some((r) => r.path === path) ? path : '/';
}

export function startRouter(render) {
  const onChange = () => {
    render(currentPath());
    window.scrollTo(0, 0);
    document.querySelectorAll('[data-nav]').forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === `#${currentPath()}`);
    });
  };
  window.addEventListener('hashchange', onChange);
  onChange();
}
