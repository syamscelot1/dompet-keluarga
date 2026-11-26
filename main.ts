// DompetKeluarga — program penyerahan entry (Node 22, stdlib saja).
// Situsnya adalah file statis di app/ (HTML, CSS, modul ES, tanpa
// build step) yang dibuka dari app/index.html. Program ini menyalin
// app/ dan screenshots/ dari samping file ini ke /output, lalu menulis
// /output/dossier.json dengan buildDossier dari pustaka make.fun yang
// divendor di vendor/makefun-frontend.ts — file itu jangan diubah,
// karena gate membandingkan dossier dengan yang ditulis pustakanya.
//
// Di luar grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Batas yang dipakai gate (lihat RULES.txt): teks dossier paling banyak
// 160 KiB; paling banyak 4 screenshot @ 256 KiB; app/ paling banyak
// 993 file+direktori dan 16 MiB — semuanya berbagi batas /output
// (1000 entri, 64 MiB) dengan screenshots/ dan dossier.json.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
