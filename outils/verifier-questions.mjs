// Vérifie que la bonne réponse de chaque question est un extrait exact de la fiche officielle citée.
// Usage : node outils/verifier-questions.mjs
import { readFileSync } from 'node:fs';
globalThis.window = globalThis;
for (const f of ['app/fiches.js', 'app/questions.js']) (0, eval)(readFileSync(f, 'utf8'));
const n = (s) => s.replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
let ko = 0; const parTheme = {};
for (const x of window.QUESTIONS) {
  parTheme[x.theme] = (parTheme[x.theme] || 0) + 1;
  const f = window.FICHES.find((y) => y.id === x.fiche);
  const texte = f ? n(f.blocks.map((b) => [b.t, b.d || '', ...(b.n || [])].join(' ')).join(' ')) : '';
  if (!f) { ko++; console.log('FICHE INCONNUE : ' + x.fiche); }
  else if (!texte.includes(n(x.bon))) { ko++; console.log(`ABSENT de « ${f.title} » : ${x.bon}`); }
  if (x.faux.length !== 3) { ko++; console.log('Il faut 3 mauvaises réponses : ' + x.q); }
  if (/[;:.]\s*$/.test(x.bon) || x.faux.some((r) => /[;:.]\s*$/.test(r))) { ko++; console.log('Ponctuation finale à retirer : ' + x.q); }
}
console.log(Object.entries(parTheme).map(([k, v]) => `${k} ${v}`).join(' · '));
console.log(ko ? `\n${ko} problème(s).` : `\nContrôle : les ${window.QUESTIONS.length} bonnes réponses sont des extraits exacts des fiches.`);
process.exit(ko ? 1 : 0);
