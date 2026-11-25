/* Logigramme de bilan : que vérifier, dans quel ordre.
   L'ordre est celui des fiches des RTN PSC, classées pour « rechercher et traiter en priorité ce qui tue en premier »
   (page 3 des RTN). Les questions sont des libellés courts de l'appli ; chaque réponse renvoie à la fiche officielle
   ou au pas à pas, qui donnent la conduite à tenir exacte. Rien n'est prescrit ici. */
(() => {
  // Chaque étape : question, fiche(s) de référence, réponse « oui » et réponse « non ».
  // Une réponse est soit un lien (vers le pas à pas ou une fiche), soit la suite du logigramme.
  window.BILAN = [
    { q: 'Y a-t-il un danger pour vous, la victime ou les autres ?', ref: ['protection'],
      oui: { lien: '#/fiche/protection', t: 'Protéger d’abord', suite: true }, non: { suite: true } },
    { q: 'La victime saigne-t-elle abondamment ?', ref: ['hemorragies'],
      oui: { lien: '#/s/saignement', t: 'Hémorragie : pas à pas' }, non: { suite: true } },
    { q: 'La victime s’étouffe-t-elle ?', ref: ['obstruction-des-voies-aeriennes'],
      oui: { lien: '#/s/etouffement', t: 'Étouffement : pas à pas' }, non: { suite: true } },
    { q: 'La victime répond-elle ou réagit-elle ?', ref: ['perte-de-connaissance', 'arret-cardiaque'],
      oui: { suite: true }, non: { lien: '#/s/arret', t: 'Ne répond pas : pas à pas (voies aériennes, respiration, puis PLS ou RCP)' } },
    { q: 'Elle répond : que se passe-t-il ?', ref: ['malaises', 'plaies', 'brulures', 'traumatismes'],
      choix: [
        { lien: '#/s/malaise', t: 'Malaise' }, { lien: '#/s/plaie', t: 'Plaie' },
        { lien: '#/s/brulure', t: 'Brûlure' }, { lien: '#/s/trauma', t: 'Chute, coup, fracture' },
      ] },
  ];

  window.vueBilan = function vueBilan() {
    titre('Bilan', true);
    const ref = (ids) => ids.map((id) => { const f = fiche(id); return `<a href="#/fiche/${id}">${esc(f.title)}${f.code ? ' (' + f.code + ')' : ''}</a>`; }).join(', ');
    const rep = (r, mot) => (r.lien ? `<a class="btn ${mot === 'Non' ? 'clair' : ''}" href="${r.lien}">${mot} : ${esc(r.t)}</a>` : '')
      + (r.suite ? `<span class="bilan-suite">${r.lien ? 'puis ' : mot + ' : '}question suivante ↓</span>` : '');
    vue.innerHTML = `<article class="fiche bilan">
      <p class="avant">Mettez-vous en sécurité. Alertez ou faites alerter les secours (<b>15</b>, <b>18</b> ou <b>112</b>) au moment indiqué par chaque fiche.</p>
      <ol class="bilan-etapes">${BILAN.map((e) => `<li>
        <h2>${esc(e.q)}</h2>
        <div class="bilan-rep">${e.choix ? e.choix.map((c) => `<a class="btn" href="${c.lien}">${esc(c.t)}</a>`).join('') : rep(e.oui, 'Oui') + rep(e.non, 'Non')}</div>
        <p class="meta">Fiche : ${ref(e.ref)}</p>
      </li>`).join('')}</ol>
      <p class="source">Ordre des fiches des ${SOURCE} : rechercher et traiter d’abord ce qui tue en premier. Les questions sont des repères de l’appli ; la conduite à tenir est celle de chaque fiche. Contenu à valider par un formateur. Aegis ne remplace pas une formation.</p>
    </article>`;
    scrollTo(0, 0);
  };
})();
