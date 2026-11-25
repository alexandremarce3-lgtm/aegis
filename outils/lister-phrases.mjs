// Dresse la liste des phrases que l'appli peut lire à voix haute (pas à pas, gestes, mode jeune).
// Usage : node outils/lister-phrases.mjs > sources/voix/phrases.json
import { readFileSync } from 'node:fs';
globalThis.window = globalThis;
for (const f of ['app/fiches.js', 'app/jeune.js', 'app/parcours.js', 'app/oreille.js']) (0, eval)(readFileSync(f, 'utf8'));
const { parcours, erreurs } = window.compilerParcours(window.FICHES);
if (erreurs.length) { console.error(erreurs.join('\n')); process.exit(1); }
const phrases = new Map();
const ajouter = (t) => { if (t && t.trim()) phrases.set(window.idVoix(t), window.pourOreille(t)); };
const blocs = (l) => l.forEach((b) => { if (b.k !== 'h2') ajouter(b.t); });
const voir = (etapes) => { for (const e of etapes) {
  if (e.type === 'a') { blocs(e.blocs); e.info.forEach(blocs); e.gestes.forEach((g) => g.onglets.forEach((o) => { ajouter(o.t); blocs(o.blocs); })); }
  else if (e.type === 'groupe') voir(e.items);
  else { e.info.forEach(blocs); for (const o of e.options) { ajouter(o.t); voir(o.etapes); } }
} };
for (const p of Object.values(parcours)) voir(p.etapes);
[window.JEUNE.aide, ...window.JEUNE.alerter, ...Object.values(window.JEUNE.gestes).flat()].map(window.JEUNE.texte).forEach(ajouter);
console.log(JSON.stringify([...phrases].map(([id, texte]) => ({ id, texte })), null, 0));
console.error(phrases.size + ' phrases');
