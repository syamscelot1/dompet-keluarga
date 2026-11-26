// Data contoh DompetKeluarga: keluarga Hartono, November 2026.
// Semua angka dihitung dari daftar transaksi di bawah, jadi saldo,
// total kategori, dan chart selalu konsisten satu sama lain.
// Pengguna boleh mengubah data lewat situs; perubahan tersimpan
// di localStorage (kunci STORAGE_KEY) dan bisa dikembalikan ke
// data contoh ini lewat tombol "Kembalikan data contoh".

export const STORAGE_KEY = 'dompetkeluarga-v1';

export const FAMILY_NAME = 'Keluarga Hartono';
export const CURRENT_MONTH = '2026-11';

// Bulan berjalan ditampilkan dengan nama Indonesia.
export const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function monthLabel(ym) {
  const [y, m] = ym.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

// Kategori pengeluaran: anggaran bulanan November 2026.
// Warna dipakai di chart donat, progress bar, dan label kategori.
export const CATEGORIES = [
  { id: 'belanja', name: 'Belanja Harian', budget: 3500000, color: '#2e7d5b', note: 'Pasar, supermarket, dan beras' },
  { id: 'listrik', name: 'Listrik & Air', budget: 900000, color: '#3a7ca5', note: 'Token PLN dan tagihan PDAM' },
  { id: 'transport', name: 'Transport', budget: 1200000, color: '#c97a2b', note: 'Bensin, tol, parkir, dan servis' },
  { id: 'pendidikan', name: 'Pendidikan', budget: 1500000, color: '#7a5fbf', note: 'SPP, buku, dan les Dimas' },
  { id: 'kesehatan', name: 'Kesehatan', budget: 600000, color: '#c94f5e', note: 'Obat, vitamin, dan periksa' },
  { id: 'hiburan', name: 'Hiburan', budget: 500000, color: '#d9a441', note: 'Bioskop, streaming, makan di luar' },
  { id: 'lainnya', name: 'Lainnya', budget: 400000, color: '#8a8f98', note: 'Pulsa, paket data, perawatan rumah' },
];

// Kategori pemasukan.
export const INCOME_CATEGORIES = [
  { id: 'gaji', name: 'Gaji', color: '#2e7d5b' },
  { id: 'usaha', name: 'Usaha Sampingan', color: '#3a7ca5' },
];

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id)
    || INCOME_CATEGORIES.find((c) => c.id === id)
    || { id, name: id, color: '#8a8f98' };
}

// Ringkasan bulan-bulan sebelum November 2026 (Juni–Oktober).
// November dihitung langsung dari transaksi, jadi selalu cocok.
export const MONTH_HISTORY = [
  { month: '2026-06', income: 13200000, expense: 6410000 },
  { month: '2026-07', income: 13500000, expense: 6780000 },
  { month: '2026-08', income: 13800000, expense: 7120000 },
  { month: '2026-09', income: 14000000, expense: 6950000 },
  { month: '2026-10', income: 14000000, expense: 7340000 },
];

