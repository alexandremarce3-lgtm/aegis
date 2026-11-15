/* Mode « pas à pas » : pour chaque situation, la liste des étapes à afficher une par une.
   RIEN n'est rédigé ici : chaque étape désigne, par ses premiers mots, une phrase de la fiche officielle.
   Le texte affiché est toujours celui de fiches.js. Si une phrase n'est pas retrouvée, la vérification échoue
   (node outils/verifier-parcours.mjs). Ce fichier ne fait que CHOISIR et ORDONNER des phrases officielles. */
(() => {
  const OVA = 'obstruction-des-voies-aeriennes', AC = 'arret-cardiaque', PDC = 'perte-de-connaissance';
  const CLAQUES = { f: 'desobstruction-par-des-claques-dans-le-dos', h3: ['Chez l’adulte et le grand enfant', 'Chez la victime qui peut tenir sur la cuisse du secouriste', 'Chez la victime qui peut tenir sur l’avant-bras du secouriste'] };
  const ABDO = { f: 'desobstruction-par-des-compressions-abdominales', h3: ['Chez l’adulte ou l’enfant'] };
  const THORAX_OVA = { f: 'desobstruction-par-des-compressions-thoraciques', h3: ['Personne dont il est impossible d’encercler l’abdomen', 'Personne alitée ou allongée, difficilement mobilisable', 'Chez la victime qui peut tenir sur l’avant-bras du secouriste'] };
  const ATTENTE = (depuis) => ({ titre: 'attente', groupe: [{ a: 'protéger', depuis }, 'faire alerter ou alerter les secours', 'surveiller en permanence', 'en cas d’aggravation'] });

  window.PARCOURS = {
    etouffement: { fiche: OVA, etapes: [
      'demander à la victime si elle s’étouffe',
      { choix: [
        { t: 'Si la victime peut parler, crier, tousser', etapes: [
          'continuer d’encourager la victime à tousser',
          'surveiller l’efficacité de la toux',
          { titre: 'attente', groupe: [{ a: 'installer la victime en position d', depuis: 'Si la victime respire (toux efficace)' }, 'desserrer les vêtements', { a: 'faire alerter ou alerter les secours', appel: true }, 'protéger contre la chaleur', 'surveiller en permanence'] },
        ] },
        { t: 'Si la victime ne peut plus parler, crier, tousser', etapes: [
          'laisser la victime dans la position où elle se trouve',
          { a: 'donner de 1 à 5', gestes: [CLAQUES] },
          { a: 'réaliser de 1 à 5', gestes: [ABDO, THORAX_OVA] },
          'répéter le cycle',
          'interrompre les manœuvres dès',
          { choix: [
            { t: 'Si la victime respire (toux efficace) ou après le succès des manœuvres', etapes: [
              'installer la victime en position d', 'desserrer les vêtements', { a: 'faire alerter ou alerter les secours', appel: true }, 'protéger contre la chaleur', 'surveiller en permanence'] },
            { t: 'Si la victime perd connaissance', etapes: ['l’accompagner au sol', { a: 'réaliser une réanimation cardio-pulmonaire', lien: 'arret' }] },
          ] },
        ] },
      ] },
    ] },

    saignement: { fiche: 'hemorragies', etapes: [
      'constater l’hémorragie',
      { a: 'arrêter immédiatement l’hémorragie', gestes: [{ f: 'compression', h3: ['Compression manuelle'] }] },
      'maintenir la compression',
      'allonger confortablement la victime',
      { a: 'faire alerter ou alerter les secours', appel: true },
      { a: 'mettre en place', gestes: [{ f: 'compression', h3: ['Pansement compressif'] }, { f: 'garrot' }] },
      { titre: 'attente', groupe: ['rassurer la victime', 'réchauffer la victime', 'protéger la victime contre le froid', 'surveiller attentivement', 'en cas d’aggravation'] },
    ] },

    nez: { fiche: 'hemorragies', etapes: [
      { a: 'l’asseoir, tête penchée en avant', depuis: 'La victime saigne du nez' },
      'lui demander de se moucher vigoureusement',
      { a: 'lui demander de comprimer les deux narines', minuteur: 600 },
      'demander un avis médical si',
    ] },

    // « Ne répond pas » : un seul parcours pour les deux tuiles, car on ne sait pas d'avance si la victime respire.
    arret: { fiche: AC, etapes: [
      'Rechercher une perte de connaissance, pour cela',
      { choix: [
        { t: 'Si la victime répond ou réagit', lien: 'malaise' },
        { t: 'Si la victime ne répond pas et ne réagit pas, il convient de', etapes: [
          'demander de l’aide, si vous êtes seul',
          'l’allonger sur le dos',
          { a: 'libérer les voies aériennes', gestes: [{ f: 'liberation-des-voies-aeriennes' }] },
          'rechercher la respiration sur 10 secondes',
          { choix: [
            { t: 'Si la victime ne respire pas ou si la respiration est anormale', etapes: [
              { titre: 'alerte', groupe: [{ a: 'si aucun tiers n’est présent', appel: true }, 'si un tiers est présent'] },
              { a: 'débuter immédiatement', metronome: true, gestes: [{ f: 'compressions-thoraciques', h3: ['Chez l’adulte', 'Chez l’enfant', 'Chez le nourrisson'] }, { f: 'insufflations' }] },
              { a: 'si un DAE est installé', gestes: [{ f: 'defibrillation', h3: ['Chez l’adulte', 'Chez l’enfant et le nourrisson'] }], metronome: true },
              { a: 'poursuivre la RCP', metronome: true },
            ] },
            { t: 'Si la victime respire, appliquer la conduite à tenir face à une perte de connaissance', suite: PDC, etapes: [
              { choix: [
                { t: 'À la suite d’un évènement non traumatique', etapes: [
                  { a: 'la placer en position stable sur le côté', gestes: [{ f: 'position-laterale-de-securite-pls' }] },
                  { a: 'faire alerter ou alerter les secours', appel: true },
                  'surveiller en permanence la respiration',
                ] },
                { t: 'À la suite d’un traumatisme ou d’un événement d’origine inconnue', etapes: [
                  'laisser la victime sur le dos',
                  { a: 'faire alerter ou alerter les secours', appel: true },
                  'surveiller en permanence la respiration',
                  'si la victime vomit ou régurgite',
                ] },
              ] },
              { titre: 'attente', groupe: [{ a: 'protéger contre la chaleur', depuis: 'Dans tous les cas' }, 'si la respiration de la victime s’arrête'] },
            ] },
          ] },
        ] },
      ] },
    ] },

    malaise: { fiche: 'malaises', etapes: [
      'installer la victime en position d',
      { a: 'observer les signes', info: ['La victime, consciente, ne se sent pas bien'] },
      'se renseigner auprès de la victime',
      'aider la victime à sa demande',
      { a: 'en présence de signes qui doivent alerter le secouriste', appel: true },
      { titre: 'attente', groupe: ['protéger la victime de la chaleur', 'surveiller en permanence', 'en cas d’aggravation'] },
    ] },

    plaie: { fiche: 'plaies', etapes: [
      { info: ['plaie simple, lorsqu’il s’agit', 'plaie grave du fait'], choix: [
        { t: 'Face à une plaie grave', etapes: [
          'ne jamais retirer le corps étranger',
          { a: 'en cas d\'hémorragie, appliquer la conduite à tenir adaptée', lien: 'saignement' },
          'installer la victime en position d',
          { titre: 'attente', groupe: ['protéger la victime de la chaleur', { a: 'faire alerter ou alerter les secours', appel: true }, 'surveiller en permanence', 'en cas d’aggravation'] },
        ] },
        { t: 'Face à une plaie simple', etapes: ['se laver les mains', 'nettoyer la plaie', 'sécher la zone autour de la plaie', 'conseiller à la victime de consulter un médecin'] },
        { t: 'Face à une amputation ou un arrachement d’une partie du corps', etapes: [
          { a: 'arrêter l’hémorragie immédiatement', lien: 'saignement' },
          { a: 'mettre en place un pansement compressif', gestes: [{ f: 'compression', h3: ['Pansement compressif'] }] },
          'conditionner la partie du corps',
          { titre: 'attente', groupe: ['protéger la victime de la chaleur', { a: 'faire alerter ou alerter les secours', appel: true }, 'surveiller en permanence', 'en cas d’aggravation', 'remettre la partie du corps conditionnée'] },
        ] },
      ] },
    ] },

    brulure: { fiche: 'brulures', etapes: [
      { choix: [
        { t: 'En présence d’une brûlure thermique', etapes: [
          { a: 'refroidir immédiatement la surface brûlée', minuteur: 600 },
          { info: ['brûlure simple, lorsqu’il s’agit', 'brûlure grave, dès lors'], choix: [
            { t: 'Si la brûlure est grave', etapes: [
              { a: 'dès le début de l’arrosage', appel: true },
              'poursuivre le refroidissement, selon les consignes',
              'après refroidissement, installer la victime',
              { titre: 'attente', groupe: ['laisser si possible la partie brûlée visible', 'protéger la victime de la chaleur', 'surveiller en permanence', 'en cas d’aggravation', 'Aucun produit ne doit être appliqué'] },
            ] },
            { t: 'Si la brûlure est simple', etapes: ['poursuivre le refroidissement jusqu', 'ne jamais percer les cloques', 'protéger la brûlure par un pansement', 'conseiller à la victime de consulter un médecin'] },
          ] },
        ] },
        { t: 'En présence d’une brûlure électrique', etapes: [
          'appliquer la conduite à tenir face à une brûlure thermique grave',
          { a: 'dès le début de l’arrosage', depuis: 'Si la brûlure est grave', appel: true },
          'poursuivre le refroidissement, selon les consignes',
          'après refroidissement, installer la victime',
          { titre: 'attente', groupe: ['laisser si possible la partie brûlée visible', 'protéger la victime de la chaleur', 'surveiller en permanence', 'en cas d’aggravation'] },
        ] },
        { t: 'En présence d’une brûlure par produit chimique ou interne par inhalation', etapes: [
          'se protéger pour éviter tout contact',
          'demander à la victime de se rincer',
          'en cas d’ingestion',
          'en cas d’inhalation',
          { a: 'faire alerter ou alerter les secours', appel: true },
          { titre: 'attente', groupe: ['protéger la victime de la chaleur', 'surveiller en permanence', 'en cas d’aggravation', 'se laver les mains après'] },
        ] },
      ] },
    ] },

    trauma: { fiche: 'traumatismes', etapes: [
      { choix: [
        { t: 'Si la victime a perdu connaissance', lien: 'arret' },
        { t: 'Sinon', etapes: [
          { a: 'Sinon', depuis: 'Sinon' },
          'si la victime présente une fracture de membre déplacée',
          { titre: 'attente', groupe: ['protéger la victime de la chaleur', { a: 'faire alerter ou alerter les secours', appel: true }, 'surveiller en permanence', 'en cas d’aggravation'] },
        ] },
      ] },
    ] },
  };
  window.PARCOURS.inconscient = window.PARCOURS.arret;
  void ATTENTE;

  /* Retrouve chaque phrase dans les fiches et renvoie les parcours prêts à afficher, plus la liste des erreurs. */
  window.compilerParcours = function (FICHES) {
    const n = (s) => s.toLowerCase().replace(/œ/g, 'oe').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    const F = (id) => FICHES.find((f) => f.id === id);
    const erreurs = [], sortie = {};
    for (const [id, p] of Object.entries(window.PARCOURS)) {
      const cur = {};
      const trouver = (fid, debut, de) => { const f = F(fid), d = n(debut); if (!f) return -1; for (let i = de; i < f.blocks.length; i++) if (f.blocks[i].t && n(f.blocks[i].t).startsWith(d)) return i; return -1; };
      const avecEnfants = (fid, i) => {
        const f = F(fid), b = f.blocks[i], base = b.k === 'li' ? b.l : 0, res = [b];
        if (b.k === 'li' || /:$/.test(b.t.trim())) for (let j = i + 1; j < f.blocks.length; j++) { const c = f.blocks[j]; if (c.k !== 'li' || c.l <= base) break; res.push({ ...c, l: c.l - base }); }
        return res;
      };
      const info = (x, fid) => { const i = trouver(fid, x, 0); if (i < 0) { erreurs.push(`${id} : info introuvable « ${x} » dans ${fid}`); return null; } return avecEnfants(fid, i); };
      const geste = (g) => {
        const f = F(g.f);
        if (!f) { erreurs.push(`${id} : fiche technique inconnue ${g.f}`); return null; }
        const section = (i, stop) => { const r = []; for (let j = i + 1; j < f.blocks.length && !stop(f.blocks[j]); j++) r.push(f.blocks[j]); return r; };
        if (g.h3) return { titre: f.title, fiche: g.f, onglets: g.h3.map((h) => { const i = trouver(g.f, h, 0); if (i < 0) erreurs.push(`${id} : intertitre introuvable « ${h} » dans ${g.f}`); return { t: i < 0 ? h : f.blocks[i].t, blocs: i < 0 ? [] : section(i, (b) => b.k === 'h2' || b.k === 'h3') }; }) };
        const i = f.blocks.findIndex((b) => b.k === 'h2' && b.t === 'Réalisation');
        return { titre: f.title, fiche: g.f, onglets: [{ t: '', blocs: section(i, (b) => b.k === 'h2') }] };
      };
      const action = (spec, fdef) => {
        if (typeof spec === 'string') spec = { a: spec };
        const fid = spec.fiche || fdef;
        if (spec.depuis) { const k = trouver(fid, spec.depuis, 0); if (k < 0) erreurs.push(`${id} : repère introuvable « ${spec.depuis} » dans ${fid}`); else cur[fid] = k; }
        const i = trouver(fid, spec.a, cur[fid] || 0);
        if (i < 0) { erreurs.push(`${id} : phrase introuvable « ${spec.a} » dans ${fid}`); return null; }
        cur[fid] = i + 1;
        return { type: 'a', fiche: fid, blocs: avecEnfants(fid, i), gestes: (spec.gestes || []).map(geste).filter(Boolean), info: (spec.info || []).map((x) => info(x, fid)).filter(Boolean), metronome: !!spec.metronome, minuteur: spec.minuteur || 0, appel: !!spec.appel, lien: spec.lien || null };
      };
      const etapes = (liste, fdef) => liste.map((s) => {
        if (s.groupe) return { type: 'groupe', titre: s.titre, items: s.groupe.map((x) => action(x, s.fiche || fdef)).filter(Boolean) };
        if (s.choix) return { type: 'choix', info: (s.info || []).map((x) => info(x, fdef)).filter(Boolean), options: s.choix.map((o) => {
          const i = trouver(fdef, o.t, 0);
          if (i < 0) erreurs.push(`${id} : choix introuvable « ${o.t} » dans ${fdef}`); else cur[fdef] = i + 1;
          return { t: i < 0 ? o.t : F(fdef).blocks[i].t, notes: i < 0 ? [] : F(fdef).blocks[i].n || [], lien: o.lien || null, etapes: etapes(o.etapes || [], o.suite || fdef) };
        }) };
        return action(s, fdef);
      }).filter(Boolean);
      sortie[id] = { fiche: p.fiche, etapes: etapes(p.etapes, p.fiche) };
    }
    return { parcours: sortie, erreurs };
  };
})();
