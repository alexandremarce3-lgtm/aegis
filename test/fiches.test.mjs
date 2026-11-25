// Contrôles existants : pas à pas et questions tirés des fiches officielles.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const lancer = (script) => execFileSync(process.execPath, [script], { cwd: new URL('..', import.meta.url), encoding: 'utf8' });
test('chaque étape du mode pas à pas est une phrase officielle', () => assert.match(lancer('outils/verifier-parcours.mjs'), /toutes les étapes correspondent/));
test('chaque bonne réponse du quiz est un extrait exact d’une fiche', () => assert.match(lancer('outils/verifier-questions.mjs'), /bonnes réponses sont des extraits exacts/));