// Transaksi November 2026. Jumlah per kategori:
// Belanja 2.875.400 · Listrik & Air 742.500 · Transport 985.000
// Pendidikan 1.250.000 · Kesehatan 320.000 · Hiburan 415.000
// Lainnya 275.000 → pengeluaran 6.862.900.
// Pemasukan 14.000.000 → saldo bulan 7.137.100.
export const DEFAULT_TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', kind: 'income', category: 'gaji', note: 'Gaji Budi — PT Nusantara Jaya', amount: 8500000 },
  { id: 't02', date: '2026-11-01', kind: 'income', category: 'gaji', note: 'Gaji Sari — Toko Kain Sari', amount: 4200000 },
  { id: 't03', date: '2026-11-01', kind: 'expense', category: 'transport', note: 'Bensin motor', amount: 75000 },
  { id: 't04', date: '2026-11-02', kind: 'expense', category: 'belanja', note: 'Pasar tradisional — sayur dan buah', amount: 185000 },
  { id: 't05', date: '2026-11-03', kind: 'expense', category: 'listrik', note: 'Token listrik PLN 200 kWh', amount: 300000 },
  { id: 't06', date: '2026-11-04', kind: 'expense', category: 'pendidikan', note: 'SPP Dimas bulan November', amount: 750000 },
  { id: 't07', date: '2026-11-05', kind: 'expense', category: 'belanja', note: 'Supermarket — belanja mingguan', amount: 642500 },
  { id: 't08', date: '2026-11-05', kind: 'expense', category: 'lainnya', note: 'Pulsa dan paket data', amount: 150000 },
  { id: 't09', date: '2026-11-06', kind: 'expense', category: 'hiburan', note: 'Nonton bioskop sekeluarga', amount: 180000 },
  { id: 't10', date: '2026-11-07', kind: 'expense', category: 'kesehatan', note: 'Apotek — vitamin dan obat flu', amount: 145000 },
  { id: 't11', date: '2026-11-08', kind: 'expense', category: 'transport', note: 'Bensin mobil', amount: 250000 },
  { id: 't12', date: '2026-11-09', kind: 'expense', category: 'belanja', note: 'Pasar tradisional — lauk dan bumbu', amount: 210000 },
  { id: 't13', date: '2026-11-10', kind: 'expense', category: 'listrik', note: 'Tagihan air PDAM', amount: 142500 },
  { id: 't14', date: '2026-11-11', kind: 'expense', category: 'pendidikan', note: 'Buku dan alat tulis Dimas', amount: 185000 },
  { id: 't15', date: '2026-11-12', kind: 'expense', category: 'belanja', note: 'Supermarket — belanja mingguan', amount: 589000 },
  { id: 't16', date: '2026-11-13', kind: 'expense', category: 'hiburan', note: 'Langganan streaming sebulan', amount: 79000 },
  { id: 't17', date: '2026-11-14', kind: 'expense', category: 'kesehatan', note: 'Periksa gigi Dimas', amount: 175000 },
  { id: 't18', date: '2026-11-15', kind: 'income', category: 'usaha', note: 'Usaha sampingan — kue pesanan', amount: 1300000 },
  { id: 't19', date: '2026-11-15', kind: 'expense', category: 'transport', note: 'Parkir dan tol', amount: 120000 },
  { id: 't20', date: '2026-11-16', kind: 'expense', category: 'belanja', note: 'Warung — beras 25 kg', amount: 312500 },
  { id: 't21', date: '2026-11-17', kind: 'expense', category: 'pendidikan', note: 'Les matematika Dimas', amount: 315000 },
  { id: 't22', date: '2026-11-18', kind: 'expense', category: 'transport', note: 'Bensin motor', amount: 80000 },
  { id: 't23', date: '2026-11-19', kind: 'expense', category: 'belanja', note: 'Supermarket — belanja mingguan', amount: 456400 },
  { id: 't24', date: '2026-11-20', kind: 'expense', category: 'listrik', note: 'Token listrik PLN 200 kWh', amount: 300000 },
  { id: 't25', date: '2026-11-21', kind: 'expense', category: 'hiburan', note: 'Makan di luar sekeluarga', amount: 156000 },
  { id: 't26', date: '2026-11-22', kind: 'expense', category: 'transport', note: 'Servis motor berkala', amount: 210000 },
  { id: 't27', date: '2026-11-23', kind: 'expense', category: 'belanja', note: 'Pasar tradisional — sayur dan buah', amount: 198000 },
  { id: 't28', date: '2026-11-24', kind: 'expense', category: 'lainnya', note: 'Perawatan rumah — ganti lampu', amount: 125000 },
  { id: 't29', date: '2026-11-25', kind: 'expense', category: 'transport', note: 'Bensin mobil', amount: 250000 },
  { id: 't30', date: '2026-11-26', kind: 'expense', category: 'belanja', note: 'Supermarket — belanja mingguan', amount: 282000 },
];

// Tujuan tabungan keluarga Hartono.
export const DEFAULT_GOALS = [
  { id: 'g1', name: 'Dana Darurat', target: 20000000, saved: 12450000, note: 'Enam bulan pengeluaran pokok, disimpan terpisah.' },
  { id: 'g2', name: 'Liburan Keluarga', target: 6000000, saved: 3750000, note: 'Liburan ke pantai akhir tahun.' },
  { id: 'g3', name: 'DP Rumah', target: 50000000, saved: 18200000, note: 'Uang muka rumah pertama keluarga.' },
  { id: 'g4', name: 'Pendidikan Dimas', target: 10000000, saved: 4800000, note: 'Biaya masuk SMP tahun depan.' },
];

// ---- State: muat dari localStorage, atau pakai data contoh. ----
function defaultState() {
  return {
    transactions: DEFAULT_TRANSACTIONS.map((t) => ({ ...t })),
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
    goals: DEFAULT_GOALS.map((g) => ({ ...g })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || !Array.isArray(parsed.goals)) return defaultState();
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Penyimpanan penuh atau diblokir: situs tetap jalan di memori.
  }
}

export function resetState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* abaikan */ }
  return defaultState();
}

// ---- Hitungan: selalu diturunkan dari transaksi, bukan dihafal. ----
export function monthOf(date) {
  return String(date).slice(0, 7);
}

export function sumByKind(transactions, kind, month) {
  return transactions
    .filter((t) => t.kind === kind && (!month || monthOf(t.date) === month))
    .reduce((s, t) => s + t.amount, 0);
}

export function spentByCategory(transactions, month) {
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const t of transactions) {
    if (t.kind === 'expense' && monthOf(t.date) === month && out[t.category] !== undefined) {
      out[t.category] = (out[t.category] || 0) + t.amount;
    }
  }
  return out;
}

export function monthSummary(state, month) {
  const income = sumByKind(state.transactions, 'income', month);
  const expense = sumByKind(state.transactions, 'expense', month);
  const totalBudget = Object.values(state.budgets).reduce((s, b) => s + b, 0);
  return {
    income,
    expense,
    balance: income - expense,
    totalBudget,
    budgetLeft: totalBudget - expense,
    savingsRate: income > 0 ? (income - expense) / income : 0,
  };
}

// Ringkasan 6 bulan untuk Laporan: Juni–Oktober dari riwayat,
// November dihitung dari transaksi agar selalu cocok.
export function sixMonthSummary(state) {
  const rows = MONTH_HISTORY.map((h) => ({ ...h }));
  const nov = monthSummary(state, CURRENT_MONTH);
  rows.push({ month: CURRENT_MONTH, income: nov.income, expense: nov.expense });
  return rows;
}

export function totalSaved(goals) {
  return goals.reduce((s, g) => s + g.saved, 0);
}
