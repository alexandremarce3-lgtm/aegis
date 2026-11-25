// Mode moins de 10 ans : chaque phrase est un extrait exact d'une fiche RTN.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chargerFiches } from '../outils/construire-donnees.mjs';

const FICHES = chargerFiches();
(0, eval)(readFileSync(new URL('../app/jeune.js', import.meta.url), 'utf8'));
const J = globalThis.JEUNE;
const n = (s) => s.replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();

test('chaque phrase du mode moins de 10 ans vient mot pour mot de la fiche citée', () => {
  for (const e of [J.aide, ...J.alerter, ...Object.values(J.gestes).flat()]) {
    const f = FICHES.find((x) => x.id === e.fiche);
    assert.ok(f, 'fiche inconnue : ' + e.fiche);
    assert.ok(f.blocks.some((b) => [b.t, ...(b.n || [])].some((t) => n(t).includes(n(e.t)))), `absent de ${e.fiche} : ${e.t}`);
  }
});

test('les numéros proposés sont ceux de la fiche Alerte', () => {
  const alerte = n(FICHES.find((x) => x.id === 'alerte').blocks.map((b) => b.t).join(' '));
  for (const [num] of J.numeros) assert.ok(alerte.includes(`le ${num},`), num);
});
