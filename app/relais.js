/* Fiche relais : le témoin note ce qu'il a vu et fait, puis la montre aux secours (écran ou QR code).
   Conception : docs/fiche-relais.md. Rien n'est envoyé : la fiche reste sur le téléphone et s'efface après 24 heures.
   Les libellés des champs sont ceux de l'appli ; la liste « Avez-vous pensé à » reprend mot pour mot des extraits
   des fiches RTN (contrôle : node --test). */
(() => {
  const DUREE = 24 * 3600 * 1000;
  const x = (fiche, t) => ({ fiche, t });

  const R = window.RELAIS = {
    DUREE,
    NUMEROS: ['15', '18', '112', '114'],
    SEXES: ['homme', 'femme', 'autre', 'non renseigné'],
    // Catégories de la fiche « Informations générales » (morphologie) quand l'âge est inconnu.
    MORPHOLOGIES: ['nourrisson', 'enfant', 'adulte'],
    CONSTAT: [
      { id: 'repond', q: 'Répond ou réagit', choix: ['oui', 'non'], fiche: 'perte-de-connaissance' },
      { id: 'respire', q: 'Respire', choix: ['oui', 'non', 'respiration anormale'], fiche: 'arret-cardiaque' },
      { id: 'saigne', q: 'Saigne abondamment', choix: ['oui', 'non'], fiche: 'hemorragies' },
      { id: 'etouffe', q: 'S’étouffe', choix: ['oui', 'non'], fiche: 'obstruction-des-voies-aeriennes' },
    ],
    // Zones du schéma ; gauche et droite sont celles de la victime.
    ZONES: [
      ['tete', 'tête'], ['cou', 'cou'], ['thorax', 'thorax'], ['abdomen', 'abdomen'], ['dos', 'dos'],
      ['bras-d', 'bras droit'], ['bras-g', 'bras gauche'], ['jambe-d', 'jambe droite'], ['jambe-g', 'jambe gauche'],
    ],
    // Gestes que l'on peut cocher, avec leur heure, et la fiche RTN correspondante.
    GESTES: [
      ['compression', 'compression de l’endroit qui saigne', 'compression'],
      ['pansement', 'pansement compressif', 'compression'],
      ['garrot', 'garrot (heure de pose)', 'garrot'],
      ['claques', 'claques dans le dos', 'desobstruction-par-des-claques-dans-le-dos'],
      ['compressions-ova', 'compressions abdominales ou thoraciques (étouffement)', 'desobstruction-par-des-compressions-abdominales'],
      ['lva', 'libération des voies aériennes', 'liberation-des-voies-aeriennes'],
      ['pls', 'position latérale de sécurité (PLS)', 'position-laterale-de-securite-pls'],
      ['dos', 'laissée sur le dos (traumatisme)', 'perte-de-connaissance'],
      ['rcp', 'début de la RCP (compressions thoraciques)', 'compressions-thoraciques'],
      ['dae', 'DAE posé', 'defibrillation'],
      ['arrosage', 'début de l’arrosage de la brûlure', 'brulures'],
    ],
    // « Avez-vous pensé à… » : extraits exacts des fiches RTN.
    RAPPEL: [
      x('alerte', 'transmettre les informations'),
      x('alerte', 'appliquer les consignes données'),
      x('garrot', 'noter l’heure de pose du garrot'),
      x('malaises', 'transmettre fidèlement les informations recueillies'),
      x('perte-de-connaissance', 'surveiller en permanence la respiration'),
      x('traumatismes', 'protéger la victime de la chaleur, du froid ou des intempéries'),
      x('traumatismes', 'surveiller en permanence la victime et lui parler régulièrement'),
      x('traumatismes', 'en cas d’aggravation, alerter de nouveau les secours et pratiquer les gestes qui s’imposent'),
    ],
  };

  R.nouvelle = (now) => ({ cree: now, alerte: {}, victime: {}, constat: {}, zones: [], gestes: {}, malaise: {}, observations: '', journal: [], dae: {} });
  R.perimee = (d, now) => !d || !d.cree || now - d.cree >= DUREE;
  R.finDeVie = (d) => new Date(d.cree + DUREE);
  const hm = (t) => { const d = new Date(t); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  R.hm = hm;
  const jour = (t) => { const d = new Date(t); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; };

  // Texte de la fiche : affiché aux secours et contenu du QR code. Les rubriques vides sont omises.
  R.texte = (d, { journalMax = 40 } = {}) => {
    const l = [...(d.essai ? ['EXERCICE - FICHE D’ENTRAÎNEMENT, PAS UNE VRAIE VICTIME'] : []), 'AEGIS - FICHE RELAIS', 'Informations notées par un témoin, non vérifiées.', `Créée le ${jour(d.cree)} à ${hm(d.cree)}`];
    const champs = (o) => o.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '').map(([k, v]) => (k ? `${k} : ${v}` : v)).join(' ; ');
    const ligne = (titre, contenu) => { if (contenu) l.push(`${titre} : ${contenu}`); };
    const a = d.alerte || {};
    ligne('ALERTE', champs([['heure', a.heure], ['numéro', a.numero], ['nature', a.nature], ['victimes', a.victimes], ['lieu', a.lieu]]));
    const v = d.victime || {};
    const ident = [v.nom && v.nom.toUpperCase(), v.prenom].filter(Boolean).join(' ');
    ligne('VICTIME', champs([['', ident], ['âge', v.age ? v.age + ' ans' : v.morpho], ['sexe', v.sexe]]));
    ligne('CONSTAT', champs(R.CONSTAT.map((c) => [c.q.toLowerCase(), (d.constat || {})[c.id]])));
    ligne('ZONES ATTEINTES', (d.zones || []).map((z) => (R.ZONES.find(([id]) => id === z) || [, z])[1]).join(', '));
    const g = d.gestes || {};
    ligne('GESTES', R.GESTES.filter(([id]) => g[id]).map(([id, lib]) => `${lib.replace(/ \(heure de pose\)/, '')} ${g[id]}`).join(' ; ')
      + (d.dae && d.dae.chocs ? ` ; chocs délivrés par le DAE : ${d.dae.chocs}` : ''));
    const m = d.malaise || {};
    ligne('MALAISE', champs([['durée', m.duree], ['déjà connu', m.connu], ['traitements', m.traitements]]));
    ligne('OBSERVATIONS', (d.observations || '').trim());
    const j = (d.journal || []).slice(-journalMax);
    if (j.length) {
      l.push(`DÉROULÉ${(d.journal || []).length > j.length ? ' (dernières étapes)' : ''} :`);
      for (const e of j) l.push(`${hm(e.h)} ${e.t}`);
    }
    return l.join('\n');
  };

  // Ajoute une ligne au déroulé (étape validée en pas à pas, appel, minuteur...).
  R.noter = (d, t, now) => {
    const court = t.length > 90 ? t.slice(0, 87).trimEnd() + '…' : t;
    const der = d.journal[d.journal.length - 1];
    if (!der || der.t !== court) d.journal.push({ h: now, t: court });
    return d;
  };
})();
