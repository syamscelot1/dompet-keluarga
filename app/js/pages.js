// Halaman-halaman DompetKeluarga. Setiap halaman adalah fungsi yang
// mengembalikan HTML dari state saat ini; semua angka dihitung dari
// transaksi, jadi tidak ada angka yang ditulis tangan dua kali.
// Event form dan tombol dipasang oleh attachHandlers setelah render.

import {
  CATEGORIES, INCOME_CATEGORIES, MONTH_HISTORY, CURRENT_MONTH,
  categoryById, monthLabel, monthOf, monthSummary, sixMonthSummary,
  spentByCategory, sumByKind, totalSaved,
} from './data.js';
import { formatDate, formatPercent, formatRupiah, formatRupiahShort, escapeHtml } from './format.js';
import { donutChart, monthBarChart, horizontalBar, progressBar } from './charts.js';

// Bulan yang sedang dilihat di Dasbor (bisa digeser Juni–November).
let viewMonth = CURRENT_MONTH;

function monthIndex(ym) {
  return MONTH_HISTORY.findIndex((h) => h.month === ym);
}

function historyRow(ym) {
  return MONTH_HISTORY.find((h) => h.month === ym) || null;
}

function summaryFor(state, ym) {
  if (ym === CURRENT_MONTH) return monthSummary(state, ym);
  const row = historyRow(ym);
  if (!row) return null;
  return {
    income: row.income,
    expense: row.expense,
    balance: row.income - row.expense,
    totalBudget: null,
    budgetLeft: null,
    savingsRate: row.income > 0 ? (row.income - row.expense) / row.income : 0,
  };
}

function statCard(label, value, sub, tone) {
  return `<div class="stat ${tone || ''}">
    <div class="stat-label">${label}</div>
    <div class="stat-value">${value}</div>
    <div class="stat-sub">${sub}</div>
  </div>`;
}

function categoryChip(catId) {
  const c = categoryById(catId);
  return `<span class="chip"><span class="dot" style="background:${c.color}"></span>${escapeHtml(c.name)}</span>`;
}

function txRow(t) {
  const sign = t.kind === 'income' ? '+' : '−';
  return `<tr>
    <td data-label="Tanggal">${formatDate(t.date)}</td>
    <td data-label="Keterangan">${escapeHtml(t.note)}</td>
    <td data-label="Kategori">${categoryChip(t.category)}</td>
    <td data-label="Jumlah" class="amount ${t.kind}">${sign} ${formatRupiah(t.amount)}</td>
    <td class="row-actions">
      <button type="button" class="btn small" data-action="edit-tx" data-id="${t.id}">Ubah</button>
      <button type="button" class="btn small danger" data-action="delete-tx" data-id="${t.id}">Hapus</button>
    </td>
  </tr>`;
}

// ---------------- Dasbor ----------------

