// Extrait les fiches du texte officiel (pdftotext -layout -enc UTF-8) sans rien réécrire.
// Usage : node outils/extraire-fiches.mjs sources/PSC_juillet-2026.txt app/fiches.js
import { readFileSync, writeFileSync } from 'node:fs';

const [, , src, out] = process.argv;
const pages = readFileSync(src, 'utf8').split('\f');

const H2 = /^(Définition( - Signes)?|Signes|Causes|Risques( et contraintes)?|Principes? d[’']action|Conduites? à tenir.*|Cas particuliers?|Indication|Justification|Matériel|Réalisation|Points clés|Présentation|Composition|Localisation|Principe d[’']organisation|Abréviations|Morphologie|Messages clés)$/;
const HEADER = /(?:\[(\d\d[A-Z]{2}\d\d) \/\s*)?(\d\d-\d{4})\] PSC\s*$/;
const MARK = /(?<=[a-zàâéèêëîïôöùûüç»”’)]|\bX|PLS)([1-9])(?=$|[\s;,:.)])/g;
const letters = (s) => s.replace(/[^\p{L}]/gu, '').length;

const fiches = [];
let cur = null;      // fiche en cours
let last = null;     // dernier bloc (pour les lignes de continuation)
let blankSince = false;
const report = [];

function push(b) { cur.blocks.push(b); last = b; }

for (const page of pages) {
  let lines = page.split('\n').map((l) => l.replace(/\s+$/, ''));
  // numéro de page
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  if (lines.length && /^\s*\d+$/.test(lines[lines.length - 1])) lines.pop();
  const first = lines.find((l) => l.trim());
  if (!first) continue;
  if (/^Chapitre \d\d/.test(first.trim())) { cur = null; if (/03/.test(first)) break; continue; }

  // début de fiche ?
  const hi = lines.findIndex((l) => l.trim());
  const hm = lines[hi].match(HEADER);
  let i = 0;
  if (hm) {
    i = hi + 1;
    const title = [];
    for (; i < lines.length; i++) {
      const l = lines[i];
      if (!l.trim()) continue;
      if (/^\S/.test(l)) break;
      title.push(l.trim());
    }
    cur = { code: hm[1] || null, maj: hm[2], title: title.join(' '), blocks: [], srcLetters: 0 };
    cur.srcLetters += letters(cur.title);
    fiches.push(cur);
    last = null;
  }
  if (!cur) continue;
  lines = lines.slice(i);
  cur.srcLetters += letters(lines.join(''));

  // notes de bas de page
  const notes = {};
  let fi = -1;
  for (let k = lines.length - 1; k >= 0; k--) if (/^1 ?(?!er)\S/.test(lines[k])) { fi = k; break; }
  if (fi >= 0) {
    let n = 0;
    for (const l of lines.slice(fi)) {
      const m = l.match(/^(\d) ?(\S.*)$/);
      if (m && +m[1] === n + 1) { n++; notes[n] = m[2]; }
      else if (l.trim()) notes[n] += ' ' + l.trim();
    }
    lines = lines.slice(0, fi);
  }

  const inTable = () => {
    for (let k = cur.blocks.length - 1; k >= 0; k--) if (cur.blocks[k].k === 'h2') return /^(Abréviations|Morphologie)$/.test(cur.blocks[k].t);
    return false;
  };

  const seen = new Set();
  const start = cur.blocks.length;
  for (let k = 0; k < lines.length; k++) {
    const raw = lines[k];
    const t = raw.trim();
    if (!t) { blankSince = true; continue; }
    const indent = raw.length - raw.trimStart().length;
    let m;
    if ((m = t.match(/^[•\-]\s*(.*)$/)) && (t[0] === '•' || indent > 0)) {
      if (m[1]) push({ k: 'li', l: 1, t: m[1] });
    } else if (indent > 0 && (m = t.match(/^o\s+(.*)$/))) push({ k: 'li', l: 2, t: m[1] });
    else if ((m = t.match(/^§\s*(.*)$/))) push({ k: 'li', l: 3, t: m[1] });
    else {
      const prevOpen = last && !/[.;:!?]$/.test(last.t);
      if (last && last.k === 'li' && prevOpen && (indent > 0 || /^\p{Ll}/u.test(t))) last.t += ' ' + t;
      else if (last && last.k === 'p' && !blankSince) last.t += ' ' + t;
      else if (inTable() && (m = t.match(/^(\S+)\s+(.+)$/))) push({ k: 'def', t: m[1], d: m[2] });
      else {
        const next = (lines.slice(k + 1).find((x) => x.trim()) || '');
        const alone = blankSince || !last || last.k !== 'p';
        const nextIsCont = lines[k + 1] && lines[k + 1].trim() && /^\S/.test(lines[k + 1]) && !/^[•]/.test(lines[k + 1]);
        const bare = t.replace(MARK, '');
        if (H2.test(bare)) push({ k: 'h2', t });
        else if (alone && !nextIsCont && t.length < 95 && !/[.;,:]$/.test(bare) && !/^https?:/.test(t)) push({ k: 'h3', t });
        else push({ k: 'p', t });
        void next;
      }
    }
    blankSince = false;
  }

  // rattacher les notes aux blocs de cette page
  for (const b of cur.blocks.slice(start).concat(start > 0 ? [cur.blocks[start - 1]] : [])) {
    const used = [];
    b.t = b.t.replace(MARK, (all, d) => { if (notes[d]) { used.push(d); return ''; } return all; });
    for (const d of used) { (b.n ||= []).push(notes[d]); if (!seen.has(d)) { seen.add(d); cur.noteLetters = (cur.noteLetters || 0) + letters(notes[d]); } }
  }
  const lost = Object.entries(notes).filter(([d]) => !seen.has(d));
  if (lost.length) report.push(`NOTE NON RATTACHÉE (${cur.title}) : ${lost.map(([d, v]) => d + ' ' + v.slice(0, 50)).join(' | ')}`);
}

// identifiants et type
const slug = (s) => s.replace(/œ/g, 'oe').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
for (const f of fiches) {
  f.id = slug(f.title);
  f.type = f.code ? f.code.slice(2, 4) : 'AC';
  const outLetters = letters(f.title) + f.blocks.reduce((a, b) => a + (b.k === "li" && b.l === 2 ? 1 : 0) + letters(b.t) + letters(b.d || ''), 0) + (f.noteLetters || 0);
  delete f.noteLetters;
  if (outLetters !== f.srcLetters) report.push(`ÉCART ${f.title} : source ${f.srcLetters} lettres, extrait ${outLetters}`);
  delete f.srcLetters;
}

writeFileSync(out, '// Généré par outils/extraire-fiches.mjs — ne pas modifier à la main.\nwindow.FICHES = ' + JSON.stringify(fiches, null, 1) + ';\n');
console.log(fiches.map((f) => `${f.code || '  --  '} ${f.type} ${f.maj} ${f.title} (${f.blocks.length} blocs)`).join('\n'));
console.log(report.length ? '\n' + report.join('\n') : '\nContrôle : aucune lettre perdue, toutes les notes rattachées.');
