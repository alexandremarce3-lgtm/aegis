// Logigramme de bilan : ordre des fiches RTN et liens valides.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

globalThis.window = globalThis;
for (const f of ['fiches.js', 'situations.js', 'parcours.js', 'bilan.js']) (0, eval)(readFileSync(new URL('../app/' + f, import.meta.url), 'utf8'));
const ids = new Set(FICHES.map((f) => f.id));
const liens = BILAN.flatMap((e) => (e.choix || [e.oui, e.non]).filter((r) => r.lien).map((r) => r.lien));

test('chaque lien du bilan mène à une fiche ou à une situation existante', () => {
  for (const l of liens) {
    const [, page, id] = l.split('/');
    if (page === 'fiche') assert.ok(ids.has(id), l);
    else if (page === 's') assert.ok(SITUATIONS.some((s) => s.id === id), l);
    else assert.fail('lien inattendu ' + l);
  }
  for (const e of BILAN) for (const r of e.ref) assert.ok(ids.has(r), r);
});

test('les procédures apparaissent dans l’ordre des RTN (ce qui tue en premier)', () => {
  const ordrePR = FICHES.filter((f) => f.type === 'PR').map((f) => f.id);
  const vues = BILAN.flatMap((e) => e.ref).filter((id) => ordrePR.includes(id)).map((id) => ordrePR.indexOf(id));
  // Le bilan cite les procédures dans l'ordre (perte de connaissance et arrêt cardiaque sont traités ensemble).
  const premiers = [...new Set(vues)];
  assert.deepEqual(premiers.slice(0, 2), [0, 1]);
  assert.deepEqual(premiers.slice(-4), [4, 5, 6, 7]);
});
