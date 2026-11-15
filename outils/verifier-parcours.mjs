// Vérifie que chaque étape du mode pas à pas correspond bien à une phrase des fiches officielles.
// Usage : node outils/verifier-parcours.mjs
import { readFileSync } from 'node:fs';
globalThis.window = globalThis;
for (const f of ['app/fiches.js', 'app/parcours.js']) (0, eval)(readFileSync(f, 'utf8'));
const { parcours, erreurs } = window.compilerParcours(window.FICHES);
const court = (s) => (s.length > 78 ? s.slice(0, 75) + '…' : s);
const voir = (etapes, r) => { for (const e of etapes) {
  if (e.type === 'a') console.log(r + '• ' + court(e.blocs[0].t) + (e.blocs.length > 1 ? ` (+${e.blocs.length - 1})` : '') + (e.gestes.length ? '  [gestes : ' + e.gestes.map((g) => g.titre + ' ' + g.onglets.map((o) => o.blocs.length).join('/')).join(', ') + ']' : '') + (e.lien ? '  -> ' + e.lien : ''));
  else if (e.type === 'groupe') { console.log(r + '┌ groupe'); voir(e.items, r + '│ '); }
  else for (const o of e.options) { console.log(r + '? ' + court(o.t) + (o.lien ? '  -> ' + o.lien : '')); voir(o.etapes, r + '    '); }
} };
for (const [id, p] of Object.entries(parcours)) { if (id === 'inconscient') continue; console.log('\n## ' + id); voir(p.etapes, '  '); }
console.log(erreurs.length ? '\nERREURS :\n' + erreurs.join('\n') : '\nContrôle : toutes les étapes correspondent à une phrase officielle.');
process.exit(erreurs.length ? 1 : 0);
