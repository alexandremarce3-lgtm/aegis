// Pages légales : présentes, cohérentes avec ce que fait l'appli.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

globalThis.window = globalThis;
(0, eval)(readFileSync(new URL('../app/legal.js', import.meta.url), 'utf8'));
const P = PAGES_LEGALES;
const lire = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');

test('les pages attendues existent', () => {
  for (const k of ['mentions', 'confidentialite', 'cgu', 'accessibilite', 'licences']) assert.ok(P[k] && P[k].html.length > 200, k);
});

test('les conditions rappellent les numéros d’urgence et que l’appli ne remplace pas une formation', () => {
  assert.match(P.cgu.html, /15, le 18 ou le 112/);
  assert.match(P.cgu.html, /ne remplace ni cette formation/);
});

test('la politique de confidentialité décrit la fiche relais et son effacement après 24 heures', () => {
  assert.match(P.confidentialite.html, /Fiche relais/);
  assert.match(P.confidentialite.html, /24 heures/);
  assert.match(lire('app/relais.js'), /24 \* 3600 \* 1000/);
});

test('chaque service extérieur contacté par l’appli est cité dans la politique', () => {
  const code = ['app/app.js', 'app/index.html'].map(lire).join('\n');
  const cites = { 'tabular-api.data.gouv.fr': 'data.gouv.fr', 'tile.openstreetmap.org': 'OpenStreetMap', 'unpkg.com': 'unpkg.com', 'www.google.com/maps': 'Google Maps' };
  for (const [hote, nom] of Object.entries(cites)) if (code.includes(hote)) assert.ok(P.confidentialite.html.includes(nom), nom);
});

test('la page de présentation ne dépend plus d’un service extérieur pour son QR code', () => {
  assert.ok(!lire('index.html').includes('api.qrserver.com'));
});
