// Mode « moins de 10 ans » : une phrase courte par écran, tirée des fiches des RTN PSC (aucune phrase rédigée ici).
// Chaque texte est un extrait exact de la fiche indiquée (contrôle : node --test).
// Affichage : majuscule au début, sans ponctuation finale. Sélection à valider par un formateur.
(() => {
  const x = (fiche, t) => ({ fiche, t });
  window.JEUNE = {
    source: 'Références techniques nationales PSC (DGSCGC, juillet 2026)',
    // Demander de l'aide, puis alerter (fiches Perte de connaissance et Alerte).
    aide: x('perte-de-connaissance', 'demander de l’aide, si vous êtes seul'),
    alerter: [
      x('alerte', 'transmettre les informations'),
      x('alerte', 'la localisation la plus précise possible de l’évènement'),
      x('alerte', 'répondre aux questions posées par les services de secours'),
      x('alerte', 'appliquer les consignes données'),
    ],
    // Numéros de la fiche Alerte (libellés courts pour l'écran).
    numeros: [['15', 'SAMU'], ['18', 'sapeurs-pompiers'], ['112', 'appel d’urgence dans toute l’Union européenne'], ['114', 'urgence par SMS, tchat ou visio']],
    // Premier geste par situation de l'écran d'accueil.
    gestes: {
      saignement: [x('hemorragies', 'comprimer immédiatement l’endroit qui saigne')],
      nez: [x('hemorragies', 'comprimer les deux narines avec les doigts, durant 10 minutes sans relâcher')],
      plaie: [x('plaies', 'se laver les mains avec de l’eau et du savon'), x('plaies', 'nettoyer la plaie')],
      brulure: [x('brulures', 'refroidir immédiatement la surface brûlée')],
      trauma: [x('traumatismes', 'conseiller fermement de ne pas mobiliser la partie atteinte')],
      inconscient: [x('perte-de-connaissance', 'Il est possible que les services de secours demandent de mettre la victime en position latérale de sécurité')],
      arret: [x('arret-cardiaque', 'ramener et installer un DAE')],
    },
  };
  const propre = (t) => { const r = t.trim().replace(/\s*[;:.,]+$/, ''); return r.charAt(0).toUpperCase() + r.slice(1); };
  window.JEUNE.texte = (e) => propre(e.t);
})();
