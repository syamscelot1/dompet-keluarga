// Chart SVG buatan sendiri — tanpa library, tanpa gambar luar.
// Donat untuk rincian kategori, batang berkelompok untuk
// perbandingan pemasukan vs pengeluaran per bulan.

import { formatRupiahShort } from './format.js';

// Donat: slices = [{ label, value, color }]. Mengembalikan string SVG.
export function donutChart(slices, size = 220) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const stroke = 34;
  const circumference = 2 * Math.PI * r;
  if (total <= 0) {
    return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Tidak ada pengeluaran" class="chart donut">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e7e0d2" stroke-width="${stroke}"/>
      <text x="${cx}" y="${cy}" text-anchor="middle" class="donut-center">Rp 0</text></svg>`;
  }
  let offset = 0;
  const parts = slices.filter((x) => x.value > 0).map((x) => {
    const frac = x.value / total;
    const dash = frac * circumference;
    const gap = frac >= 0.999 ? 0 : 2.5;
    const el = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${x.color}" stroke-width="${stroke}"
      stroke-dasharray="${Math.max(dash - gap, 0.5)} ${circumference - dash + gap}"
      stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"><title>${x.label}: ${x.value.toLocaleString('id-ID')}</title></circle>`;
    offset += dash;
    return el;
  }).join('\n      ');
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Rincian pengeluaran per kategori" class="chart donut">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#efe9db" stroke-width="${stroke}"/>
      ${parts}
      <text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-center">Total</text>
      <text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-total">${formatRupiahShort(total)}</text>
    </svg>`;
}

// Batang berkelompok: rows = [{ label, income, expense }].
// Pemasukan hijau, pengeluaran merah bata.
export function monthBarChart(rows, width = 640, height = 260) {
  const padL = 8;
  const padB = 26;
  const padT = 14;
  const max = Math.max(1, ...rows.flatMap((r) => [r.income, r.expense]));
  const plotH = height - padT - padB;
  const slot = (width - padL * 2) / rows.length;
  const barW = Math.min(30, (slot - 22) / 2);
  const bars = rows.map((r, i) => {
    const x0 = padL + i * slot + (slot - barW * 2 - 6) / 2;
    const hIn = (r.income / max) * plotH;
    const hEx = (r.expense / max) * plotH;
    const yBase = padT + plotH;
    return `<g>
      <rect x="${x0.toFixed(1)}" y="${(yBase - hIn).toFixed(1)}" width="${barW}" height="${hIn.toFixed(1)}" rx="3" fill="#2e7d5b"><title>${r.label} pemasukan ${r.income.toLocaleString('id-ID')}</title></rect>
      <rect x="${(x0 + barW + 6).toFixed(1)}" y="${(yBase - hEx).toFixed(1)}" width="${barW}" height="${hEx.toFixed(1)}" rx="3" fill="#c94f5e"><title>${r.label} pengeluaran ${r.expense.toLocaleString('id-ID')}</title></rect>
      <text x="${(padL + i * slot + slot / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" class="bar-label">${r.label}</text>
    </g>`;
  }).join('\n      ');
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padT + plotH * (1 - f);
    return `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${width - padL}" y2="${y.toFixed(1)}" class="bar-grid"/>`;
  }).join('\n      ');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Pemasukan dan pengeluaran enam bulan terakhir" class="chart bars">
      ${grid}
      ${bars}
      <line x1="${padL}" y1="${padT + plotH}" x2="${width - padL}" y2="${padT + plotH}" class="bar-axis"/>
    </svg>`;
}

// Batang horizontal satu kategori: dipakai di Laporan dan Anggaran.
export function horizontalBar(value, max, color) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return `<div class="hbar"><div class="hbar-fill" style="width:${pct.toFixed(1)}%;background:${color}"></div></div>`;
}

// Progress bar dengan warna yang berubah saat melewati anggaran.
export function progressBar(ratio) {
  const pct = Math.min(100, Math.max(0, ratio * 100));
  const cls = ratio > 1 ? 'over' : ratio > 0.85 ? 'warn' : 'ok';
  return `<div class="pbar ${cls}"><div class="pbar-fill" style="width:${pct.toFixed(1)}%"></div></div>`;
}