function renderDashboard(state) {
  const s = summaryFor(state, viewMonth);
  const isCurrent = viewMonth === CURRENT_MONTH;
  const spent = isCurrent ? spentByCategory(state.transactions, viewMonth) : null;
  const totalExpense = s.expense;
  const slices = isCurrent
    ? CATEGORIES.map((c) => ({ label: c.name, value: spent[c.id], color: c.color }))
    : [];
  const recent = [...state.transactions]
    .filter((t) => monthOf(t.date) === viewMonth)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 5);
  const totalGoalTarget = state.goals.reduce((x, g) => x + g.target, 0);
  const saved = totalSaved(state.goals);
  const biggest = isCurrent
    ? CATEGORIES.map((c) => ({ ...c, spent: spent[c.id] })).sort((a, b) => b.spent - a.spent)[0]
    : null;
  const prevDisabled = viewMonth <= '2026-06';
  const nextDisabled = viewMonth >= CURRENT_MONTH;

  const fourth = isCurrent
    ? statCard('Sisa Anggaran', formatRupiah(s.budgetLeft), `dari total anggaran ${formatRupiah(s.totalBudget)}`, s.budgetLeft < 0 ? 'bad' : 'good')
    : statCard('Tingkat Menabung', formatPercent(s.savingsRate), 'dari pemasukan bulan itu', 'good');

  return `
  <section class="hero">
    <div>
      <p class="eyebrow">DompetKeluarga · Keluarga Hartono</p>
      <h1>Uang keluarga, terlihat semua.</h1>
      <p class="lede">Pemasukan, pengeluaran, anggaran, dan tabungan dalam satu
      tempat — dihitung dari transaksi yang dicatat sendiri.</p>
    </div>
    <div class="month-nav" role="group" aria-label="Pilih bulan">
      <button type="button" class="btn" data-action="month-prev" ${prevDisabled ? 'disabled' : ''} aria-label="Bulan sebelumnya">‹</button>
      <span class="month-label">${monthLabel(viewMonth)}</span>
      <button type="button" class="btn" data-action="month-next" ${nextDisabled ? 'disabled' : ''} aria-label="Bulan berikutnya">›</button>
    </div>
  </section>

  <section class="stats" aria-label="Ringkasan bulan">
    ${statCard('Pemasukan', formatRupiah(s.income), monthLabel(viewMonth), 'good')}
    ${statCard('Pengeluaran', formatRupiah(s.expense), monthLabel(viewMonth), 'bad')}
    ${statCard('Saldo Bulan Ini', formatRupiah(s.balance), 'pemasukan dikurangi pengeluaran', s.balance >= 0 ? 'good' : 'bad')}
    ${fourth}
  </section>

  <section class="grid two">
    <article class="card">
      <h2>Pengeluaran per Kategori</h2>
      ${isCurrent ? `
      <div class="donut-wrap">
        ${donutChart(slices)}
        <ul class="legend">
          ${CATEGORIES.map((c) => `<li><span class="dot" style="background:${c.color}"></span>
            <span class="legend-name">${c.name}</span>
            <span class="legend-value">${formatRupiah(spent[c.id])}</span>
            <span class="legend-pct">${totalExpense > 0 ? Math.round((spent[c.id] / totalExpense) * 100) : 0}%</span></li>`).join('')}
        </ul>
      </div>
      <p class="muted">Kategori terbesar: <strong>${biggest.name}</strong> (${formatRupiah(biggest.spent)}).
      <a href="#/anggaran">Lihat anggaran →</a></p>`
      : `<p>Rincian transaksi tersedia untuk November 2026 — bulan yang
        dicatat lengkap di situs ini. Ringkasan ${monthLabel(viewMonth)} di atas
        berasal dari catatan keluarga.</p>
        <p><a href="#/laporan">Lihat perbandingan enam bulan →</a></p>`}
    </article>

    <article class="card">
      <h2>Anggaran Bulan Ini</h2>
      ${isCurrent ? `
      ${progressBar(s.expense / s.totalBudget)}
      <p><strong>${formatRupiah(s.expense)}</strong> dari anggaran
      <strong>${formatRupiah(s.totalBudget)}</strong> sudah terpakai
      (${formatPercent(s.expense / s.totalBudget)}).</p>
      <ul class="mini-list">
        ${CATEGORIES.map((c) => ({ ...c, spent: spent[c.id] }))
          .sort((a, b) => (b.spent / state.budgets[b.id]) - (a.spent / state.budgets[a.id]))
          .slice(0, 3)
          .map((c) => `<li><span class="dot" style="background:${c.color}"></span>${c.name}:
            ${formatPercent(c.spent / state.budgets[c.id])} terpakai
            (${formatRupiahShort(c.spent)} dari ${formatRupiahShort(state.budgets[c.id])})</li>`).join('')}
      </ul>
      <p><a href="#/anggaran">Atur anggaran →</a></p>`
      : `<p>Anggaran rinci hanya disusun untuk November 2026.</p>
        <p><a href="#/anggaran">Lihat anggaran November →</a></p>`}
    </article>
  </section>

  <section class="grid two">
    <article class="card">
      <h2>Transaksi Terbaru</h2>
      ${recent.length ? `<table class="tx-table compact">
        <tbody>${recent.map(txRow).join('')}</tbody>
      </table>` : `<p class="muted">Belum ada transaksi tercatat di ${monthLabel(viewMonth)}.</p>`}
      <p><a href="#/transaksi">Semua transaksi →</a></p>
    </article>

    <article class="card">
      <h2>Tabungan Keluarga</h2>
      ${progressBar(saved / totalGoalTarget)}
      <p><strong>${formatRupiah(saved)}</strong> terkumpul dari target
      <strong>${formatRupiah(totalGoalTarget)}</strong>
      (${formatPercent(saved / totalGoalTarget)}).</p>
      <ul class="mini-list">
        ${state.goals.map((g) => `<li><span class="dot" style="background:#2e7d5b"></span>${escapeHtml(g.name)}:
          ${formatPercent(g.saved / g.target)} (${formatRupiahShort(g.saved)} dari ${formatRupiahShort(g.target)})</li>`).join('')}
      </ul>
      <p><a href="#/tujuan">Lihat semua tujuan →</a></p>
    </article>
  </section>

  <section class="card tip">
    <h2>Catatan bulan ini</h2>
    <p>${isCurrent
      ? `Keluarga Hartono menabung ${formatRupiah(s.balance)} di bulan November — ${formatPercent(s.savingsRate)} dari pemasukan.
        Kategori terbesar adalah ${biggest.name}. Sisa anggaran ${formatRupiah(s.budgetLeft)} masih cukup untuk seminggu terakhir.`
      : `Di ${monthLabel(viewMonth)}, keluarga menabung ${formatRupiah(s.balance)} (${formatPercent(s.savingsRate)} dari pemasukan).`}
    </p>
  </section>`;
}

