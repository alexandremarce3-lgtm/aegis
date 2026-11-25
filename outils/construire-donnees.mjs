// Construit la base de connaissances data/ à partir des fiches officielles (app/fiches.js).
// Aucun texte n'est rédigé ici : chaque texte de data/ est repris tel quel des RTN PSC.
// Les ajouts d'un formateur (erreurs fréquentes, critère d'efficacité) vont dans data/complements/<id>.json
// et sont fusionnés à la construction.
// Usage : node outils/construire-donnees.mjs        (écrit data/)
//         node outils/construire-donnees.mjs --verifier  (échoue si data/ n'est pas à jour)
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(RACINE, 'data');

export const SOURCE = {
  document: 'Références techniques nationales « Premiers Secours Citoyen » (RTN PSC)',
  editeur: 'DGSCGC, ministère de l’Intérieur',
  edition: 'juillet 2026',
};
export const STATUT = 'à valider par un formateur';
const A_COMPLETER = 'à compléter par un formateur - non fourni par les RTN';

// Fiches « conduite à tenir » hors procédures (PR) : apports de connaissances qui décrivent une conduite.
const CONDUITES_AC = ['protection', 'alerte'];

// Titres de section des RTN -> clé dans data/.
const CLES_PR = {
  'Définition': 'definition', 'Définition - Signes': 'definition_signes', 'Signes': 'signes', 'Causes': 'causes',
  'Risques': 'risques', 'Principe d’action': 'principes_action', 'Principes d’action': 'principes_action',
  'Conduite à tenir': 'etapes', 'Conduite à tenir en toute circonstance': 'etapes',
  'Cas particuliers': 'cas_particuliers', 'Cas particulier': 'cas_particuliers',
  'Conduite à tenir particulière': 'cas_particuliers', 'Conduites à tenir particulières': 'cas_particuliers',
  'Présentation': 'presentation',
};
const CLES_FT = {
  'Indication': 'quand', 'Justification': 'pourquoi', 'Matériel': 'materiel', 'Réalisation': 'comment',
  'Risques et contraintes': 'risques', 'Points clés': 'points_cles',
};

const TYPE_BLOC = { p: 'paragraphe', li: 'puce', h3: 'cas', def: 'definition' };
const bloc = (b) => {
  const o = { type: TYPE_BLOC[b.k], texte: b.t };
  if (b.k === 'li') o.niveau = b.l;
  if (b.d) o.definition = b.d;
  if (b.n) o.notes = b.n;
  return o;
};

function sections(f, cles) {
  const out = {}, ordre = [];
  let cle = 'introduction', titre = null;
  for (const b of f.blocks) {
    if (b.k === 'h2') {
      titre = b.t;
      cle = cles[b.t];
      if (!cle) throw new Error(`Section inconnue « ${b.t} » dans ${f.id}`);
      if (!ordre.some((s) => s.cle === cle)) ordre.push({ cle, titre_rtn: b.t });
      continue;
    }
    (out[cle] ||= []).push(bloc(b));
    if (cle === 'introduction' && !ordre.some((s) => s.cle === cle)) ordre.unshift({ cle, titre_rtn: titre });
  }
  return { out, ordre };
}

const source = (f) => ({ ...SOURCE, fiche: f.code, titre_fiche: f.title, mise_a_jour: f.maj });

function complements(id) {
  const p = join(DATA, 'complements', id + '.json');
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {};
}
const ajout = (c, cle) => (c[cle] && c[cle].length ? { statut: STATUT, auteur: c.auteur || null, contenu: c[cle] } : { statut: A_COMPLETER, contenu: [] });

