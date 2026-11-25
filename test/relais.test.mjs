// Fiche relais : rappels tirés des fiches, texte du QR code, effacement après 24 heures.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

globalThis.window = globalThis;
for (const f of ['fiches.js', 'relais.js']) (0, eval)(readFileSync(new URL('../app/' + f, import.meta.url), 'utf8'));
const qrcode = createRequire(import.meta.url)('../app/lib/qrcode.js');
const R = RELAIS;
const n = (s) => s.replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();

test('« Avez-vous pensé à » : chaque rappel est un extrait exact de la fiche citée', () => {
  for (const r of R.RAPPEL) {
    const f = FICHES.find((x) => x.id === r.fiche);
    assert.ok(f, r.fiche);
    assert.ok(f.blocks.some((b) => n(b.t).includes(n(r.t))), `${r.fiche} : ${r.t}`);
  }
});

test('chaque geste et chaque constat renvoient à une fiche existante', () => {
  for (const [, , f] of R.GESTES) assert.ok(FICHES.some((x) => x.id === f), f);
  for (const c of R.CONSTAT) assert.ok(FICHES.some((x) => x.id === c.fiche), c.fiche);
});

const t0 = new Date(2026, 10, 25, 14, 2).getTime();
const exemple = () => {
  const d = R.nouvelle(t0);
  d.alerte = { heure: '14:03', numero: '15', nature: 'accident', victimes: '1', lieu: '3 rue des Lilas' };
  d.victime = { nom: 'Martin', prenom: 'Léa', age: '', morpho: 'adulte', sexe: 'femme' };
  d.constat = { repond: 'non', respire: 'oui', saigne: 'oui', etouffe: 'non' };
  d.zones = ['jambe-d'];
  d.gestes = { compression: '14:01', garrot: '14:05' };
  R.noter(d, 'constater l’hémorragie, si nécessaire en écartant les vêtements ;', t0);
  R.noter(d, 'constater l’hémorragie, si nécessaire en écartant les vêtements ;', t0 + 1000); // doublon ignoré
  return d;
};

test('le texte de la fiche reprend les rubriques remplies et signale qu’elle n’est pas vérifiée', () => {
  const t = R.texte(exemple());
  for (const attendu of ['non vérifiées', 'Créée le 25/11/2026 à 14:02', 'numéro : 15', 'MARTIN Léa', 'âge : adulte', 'sexe : femme', 'répond ou réagit : non', 'jambe droite', 'garrot 14:05', '14:02 constater l’hémorragie']) assert.ok(t.includes(attendu), attendu);
  assert.ok(!t.includes('MALAISE'), 'rubrique vide omise');
  assert.equal(t.match(/constater l’hémorragie/g).length, 1);
});

test('le texte tient dans un QR code lisible (UTF-8)', () => {
  qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  const q = qrcode(0, 'M'); q.addData(R.texte(exemple()), 'Byte'); q.make();
  assert.ok(q.getModuleCount() > 20);
});

test('la fiche est périmée 24 heures après sa création', () => {
  const d = R.nouvelle(t0);
  assert.equal(R.perimee(d, t0 + R.DUREE - 1), false);
  assert.equal(R.perimee(d, t0 + R.DUREE), true);
  assert.equal(R.perimee(null, t0), true);
});

test('une fiche d’entraînement est marquée « EXERCICE » en tête du texte', () => {
  const d = R.nouvelle(t0); d.essai = true;
  assert.match(R.texte(d).split('\n')[0], /^EXERCICE/);
  assert.ok(!R.texte(R.nouvelle(t0)).includes('EXERCICE'));
});

test('le lien du QR code restitue exactement la fiche, accents compris, et tient dans un QR code', async () => {
  const texte = R.texte(exemple());
  const code = await R.encoder(texte);
  assert.match(code, /^1\.[A-Za-z0-9_-]+$/);
  assert.equal(await R.decoder(code), texte);
  const lien = 'https://alexandremarce3-lgtm.github.io/aegis/app/recu.html#' + code;
  qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  const q = qrcode(0, 'M'); q.addData(lien, 'Byte'); q.make();
  assert.ok(q.getModuleCount() <= 177);
  await assert.rejects(R.decoder('9.abc'));
});

test('la page de lecture n’injecte jamais le contenu du lien comme du HTML', () => {
  const page = readFileSync(new URL('../app/recu.html', import.meta.url), 'utf8');
  assert.ok(!/innerHTML|outerHTML|insertAdjacentHTML|document\.write/.test(page));
});
