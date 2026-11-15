/* Écran « pas à pas » : une étape à la fois, en gros, avec le geste détaillé au moment où on en a besoin.
   Tous les textes d'étapes viennent des fiches officielles (voir parcours.js). */
(() => {
  let compile = null, etat = null, minuterie = null, batteur = null, audio = null;
  const haut = (cadres) => cadres[cadres.length - 1];
  const courante = () => { const c = haut(etat.cadres); return c.etapes[c.i]; };
  const copie = () => etat.cadres.map((c) => ({ etapes: c.etapes, i: c.i }));
  const stopOutils = () => { clearInterval(minuterie); clearInterval(batteur); minuterie = batteur = null; taire(); };

  // Texte principal d'une action : la phrase officielle, ses sous-points, ses notes.
  const corpsAction = (e, grand) => {
    const [tete, ...sous] = e.blocs;
    return `<p class="${grand ? 'etape' : 'etapePetite'}">${esc(tete.t)}</p>${(tete.n || []).map((x) => `<span class="note">ⓘ ${esc(x)}</span>`).join('')}${sous.length ? `<div class="sous">${rendre(sous)}</div>` : ''}`;
  };
  const blocInfo = (info) => info.map((b) => `<div class="repere">${corpsAction({ blocs: b }, false)}</div>`).join('');
  const blocGestes = (e) => e.gestes.map((g, k) => `<section class="geste-detail"><h3>${esc(g.titre)} <button class="lienbtn ecoute-geste" data-g="${k}">🔊 Écouter</button></h3>
      ${g.onglets.length > 1 ? `<div class="onglets-geste">${g.onglets.map((o, j) => `<button data-g="${k}" data-o="${j}" class="${j === 0 ? 'actif' : ''}">${esc(o.t)}</button>`).join('')}</div>` : (g.onglets[0].t ? `<p class="meta">${esc(g.onglets[0].t)}</p>` : '')}
      <div class="contenu-geste" data-g="${k}">${rendre(g.onglets[0].blocs)}</div>
      <p class="meta"><a href="#/fiche/${g.fiche}">Fiche technique complète</a></p></section>`).join('');
  const outils = (e) => `${e.appel ? '<div class="appel-etape"><a href="tel:15">📞 15</a><a href="tel:18">📞 18</a><a href="tel:112">📞 112</a></div>' : ''}
      ${e.metronome ? '<button class="btn outil" id="metro">🎵 Rythme des compressions</button><span class="battement" id="batt" hidden></span>' : ''}
      ${e.minuteur ? `<button class="btn outil" id="minut">⏱ Minuteur ${e.minuteur / 60} minutes</button>` : ''}`;

  function afficher() {
    stopOutils();
    const e = courante(), p = compile[etat.id], s = SITUATIONS.find((x) => x.id === etat.id);
    titre(s.label, true);
    let h = '';
    if (!e) {
      h = `<p class="etape">Fin des étapes.</p><p class="fin-pas"><a class="btn lien" href="#/">Retour à l’accueil</a> <button class="btn clair" id="debut">Recommencer</button></p>`;
    } else if (e.type === 'choix') {
      h = `${blocInfo(e.info)}<div class="choix-pas">${e.options.map((o, k) => `<button class="option" data-k="${k}">${esc(o.t)}${(o.notes || []).map((x) => `<small>ⓘ ${esc(x)}</small>`).join('')}</button>`).join('')}</div>`;
    } else if (e.type === 'groupe') {
      h = e.items.map((x) => `<div class="item-groupe">${corpsAction(x, false)}${outils(x)}</div>`).join('');
    } else {
      h = `${corpsAction(e, true)}${blocInfo(e.info)}${outils(e)}${blocGestes(e)}`;
    }
    const dernier = e && e.type !== 'choix' && !suivantExiste();
    vue.innerHTML = `<article class="fiche pas">
      ${h}
      <div class="nav-pas">
        ${etat.hist.length ? '<button class="btn clair" id="prec">← Retour</button>' : ''}
        ${e && e.type !== 'choix' ? (e.lien ? `<a class="btn lien" href="#/s/${e.lien}">Continuer →</a>` : dernier ? '<button class="btn" id="suiv">Terminer</button>' : '<button class="btn" id="suiv">Suivant →</button>') : ''}
      </div>
      <p class="outils-pas">${e ? '<button class="lienbtn" id="lire">🔊 Écouter</button> · ' : ''}<a href="#/fiche/${p.fiche}">Voir la fiche complète</a> · <a href="#/">Accueil</a></p>
    </article>`;
    scrollTo(0, 0);
    brancher(e);
  }

  function suivantExiste() {
    const c = copie(); let k = c.length - 1; c[k].i++;
    while (k > 0 && c[k].i >= c[k].etapes.length) { k--; c[k].i++; }
    return c[k].i < c[k].etapes.length;
  }
  function avancer() {
    etat.hist.push(copie());
    haut(etat.cadres).i++;
    while (etat.cadres.length > 1 && haut(etat.cadres).i >= haut(etat.cadres).etapes.length) { etat.cadres.pop(); haut(etat.cadres).i++; }
    afficher();
  }

  function brancher(e) {
    $('#prec')?.addEventListener('click', () => { etat.cadres = etat.hist.pop(); afficher(); });
    $('#suiv')?.addEventListener('click', avancer);
    $('#debut')?.addEventListener('click', () => demarrer(etat.id));
    vue.querySelectorAll('.option').forEach((b) => b.addEventListener('click', () => {
      const o = e.options[+b.dataset.k];
      if (o.lien) { location.hash = '#/s/' + o.lien; return; }
      etat.hist.push(copie());
      if (o.etapes.length) etat.cadres.push({ etapes: o.etapes, i: 0 }); else haut(etat.cadres).i++;
      afficher();
    }));
    vue.querySelectorAll('.onglets-geste button').forEach((b) => b.addEventListener('click', () => {
      const g = e.gestes[+b.dataset.g];
      b.parentNode.querySelectorAll('button').forEach((x) => x.classList.toggle('actif', x === b));
      vue.querySelector(`.contenu-geste[data-g="${b.dataset.g}"]`).innerHTML = rendre(g.onglets[+b.dataset.o].blocs);
    }));
    vue.querySelectorAll('.ecoute-geste').forEach((b) => b.addEventListener('click', () => {
      const g = e.gestes[+b.dataset.g], actif = vue.querySelector(`.onglets-geste button.actif[data-g="${b.dataset.g}"]`);
      parler(g.onglets[actif ? +actif.dataset.o : 0].blocs.filter((x) => x.k !== 'h2').map((x) => x.t));
    }));
    $('#lire')?.addEventListener('click', () => {
      const blocs = !e ? [] : e.type === 'choix' ? e.options.map((o) => ({ t: o.t })) : e.type === 'groupe' ? e.items.flatMap((x) => x.blocs) : e.blocs;
      parler(blocs.map((x) => x.t));
    });
    // Métronome : 110 battements par minute (la fiche demande entre 100 et 120).
    $('#metro')?.addEventListener('click', (ev) => {
      const b = ev.currentTarget, voyant = $('#batt');
      if (batteur) { clearInterval(batteur); batteur = null; b.textContent = '🎵 Rythme des compressions'; voyant.hidden = true; return; }
      try { audio ||= new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); } catch {}
      b.textContent = '⏸ Arrêter le rythme'; voyant.hidden = false;
      const bip = () => {
        voyant.classList.remove('bat'); void voyant.offsetWidth; voyant.classList.add('bat');
        if (!audio) return;
        const o = audio.createOscillator(), g = audio.createGain();
        o.frequency.value = 880; g.gain.setValueAtTime(0.25, audio.currentTime); g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.08);
        o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime + 0.09);
      };
      bip(); batteur = setInterval(bip, 60000 / 110);
    });
    $('#minut')?.addEventListener('click', (ev) => {
      const b = ev.currentTarget; let reste = +b.dataset.reste || e.minuteur;
      if (minuterie) { clearInterval(minuterie); minuterie = null; b.textContent = `⏱ Reprendre (${fmt(reste)})`; return; }
      const tic = () => { b.dataset.reste = reste; b.textContent = reste > 0 ? `⏱ ${fmt(reste)} (toucher pour mettre en pause)` : '⏱ Temps écoulé'; if (reste <= 0) { clearInterval(minuterie); minuterie = null; navigator.vibrate?.(600); } reste--; };
      tic(); minuterie = setInterval(tic, 1000);
    });
  }
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  function demarrer(id) {
    compile ||= (() => { const r = compilerParcours(FICHES); if (r.erreurs.length) console.error('Parcours :', r.erreurs); return r.parcours; })();
    etat = { id, cadres: [{ etapes: compile[id].etapes, i: 0 }], hist: [] };
    afficher();
  }
  /* ----- Moins de 12 ans : une phrase du guide APS par écran, un dessin, un gros bouton pour écouter ----- */
  const GESTE_DABORD = ['saignement', 'nez', 'plaie', 'brulure', 'trauma']; // le geste se fait tout de suite
  const SANS_APPEL = ['nez', 'plaie'];                                      // un adulte suffit en général
  function etapesJeune(s) {
    const [adulte, service, dire, lieu] = APS.alerter;
    const geste = (APS.gestes[s.id] || []).map((t) => ({ dessin: DESSINS[s.id], texte: t }));
    const appel = SANS_APPEL.includes(s.id) ? [] : [{ dessin: DESSINS.alerter, texte: service, appel: true }, { dessin: DESSINS.dire, texte: dire }, { dessin: DESSINS.lieu, texte: lieu }];
    const debut = { dessin: s.id === 'etouffement' ? deuxCas(s) : DESSINS[s.id], texte: adulte, aide: true };
    return GESTE_DABORD.includes(s.id) ? [...geste, { dessin: DESSINS.aide, texte: adulte }, ...appel] : [debut, ...appel, ...geste];
  }
  function vuePasJeune(s, i = 0) {
    taire();
    const etapes = etapesJeune(s), e = etapes[i];
    titre(s.label, true);
    const grands = aParcours(s.id) ? `<p class="outils-pas"><button class="lienbtn" id="grands">Voir les gestes des grands, étape par étape</button></p>` : '';
    vue.innerHTML = e ? `<article class="fiche pas pas-jeune">
        <div class="points">${etapes.map((_, k) => `<i class="${k === i ? 'ici' : k < i ? 'fait' : ''}"></i>`).join('')}</div>
        ${e.dessin || ''}
        <p class="etape">${esc(e.texte)}</p>
        ${e.appel ? '<div class="appel-etape"><a href="tel:15">📞 15</a><a href="tel:18">📞 18</a><a href="tel:112">📞 112</a></div>' : ''}
        <button class="btn ecouter-gros" id="lireJ">🔊 Écouter</button>
        <div class="nav-pas">${i > 0 ? '<button class="btn clair" id="precJ">← Retour</button>' : ''}<button class="btn" id="suiv">${i + 1 < etapes.length ? 'Suivant →' : 'Terminer'}</button></div>
        <p class="source">Phrase du guide ${APS.source}.</p>
      </article>` : `<article class="fiche pas pas-jeune"><p class="etape">Fin des étapes.</p>
        <p class="fin-pas"><a class="btn lien" href="#/">Retour à l’accueil</a> <button class="btn clair" id="debutJ">Recommencer</button></p>${grands}</article>`;
    scrollTo(0, 0);
    $('#lireJ')?.addEventListener('click', () => parler([e.texte]));
    $('#suiv')?.addEventListener('click', () => vuePasJeune(s, i + 1));
    $('#precJ')?.addEventListener('click', () => vuePasJeune(s, i - 1));
    $('#debutJ')?.addEventListener('click', () => vuePasJeune(s, 0));
    $('#grands')?.addEventListener('click', () => demarrer(s.id));
    vue.querySelectorAll('[data-ancre]').forEach((l) => l.addEventListener('click', (ev) => ev.preventDefault()));
  }
  window.vuePasJeune = vuePasJeune;
  window.vuePas = demarrer;
  window.aParcours = (id) => !!window.PARCOURS[id];
  addEventListener('hashchange', stopOutils);
})();
