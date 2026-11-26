// Format angka ke dalam rupiah dan tanggal Indonesia.
// Satu-satunya tempat format uang didefinisikan, supaya semua
// halaman menampilkan angka dengan cara yang sama.

export function formatRupiah(n) {
  const value = Math.round(Number(n) || 0);
  const sign = value < 0 ? '−' : '';
  const digits = String(Math.abs(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}Rp ${digits}`;
}

export function formatRupiahShort(n) {
  const value = Number(n) || 0;
  if (Math.abs(value) >= 1000000) {
    const jt = value / 1000000;
    return `Rp ${trimNumber(jt)} jt`;
  }
  if (Math.abs(value) >= 1000) {
    const rb = value / 1000;
    return `Rp ${trimNumber(rb)} rb`;
  }
  return formatRupiah(value);
}

function trimNumber(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ',');
}

export function formatPercent(ratio) {
  return `${Math.round((Number(ratio) || 0) * 100)}%`;
}

// '2026-11-05' -> '5 Nov 2026'
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function formatDate(iso) {
  const parts = String(iso).split('-');
  if (parts.length !== 3) return String(iso);
  const [y, m, d] = parts.map(Number);
  if (!y || !m || !d) return String(iso);
  return `${d} ${MONTH_SHORT[m - 1]} ${y}`;
}

export function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
