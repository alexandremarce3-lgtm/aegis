// Base de connaissances data/ : à jour, fidèle aux fiches officielles, sourcée.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { construire, chargerFiches, STATUT, SOURCE } from '../outils/construire-donnees.mjs';

const FICHES = chargerFiches();
const lire = (p) => JSON.parse(readFileSync(new URL('../data/' + p, import.meta.url), 'utf8'));
const n = (s) => s.replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
const officiel = new Set(FICHES.flatMap((f) => f.blocks.flatMap((b) => [b.t, b.d, ...(b.n || [])].filter(Boolean).map(n))));

test('data/ correspond exactement à ce que produit le générateur', () => {
  for (const [p, o] of Object.entries(construire(FICHES))) assert.deepEqual(lire(p), o, 'data/' + p + ' pas à jour : node outils/construire-donnees.mjs');
});

const fichesData = () => ['conduites', 'gestes'].flatMap((d) => readdirSync(new URL('../data/' + d, import.meta.url)).map((x) => [d, lire(d + '/' + x)]));

test('chaque fiche porte sa source, sa version et le statut à valider', () => {
  for (const [, x] of fichesData()) {
    assert.equal(x.statut, STATUT, x.id);
    assert.equal(x.source.edition, SOURCE.edition, x.id);
    assert.match(x.source.mise_a_jour, /^\d\d-\d{4}$/, x.id);
    const f = FICHES.find((y) => y.id === x.id);
    assert.ok(f, 'fiche officielle introuvable : ' + x.id);
    assert.equal(x.source.fiche, f.code, x.id);
  }
});

test('aucun texte inventé : chaque texte vient mot pour mot d’une fiche officielle', () => {
  const textes = (v, out = []) => {
    if (Array.isArray(v)) v.forEach((e) => textes(e, out));
    else if (v && typeof v === 'object') {
      if (typeof v.texte === 'string') out.push(v.texte, ...(v.notes || []), ...(v.definition ? [v.definition] : []));
      else for (const [k, e] of Object.entries(v)) if (k !== 'contenu') textes(e, out);
    }
    return out;
  };
  for (const [, x] of fichesData()) for (const t of textes(x)) assert.ok(officiel.has(n(t)), `${x.id} : texte absent des fiches officielles : ${t.slice(0, 80)}`);
});

test('les conduites ont des étapes et les gestes un « quand » et un « comment »', () => {
  for (const [d, x] of fichesData()) {
    if (d === 'gestes') { assert.ok(x.quand.length && x.comment.length && x.pourquoi.length, x.id); continue; }
    if (x.id !== 'protection') assert.ok(x.etapes.length, x.id);
  }
});

test('les compléments non fournis par les RTN sont signalés, jamais remplis par défaut', () => {
  for (const [, x] of fichesData()) for (const k of ['erreurs_frequentes', 'critere_efficacite']) {
    assert.ok(x[k].contenu.length === 0 ? /à compléter/.test(x[k].statut) : x[k].statut === STATUT, x.id + ' ' + k);
  }
});
