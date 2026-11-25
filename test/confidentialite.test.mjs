// Règles de confidentialité et de présentation du projet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const racine = new URL('..', import.meta.url);
const suivis = execFileSync('git', ['ls-files'], { cwd: racine, encoding: 'utf8' }).split('\n').filter(Boolean);
const textes = suivis.filter((p) => /\.(js|mjs|html|css|json|md|webmanifest)$/.test(p));
const lire = (p) => readFileSync(new URL(p, racine), 'utf8');

test('les dossiers privés sont ignorés par Git et aucun de leurs fichiers n’est suivi', () => {
  const gi = lire('.gitignore');
  for (const d of ['sources-privees/', 'contenu-interne/']) {
    assert.match(gi, new RegExp('^' + d + '$', 'm'), d + ' absent du .gitignore');
    assert.ok(!suivis.some((p) => p.startsWith(d)), 'fichier suivi dans ' + d);
  }
});

test('aucun contenu SauveTaGe (Gendarmerie) dans les fichiers publics', () => {
  const interdit = /sauvetage|safe\s*marche|marche\s*ryan|start\s*abc|fmpi/i;
  for (const p of textes) if (!p.startsWith('test/')) assert.ok(!interdit.test(lire(p)), 'terme interne trouvé dans ' + p);
});

test('aucun tiret long dans les textes', () => {
  for (const p of textes) assert.ok(!lire(p).includes(String.fromCharCode(0x2014)), 'tiret long dans ' + p);
});

test('l’appli affiche les numéros d’urgence et le rappel « ne remplace pas une formation »', () => {
  const html = lire('app/index.html'), app = lire('app/app.js');
  for (const n of ['tel:15', 'tel:18', 'tel:112']) assert.ok(html.includes(n), n);
  assert.match(html.replace(/<[^>]+>/g, ''), /Appelez le 15, le 18 ou le 112 - Aegis ne remplace pas une formation/);
  assert.match(app, /ne remplace ni une formation/);
});

test('chaque fichier chargé par l’appli porte le numéro de version du cache (mise à jour d’un seul bloc)', () => {
  const html = lire('app/index.html'), v = lire('app/sw.js').match(/aegis-v(\d+)/)[1];
  const refs = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css)[^"]*)"/g)].map((m) => m[1]);
  assert.ok(refs.length > 10);
  for (const r of refs) assert.ok(r.endsWith('?v=' + v), r + ' devrait finir par ?v=' + v);
});