export function construire(FICHES) {
  // Gestes liés à chaque procédure : les fiches techniques qui la suivent dans les RTN.
  const lies = {};
  let pr = null;
  for (const f of FICHES) {
    if (f.type === 'PR') { pr = f.id; lies[pr] = []; }
    else if (pr && f.type === 'FT') lies[pr].push(f.id);
  }
  const conduites = [], gestes = [];
  for (const f of FICHES) {
    if (f.type === 'PR' || CONDUITES_AC.includes(f.id)) {
      const { out, ordre } = sections(f, CLES_PR);
      const c = complements(f.id);
      conduites.push({
        id: f.id, titre: f.title, type: f.type === 'PR' ? 'procédure' : 'apport de connaissances',
        source: source(f), statut: STATUT,
        sections_rtn: ordre,
        situation: out.definition || out.definition_signes || out.presentation || out.introduction || [],
        signes: out.signes || out.definition_signes || [],
        causes: out.causes || [],
        risques: out.risques || [],
        principes_action: out.principes_action || [],
        // Sans section « Conduite à tenir » (Brûlures), les étapes sont celles des « Principes d’action ».
        etapes: out.etapes || out.principes_action || [],
        ...(out.etapes ? {} : { remarque_etapes: out.principes_action ? 'Les RTN décrivent la conduite à tenir dans la section « Principes d’action » : etapes reprend cette section.' : 'Conduite décrite dans le texte de la fiche (situation), sans section « Conduite à tenir ».' }),
        cas_particuliers: out.cas_particuliers || [],
        ...(out.introduction && out.definition ? { introduction: out.introduction } : {}),
        gestes: lies[f.id] || [],
        points_cles: ajout(c, 'points_cles'),
        erreurs_frequentes: ajout(c, 'erreurs_frequentes'),
        critere_efficacite: ajout(c, 'critere_efficacite'),
      });
    } else if (f.type === 'FT') {
      const { out, ordre } = sections(f, CLES_FT);
      const c = complements(f.id);
      gestes.push({
        id: f.id, titre: f.title, source: source(f), statut: STATUT,
        sections_rtn: ordre,
        quand: out.quand || [],
        comment: out.comment || [],
        pourquoi: out.pourquoi || [],
        materiel: out.materiel || [],
        risques: out.risques || [],
        ...(out.risques ? {} : { remarque_risques: 'Pas de section « Risques » dans cette fiche RTN.' }),
        points_cles: out.points_cles || [],
        conduites: Object.keys(lies).filter((k) => lies[k].includes(f.id)),
        erreurs_frequentes: ajout(c, 'erreurs_frequentes'),
        critere_efficacite: ajout(c, 'critere_efficacite'),
      });
    }
  }
  const index = {
    source: SOURCE, statut: STATUT,
    avertissement: 'Textes repris sans modification des RTN PSC. Aegis ne remplace pas une formation. En cas d’urgence : 15, 18 ou 112.',
    conduites: conduites.map((x) => ({ id: x.id, titre: x.titre, fiche: x.source.fiche, mise_a_jour: x.source.mise_a_jour })),
    gestes: gestes.map((x) => ({ id: x.id, titre: x.titre, fiche: x.source.fiche, mise_a_jour: x.source.mise_a_jour })),
  };
  const fichiers = { 'index.json': index };
  for (const x of conduites) fichiers[`conduites/${x.id}.json`] = x;
  for (const x of gestes) fichiers[`gestes/${x.id}.json`] = x;
  return fichiers;
}

export function chargerFiches() {
  globalThis.window = globalThis;
  (0, eval)(readFileSync(join(RACINE, 'app', 'fiches.js'), 'utf8'));
  return globalThis.FICHES;
}

const texte = (o) => JSON.stringify(o, null, 1) + '\n';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const fichiers = construire(chargerFiches());
  if (process.argv.includes('--verifier')) {
    const ko = Object.entries(fichiers).filter(([p, o]) => !existsSync(join(DATA, p)) || readFileSync(join(DATA, p), 'utf8') !== texte(o));
    const enTrop = ['conduites', 'gestes'].flatMap((d) => (existsSync(join(DATA, d)) ? readdirSync(join(DATA, d)).map((x) => `${d}/${x}`) : [])).filter((p) => !fichiers[p]);
    for (const [p] of ko) console.log('PAS À JOUR : data/' + p);
    for (const p of enTrop) console.log('EN TROP : data/' + p);
    console.log(ko.length + enTrop.length ? '\nLancer : node outils/construire-donnees.mjs' : 'Contrôle : data/ est à jour.');
    process.exit(ko.length + enTrop.length ? 1 : 0);
  }
  for (const [p, o] of Object.entries(fichiers)) { mkdirSync(dirname(join(DATA, p)), { recursive: true }); writeFileSync(join(DATA, p), texte(o)); }
  console.log(Object.keys(fichiers).length + ' fichiers écrits dans data/');
}
