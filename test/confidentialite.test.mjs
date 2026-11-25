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
  for (const p of textes) assert.ok(!lire(p).includes('—'), 'tiret long dans ' + p);
});

test('l’appli affiche les numéros d’urgence et le rappel « ne remplace pas une formation »', () => {
  const html = lire('app/index.html'), app = lire('app/app.js');
  for (const n of ['tel:15', 'tel:18', 'tel:112']) assert.ok(html.includes(n), n);
  assert.match(app, /ne remplace ni une formation/);
});