// ---------------- Transaksi ----------------

// Filter yang sedang aktif di halaman Transaksi.
const txFilter = { q: '', kind: 'all', category: 'all' };
let editingId = null;

function txFormHtml(state) {
  const editing = editingId ? state.transactions.find((t) => t.id === editingId) : null;
  const kind = editing ? editing.kind : 'expense';
  const cats = kind === 'income' ? INCOME_CATEGORIES : CATEGORIES;
  return `<form id="tx-form" class="form-card">
    <h3>${editing ? 'Ubah Transaksi' : 'Tambah Transaksi'}</h3>
    <div class="form-grid">
      <label>Tanggal
        <input type="date" name="date" required value="${editing ? editing.date : '2026-11-26'}">
      </label>
      <label>Jenis
        <select name="kind" id="tx-kind">
          <option value="expense" ${kind === 'expense' ? 'selected' : ''}>Pengeluaran</option>
          <option value="income" ${kind === 'income' ? 'selected' : ''}>Pemasukan</option>
        </select>
      </label>
      <label>Kategori
        <select name="category" id="tx-category">
          ${cats.map((c) => `<option value="${c.id}" ${editing && editing.category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
      </label>
      <label>Jumlah (Rp)
        <input type="number" name="amount" required min="1000" placeholder="contoh: 150000" value="${editing ? editing.amount : ''}">
      </label>
      <label class="wide">Keterangan
        <input type="text" name="note" required maxlength="80" placeholder="contoh: Pasar tradisional — sayur" value="${editing ? escapeHtml(editing.note) : ''}">
      </label>
    </div>
    <div class="form-actions">
      <button type="submit" class="btn primary">${editing ? 'Simpan Perubahan' : 'Tambah Transaksi'}</button>
      ${editing ? '<button type="button" class="btn" data-action="cancel-edit">Batal</button>' : ''}
    </div>
  </form>`;
}

function renderTransactions(state) {
  const q = txFilter.q.trim().toLowerCase();
  const list = [...state.transactions]
    .filter((t) => (txFilter.kind === 'all' || t.kind === txFilter.kind))
    .filter((t) => (txFilter.category === 'all' || t.category === txFilter.category))
    .filter((t) => !q || t.note.toLowerCase().includes(q) || categoryById(t.category).name.toLowerCase().includes(q))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const inSum = list.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0);
  const outSum = list.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0);
  const allCats = [...INCOME_CATEGORIES, ...CATEGORIES];

  return `
  <section class="page-head">
    <h1>Transaksi</h1>
    <p class="lede">Semua pemasukan dan pengeluaran November 2026. Tambah, ubah,
    atau hapus — saldo, anggaran, dan chart ikut berubah otomatis.</p>
  </section>

  ${txFormHtml(state)}

  <section class="card">
    <div class="filters">
      <label>Cari
        <input type="search" id="tx-search" placeholder="Cari keterangan atau kategori…" value="${escapeHtml(txFilter.q)}">
      </label>
      <label>Jenis
        <select id="tx-kind-filter">
          <option value="all" ${txFilter.kind === 'all' ? 'selected' : ''}>Semua</option>
          <option value="income" ${txFilter.kind === 'income' ? 'selected' : ''}>Pemasukan</option>
          <option value="expense" ${txFilter.kind === 'expense' ? 'selected' : ''}>Pengeluaran</option>
        </select>
      </label>
      <label>Kategori
        <select id="tx-cat-filter">
          <option value="all">Semua kategori</option>
          ${allCats.map((c) => `<option value="${c.id}" ${txFilter.category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
      </label>
    </div>
    <p class="filter-summary"><strong>${list.length}</strong> transaksi ditampilkan ·
      Pemasukan <strong class="amount income">+ ${formatRupiah(inSum)}</strong> ·
      Pengeluaran <strong class="amount expense">− ${formatRupiah(outSum)}</strong></p>
    ${list.length ? `<table class="tx-table">
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th>Jumlah</th><th></th></tr></thead>
      <tbody>${list.map(txRow).join('')}</tbody>
    </table>` : `<p class="muted">Tidak ada transaksi yang cocok dengan filter. Ubah kata kunci atau filter di atas.</p>`}
    <p class="muted small">Data tersimpan di peramban ini (localStorage). Menghapus atau
    mengubah transaksi langsung mengubah saldo di Dasbor dan sisa anggaran.</p>
  </section>`;
}

// ---------------- Anggaran ----------------

function renderBudgets(state) {
  const spent = spentByCategory(state.transactions, CURRENT_MONTH);
  const totalBudget = Object.values(state.budgets).reduce((s, b) => s + b, 0);
  const totalSpent = CATEGORIES.reduce((s, c) => s + spent[c.id], 0);
  return `
  <section class="page-head">
    <h1>Anggaran</h1>
    <p class="lede">Batas belanja tiap kategori untuk November 2026. Ubah nominalnya
    kapan saja — progress bar dan sisa anggaran langsung menyesuaikan.</p>
  </section>

  <section class="stats">
    ${statCard('Total Anggaran', formatRupiah(totalBudget), 'semua kategori', '')}
    ${statCard('Terpakai', formatRupiah(totalSpent), formatPercent(totalSpent / totalBudget) + ' dari anggaran', totalSpent > totalBudget ? 'bad' : '')}
    ${statCard('Sisa Anggaran', formatRupiah(totalBudget - totalSpent), 'untuk sisa bulan November', totalBudget - totalSpent < 0 ? 'bad' : 'good')}
    ${statCard('Kategori Terpakai Penuh', String(CATEGORIES.filter((c) => spent[c.id] >= state.budgets[c.id]).length), 'dari ' + CATEGORIES.length + ' kategori', '')}
  </section>

  <section class="grid two">
    ${CATEGORIES.map((c) => {
      const used = spent[c.id];
      const budget = state.budgets[c.id];
      const left = budget - used;
      const ratio = budget > 0 ? used / budget : 0;
      return `<article class="card budget-card">
        <div class="budget-head">
          <h2><span class="dot" style="background:${c.color}"></span>${c.name}</h2>
          <span class="budget-pct ${ratio > 1 ? 'over' : ''}">${formatPercent(ratio)}</span>
        </div>
        <p class="muted">${c.note}</p>
        ${progressBar(ratio)}
        <dl class="budget-numbers">
          <div><dt>Terpakai</dt><dd>${formatRupiah(used)}</dd></div>
          <div><dt>Anggaran</dt><dd>${formatRupiah(budget)}</dd></div>
          <div><dt>${left >= 0 ? 'Sisa' : 'Lebih'}</dt><dd class="${left >= 0 ? 'good-text' : 'bad-text'}">${formatRupiah(Math.abs(left))}</dd></div>
        </dl>
        <form class="budget-form" data-cat="${c.id}">
          <label>Ubah anggaran (Rp)
            <input type="number" name="budget" min="0" value="${budget}" required>
          </label>
          <button type="submit" class="btn small">Simpan</button>
        </form>
      </article>`;
    }).join('')}
  </section>

  <section class="card tip">
    <h2>Patokan 50/30/20</h2>
    <p>Dari pemasukan Rp 14.000.000, keluarga Hartono memakai sekitar
    ${formatPercent(sumByKind(state.transactions, 'expense', CURRENT_MONTH) / sumByKind(state.transactions, 'income', CURRENT_MONTH))}
    untuk semua pengeluaran — di bawah batas kebutuhan 50% ditambah keinginan 30%.
    Sisanya ${formatPercent(1 - sumByKind(state.transactions, 'expense', CURRENT_MONTH) / sumByKind(state.transactions, 'income', CURRENT_MONTH))}
    bisa masuk tabungan. Cara menghitungnya ada di
    <a href="#/panduan">Panduan →</a></p>
  </section>`;
}

// ---------------- Tujuan / Tabungan ----------------

function renderGoals(state) {
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  const saved = totalSaved(state.goals);
  return `
  <section class="page-head">
    <h1>Tujuan &amp; Tabungan</h1>
    <p class="lede">Empat target tabungan keluarga Hartono. Tambah dana kapan saja —
    progress langsung bergerak, dan total tabungan ikut berubah di Dasbor.</p>
  </section>

  <section class="stats">
    ${statCard('Total Terkumpul', formatRupiah(saved), 'di semua tujuan', 'good')}
    ${statCard('Total Target', formatRupiah(totalTarget), 'semua tujuan digabung', '')}
    ${statCard('Progres Keseluruhan', formatPercent(saved / totalTarget), 'dari seluruh target', '')}
    ${statCard('Masih Kurang', formatRupiah(totalTarget - saved), 'untuk mencapai semua target', '')}
  </section>

  <section class="grid two">
    ${state.goals.map((g) => {
      const ratio = g.target > 0 ? g.saved / g.target : 0;
      return `<article class="card goal-card">
        <h2>${escapeHtml(g.name)}</h2>
        <p class="muted">${escapeHtml(g.note)}</p>
        ${progressBar(ratio)}
        <p><strong>${formatRupiah(g.saved)}</strong> dari ${formatRupiah(g.target)}
        · ${formatPercent(ratio)} · kurang ${formatRupiah(Math.max(g.target - g.saved, 0))}</p>
        <form class="goal-form" data-goal="${g.id}">
          <label>Tambah dana (Rp)
            <input type="number" name="amount" min="1000" placeholder="contoh: 250000" required>
          </label>
          <button type="submit" class="btn small primary">Tambah Dana</button>
        </form>
        <button type="button" class="btn small danger linklike" data-action="delete-goal" data-id="${g.id}">Hapus tujuan ini</button>
      </article>`;
    }).join('')}
  </section>

  <section class="card">
    <form id="goal-new-form" class="form-card">
      <h3>Buat Tujuan Baru</h3>
      <div class="form-grid">
        <label>Nama tujuan
          <input type="text" name="name" required maxlength="40" placeholder="contoh: Umrah keluarga">
        </label>
        <label>Target (Rp)
          <input type="number" name="target" required min="100000" placeholder="contoh: 15000000">
        </label>
        <label>Tabungan awal (Rp)
          <input type="number" name="saved" min="0" value="0">
        </label>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn primary">Buat Tujuan</button>
      </div>
    </form>
  </section>`;
}

// ---------------- Laporan ----------------

function renderReport(state) {
  const rows = sixMonthSummary(state).map((r) => ({
    ...r,
    label: monthLabel(r.month).split(' ')[0].slice(0, 3),
    balance: r.income - r.expense,
    rate: r.income > 0 ? (r.income - r.expense) / r.income : 0,
  }));
  const spent = spentByCategory(state.transactions, CURRENT_MONTH);
  const maxSpent = Math.max(1, ...CATEGORIES.map((c) => spent[c.id]));
  const avgExpense = rows.reduce((s, r) => s + r.expense, 0) / rows.length;
  const bestSaver = [...rows].sort((a, b) => b.rate - a.rate)[0];
  const worstMonth = [...rows].sort((a, b) => b.expense - a.expense)[0];
  const biggestCat = CATEGORIES.map((c) => ({ ...c, spent: spent[c.id] })).sort((a, b) => b.spent - a.spent)[0];

  return `
  <section class="page-head">
    <h1>Laporan</h1>
    <p class="lede">Enam bulan terakhir keluarga Hartono: pemasukan melawan
    pengeluaran, bulan demi bulan, plus rincian kategori November 2026.</p>
  </section>

  <section class="card">
    <h2>Pemasukan vs Pengeluaran — Juni sampai November 2026</h2>
    ${monthBarChart(rows)}
    <p class="legend-inline"><span class="swatch" style="background:#2e7d5b"></span> Pemasukan
    <span class="swatch" style="background:#c94f5e"></span> Pengeluaran</p>
    <table class="tx-table report-table">
      <thead><tr><th>Bulan</th><th>Pemasukan</th><th>Pengeluaran</th><th>Ditabung</th><th>Tingkat Menabung</th></tr></thead>
      <tbody>
        ${rows.map((r) => `<tr>
          <td data-label="Bulan">${monthLabel(r.month)}</td>
          <td data-label="Pemasukan" class="amount income">+ ${formatRupiah(r.income)}</td>
          <td data-label="Pengeluaran" class="amount expense">− ${formatRupiah(r.expense)}</td>
          <td data-label="Ditabung">${formatRupiah(r.balance)}</td>
          <td data-label="Tingkat Menabung">${formatPercent(r.rate)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </section>

  <section class="grid two">
    <article class="card">
      <h2>Rincian Kategori — November 2026</h2>
      <ul class="cat-bars">
        ${CATEGORIES.map((c) => `<li>
          <div class="cat-bar-head"><span><span class="dot" style="background:${c.color}"></span>${c.name}</span>
          <strong>${formatRupiah(spent[c.id])}</strong></div>
          ${horizontalBar(spent[c.id], maxSpent, c.color)}
        </li>`).join('')}
      </ul>
      <p class="muted">Total pengeluaran November: ${formatRupiah(rows[5].expense)}.</p>
    </article>
    <article class="card">
      <h2>Yang Bisa Dibaca dari Angka</h2>
      <ul class="insight-list">
        <li><strong>Bulan paling hemat: ${monthLabel(bestSaver.month)}</strong> — menabung
          ${formatPercent(bestSaver.rate)} dari pemasukan (${formatRupiah(bestSaver.balance)}).</li>
        <li><strong>Pengeluaran terbesar: ${monthLabel(worstMonth.month)}</strong> —
          ${formatRupiah(worstMonth.expense)}, di atas rata-rata enam bulan
          (${formatRupiah(avgExpense)}).</li>
        <li><strong>Kategori terbesar bulan ini: ${biggestCat.name}</strong> —
          ${formatRupiah(biggestCat.spent)}, sekitar
          ${formatPercent(biggestCat.spent / rows[5].expense)} dari total pengeluaran November.</li>
        <li><strong>Tren menabung membaik:</strong> rata-rata tingkat menabung enam bulan
          ${formatPercent(rows.reduce((s, r) => s + r.rate, 0) / rows.length)}, dengan November di
          ${formatPercent(rows[5].rate)}.</li>
      </ul>
    </article>
  </section>`;
}

// ---------------- Panduan ----------------

function renderGuide() {
  return `
  <section class="page-head">
    <h1>Panduan Keuangan Keluarga</h1>
    <p class="lede">Cara praktis mengatur uang rumah tangga — ditulis untuk keluarga
    Indonesia dengan gaji bulanan, bukan teori dari buku impor.</p>
  </section>

  <section class="card">
    <h2>Kalkulator 50/30/20</h2>
    <p>Masukkan pemasukan bulanan keluarga, lalu lihat pembagiannya menurut
    aturan 50/30/20: 50% kebutuhan, 30% keinginan, 20% tabungan.</p>
    <form id="calc-form" class="form-card">
      <div class="form-grid">
        <label>Pemasukan bulanan (Rp)
          <input type="number" id="calc-income" name="income" min="0" value="14000000" required>
        </label>
      </div>
    </form>
    <div class="calc-results" id="calc-results"></div>
  </section>

  <section class="grid two">
    <article class="card">
      <h2>1 · Aturan 50/30/20</h2>
      <p>Dari gaji bulanan, sisihkan <strong>50% untuk kebutuhan</strong> (makan,
      listrik, air, transport, SPP), <strong>30% untuk keinginan</strong>
      (nonton, makan di luar, langganan streaming), dan <strong>20% untuk
      tabungan dan dana darurat</strong>. Keluarga Hartono di November memakai
      49% untuk semua pengeluaran — artinya masih ada ruang menabung di atas 20%.</p>
      <p>Kalau kebutuhan sudah di atas 50%, jangan potong tabungan dulu:
      potong keinginannya. Tabungan adalah tagihan pertama, bukan sisa.</p>
    </article>
    <article class="card">
      <h2>2 · Dana darurat dulu</h2>
      <p>Sebelum menabung untuk liburan atau rumah, lengkapi <strong>dana
      darurat 3–6 bulan pengeluaran pokok</strong>. Untuk keluarga Hartono,
      pengeluaran pokok sekitar Rp 6,8 juta sebulan — dana daruratnya
      Rp 20 juta, dan sudah terkumpul Rp 12,45 juta.</p>
      <p>Simpan dana darurat di rekening terpisah yang tidak dipakai belanja
      harian. Kalau tercampur dengan uang belanja, ia akan habis pelan-pelan
      tanpa terasa.</p>
    </article>
    <article class="card">
      <h2>3 · Bayar diri sendiri dulu</h2>
      <p>Di hari gajian, pindahkan tabungan <strong>sebelum</strong> belanja —
      bukan menunggu sisa di akhir bulan. Atur autodebet tanggal 1 atau 2,
      sebesar 20% pemasukan, ke rekening tabungan yang berbeda bank.</p>
      <p>Keluarga Hartono memindahkan Rp 2,8 juta tiap tanggal 1. Uang yang
      tidak terlihat tidak akan dibelanjakan.</p>
    </article>
    <article class="card">
      <h2>4 · Catat setiap rupiah</h2>
      <p>Pengeluaran kecil yang tidak dicatat — gorengan Rp 10 ribu, parkir
      Rp 5 ribu, kopi Rp 18 ribu — bisa jadi Rp 500 ribu sebulan tanpa jejak.
      Catat di hari yang sama, selagi masih ingat.</p>
      <p>Di situs ini, setiap transaksi yang dicatat langsung mengubah saldo,
      anggaran, dan chart. Tidak ada angka yang perlu dihitung ulang manual.</p>
    </article>
    <article class="card">
      <h2>5 · Belanja mingguan, bukan harian</h2>
      <p>Belanja ke pasar atau supermarket <strong>satu kali seminggu</strong>
      dengan daftar yang ditulis sebelum berangkat. Belanja harian tanpa daftar
      menaikkan pengeluaran belanja sekitar 15–20% karena jajan impulsif.</p>
      <p>Keluarga Hartono belanja Rp 2,87 juta di November dengan empat kali
      belanja mingguan — di bawah anggaran belanja Rp 3,5 juta.</p>
    </article>
    <article class="card">
      <h2>6 · Evaluasi tiap akhir bulan</h2>
      <p>Di akhir bulan, bandingkan tiga angka: pemasukan, pengeluaran, dan
      sisa anggaran per kategori. Kategori yang selalu jebol dua bulan
      berturut-turut bukan soal disiplin — anggarannya yang terlalu kecil.
      Naikkan anggarannya, lalu potong kategori lain.</p>
      <p>Halaman <a href="#/laporan">Laporan</a> di situs ini menyusun
      perbandingan itu otomatis untuk enam bulan terakhir.</p>
    </article>
  </section>`;
}

// ---------------- Dispatcher + events ----------------

export function renderPage(path, state) {
  if (path === '/transaksi') return renderTransactions(state);
  if (path === '/anggaran') return renderBudgets(state);
  if (path === '/tujuan') return renderGoals(state);
  if (path === '/laporan') return renderReport(state);
  if (path === '/panduan') return renderGuide();
  return renderDashboard(state);
}

function shiftMonth(delta) {
  const order = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];
  const i = order.indexOf(viewMonth);
  const next = order[Math.min(order.length - 1, Math.max(0, i + delta))];
  viewMonth = next;
}

function refreshCategoryOptions(form) {
  const kind = form.querySelector('#tx-kind').value;
  const select = form.querySelector('#tx-category');
  const cats = kind === 'income' ? INCOME_CATEGORIES : CATEGORIES;
  select.innerHTML = cats.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');
}

function calcResults(income) {
  const need = Math.round(income * 0.5);
  const want = Math.round(income * 0.3);
  const save = income - need - want;
  return `<div class="calc-row"><span>Kebutuhan (50%)</span><strong>${formatRupiah(need)}</strong></div>
    <div class="calc-row"><span>Keinginan (30%)</span><strong>${formatRupiah(want)}</strong></div>
    <div class="calc-row"><span>Tabungan (20%)</span><strong>${formatRupiah(save)}</strong></div>
    <p class="muted small">Contoh kebutuhan: belanja, listrik, air, transport, SPP.
    Contoh keinginan: hiburan dan makan di luar.</p>`;
}

export function attachHandlers(root, path, state, ctx) {
  // Dasbor: geser bulan.
  root.querySelectorAll('[data-action="month-prev"]').forEach((b) => b.addEventListener('click', () => { shiftMonth(-1); ctx.rerender(); }));
  root.querySelectorAll('[data-action="month-next"]').forEach((b) => b.addEventListener('click', () => { shiftMonth(1); ctx.rerender(); }));

  // Transaksi: ubah / hapus / batal edit.
  root.querySelectorAll('[data-action="edit-tx"]').forEach((b) => b.addEventListener('click', () => {
    editingId = b.getAttribute('data-id');
    ctx.rerender();
    const form = document.getElementById('tx-form');
    if (form) form.scrollIntoView({ block: 'start' });
  }));
  root.querySelectorAll('[data-action="delete-tx"]').forEach((b) => b.addEventListener('click', () => {
    const id = b.getAttribute('data-id');
    const t = state.transactions.find((x) => x.id === id);
    if (t && window.confirm(`Hapus transaksi "${t.note}" (${formatRupiah(t.amount)})?`)) {
      state.transactions = state.transactions.filter((x) => x.id !== id);
      if (editingId === id) editingId = null;
      ctx.save();
    }
  }));
  root.querySelectorAll('[data-action="cancel-edit"]').forEach((b) => b.addEventListener('click', () => {
    editingId = null;
    ctx.rerender();
  }));

  // Transaksi: form tambah / ubah.
  const txForm = root.querySelector('#tx-form');
  if (txForm) {
    txForm.querySelector('#tx-kind').addEventListener('change', () => refreshCategoryOptions(txForm));
    txForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const data = new FormData(txForm);
      const amount = Math.round(Number(data.get('amount')));
      if (!amount || amount <= 0) return;
      const record = {
        date: String(data.get('date')),
        kind: String(data.get('kind')),
        category: String(data.get('category')),
        note: String(data.get('note')).trim(),
        amount,
      };
      if (editingId) {
        const t = state.transactions.find((x) => x.id === editingId);
        if (t) Object.assign(t, record);
        editingId = null;
      } else {
        state.transactions.push({ id: `t${Date.now().toString(36)}`, ...record });
      }
      ctx.save();
    });
  }

  // Transaksi: filter.
  const search = root.querySelector('#tx-search');
  if (search) search.addEventListener('input', () => { txFilter.q = search.value; ctx.rerenderKeepFocus('tx-search', search.selectionStart); });
  const kindFilter = root.querySelector('#tx-kind-filter');
  if (kindFilter) kindFilter.addEventListener('change', () => { txFilter.kind = kindFilter.value; ctx.rerender(); });
  const catFilter = root.querySelector('#tx-cat-filter');
  if (catFilter) catFilter.addEventListener('change', () => { txFilter.category = catFilter.value; ctx.rerender(); });

  // Anggaran: ubah nominal.
  root.querySelectorAll('.budget-form').forEach((form) => form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const cat = form.getAttribute('data-cat');
    const value = Math.round(Number(new FormData(form).get('budget')));
    if (Number.isFinite(value) && value >= 0) {
      state.budgets[cat] = value;
      ctx.save();
    }
  }));

  // Tujuan: tambah dana, hapus tujuan, buat tujuan baru.
  root.querySelectorAll('.goal-form').forEach((form) => form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const goal = state.goals.find((g) => g.id === form.getAttribute('data-goal'));
    const amount = Math.round(Number(new FormData(form).get('amount')));
    if (goal && amount > 0) {
      goal.saved += amount;
      ctx.save();
    }
  }));
  root.querySelectorAll('[data-action="delete-goal"]').forEach((b) => b.addEventListener('click', () => {
    const g = state.goals.find((x) => x.id === b.getAttribute('data-id'));
    if (g && window.confirm(`Hapus tujuan "${g.name}"?`)) {
      state.goals = state.goals.filter((x) => x.id !== g.id);
      ctx.save();
    }
  }));
  const goalForm = root.querySelector('#goal-new-form');
  if (goalForm) goalForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const data = new FormData(goalForm);
    const target = Math.round(Number(data.get('target')));
    const saved = Math.round(Number(data.get('saved')) || 0);
    const name = String(data.get('name')).trim();
    if (name && target > 0 && saved >= 0) {
      state.goals.push({ id: `g${Date.now().toString(36)}`, name, target, saved, note: 'Tujuan baru keluarga.' });
      ctx.save();
    }
  });

  // Panduan: kalkulator 50/30/20.
  const calcInput = root.querySelector('#calc-income');
  const calcOut = root.querySelector('#calc-results');
  if (calcInput && calcOut) {
    const update = () => { calcOut.innerHTML = calcResults(Math.round(Number(calcInput.value)) || 0); };
    calcInput.addEventListener('input', update);
    update();
  }
}
