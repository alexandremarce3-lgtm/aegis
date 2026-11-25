// Repères « modifié en 2026 » : chaque bloc marqué existe mot pour mot dans sa fiche.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

globalThis.window = globalThis;
for (const f of ['fiches.js', 'nouveautes.js']) (0, eval)(readFileSync(new URL('../app/' + f, import.meta.url), 'utf8'));

test('chaque passage marqué « modifié en 2026 » est un bloc exact de la fiche', () => {
  for (const [id, blocs] of Object.entries(NOUVEAUTES)) {
    const f = FICHES.find((x) => x.id === id);
    assert.ok(f, 'fiche inconnue ' + id);
    for (const t of blocs) assert.ok(f.blocks.some((b) => b.t === t), `${id} : ${t.slice(0, 60)}`);
  }
});

test('seules des fiches mises à jour en 2026 portent des passages modifiés', () => {
  for (const id of Object.keys(NOUVEAUTES)) assert.equal(FICHES.find((x) => x.id === id).maj, '07-2026', id);
});
