/* Module « Se former » : questions fabriquées automatiquement à partir des textes officiels.
   Les propositions de réponse sont des phrases des fiches (ou du guide APS), jamais réécrites. */
(() => {
  const melanger = (t) => { const a = [...t]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const cle = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const XP_PAR_REPONSE = 10;
  const jeune = () => profil === 'jeune';
  const xpNiveau = () => (jeune() ? 50 : 100);
  const niveauDe = (xp) => Math.floor(xp / xpNiveau()) + 1;
  // Les récompenses (XP, niveaux, étoiles, jeton) sont de l'habillage : elles ne changent pas le contenu.
  const TITRES = ['Apprenti', 'Éclaireur', 'Secouriste en herbe', 'Gardien', 'Protecteur', 'Grand protecteur', 'Héros du quotidien'];
  const titreNiveau = (n) => TITRES[Math.min(n, TITRES.length) - 1];
  const etoiles = (m) => { const r = m ? m[0] / m[1] : 0; const n = r >= 1 ? 3 : r >= 0.8 ? 2 : r >= 0.5 ? 1 : 0; return `<span class="etoiles" aria-label="${n} étoile${n > 1 ? 's' : ''} sur 3">${'★'.repeat(n)}<i>${'★'.repeat(3 - n)}</i></span>`; };
  const jeton = (n) => `<div class="jeton" aria-hidden="true"><div class="piece"><svg viewBox="0 0 100 100"><path d="M50 14l28 10v24c0 19-12 31-28 38c-16-7-28-19-28-38V24z" fill="#fff" opacity=".9"/><text x="50" y="64" text-anchor="middle" font-size="34" font-weight="800" fill="#b8860b" font-family="system-ui,sans-serif">${n}</text></svg></div></div>`;
  // Mise en forme d'une réponse : majuscule au début, pas de ponctuation finale.
  const propre = (t) => { const r = t.trim().replace(/\s*[;:.,]+$/, ''); return r.charAt(0).toUpperCase() + r.slice(1); };
  const autres = (obj, sauf, n) => melanger(Object.entries(obj).filter(([k]) => !sauf.includes(k)).flatMap(([, v]) => v)).slice(0, n);

  // 10 ans et plus : questions rédigées dans questions.js ; la bonne réponse est un extrait de la fiche officielle.
  function questionsAdulte(theme) {
    return melanger(QUESTIONS.filter((x) => theme === 'tout' || x.theme === theme)).slice(0, 8)
      .map((x) => ({ fiche: x.fiche, texte: x.q, bon: x.bon, choix: melanger([x.bon, ...x.faux]) }));
  }

  // Moins de 10 ans : une question simple par geste du guide APS (la réponse reste la phrase du guide).
  const QUESTIONS_JEUNE = {
    saignement: 'Quelqu’un saigne beaucoup. Que fais-tu ?',
    nez: 'Quelqu’un saigne du nez. Que fais-tu ?',
    plaie: 'Un copain s’est écorché le genou. Que fais-tu ?',
    brulure: 'Quelqu’un s’est brûlé la main. Que fais-tu ?',
    trauma: 'Quelqu’un est tombé et a très mal à la jambe. Que fais-tu ?',
    inconscient: 'Une personne ne répond plus, mais elle respire. Que peux-tu faire si les secours te le demandent ?',
    arret: 'Le cœur d’une personne s’est arrêté et un adulte s’occupe d’elle. Comment peux-tu aider ?',
  };
  const GROUPE_SAIGNEMENT = ['saignement', 'plaie', 'nez'];
  function questionsJeune(theme) {
    if (theme === 'numeros') return melanger(APS.numeros.map(([n, s]) => ({ texte: `À quoi correspond le ${n} ?`, bon: s, choix: melanger(APS.numeros.map((x) => x[1])) })));
    if (theme === 'dessins') return melanger(SITUATIONS.filter((s) => DESSINS[s.id])).slice(0, 8).map((s) => {
      const exclus = GROUPE_SAIGNEMENT.includes(s.id) ? GROUPE_SAIGNEMENT : ['arret', 'inconscient'].includes(s.id) ? ['arret', 'inconscient'] : [s.id];
      return { situation: s.id, dessin: DESSINS[s.id], texte: 'Que se passe-t-il sur ce dessin ?', bon: s.label, choix: melanger([s.label, ...melanger(SITUATIONS.filter((x) => !exclus.includes(x.id)).map((x) => x.label)).slice(0, 3)]) };
    });
    return melanger(Object.entries(APS.gestes).map(([id, g]) => {
      const s = SITUATIONS.find((x) => x.id === id);
      const exclus = GROUPE_SAIGNEMENT.includes(id) ? GROUPE_SAIGNEMENT : [id];
      return { situation: id, dessin: DESSINS[id], texte: QUESTIONS_JEUNE[id] || `${s.label} : quel est le bon geste ?`, bon: g[0], choix: melanger([g[0], ...autres(APS.gestes, exclus, 3)]) };
    }));
  }

  const themes = () => jeune()
    ? [{ id: 'dessins', label: 'Reconnaître la situation', icon: '🖼️' }, { id: 'gestes', label: 'Les gestes que je sais faire', icon: '🤲' }, { id: 'numeros', label: 'Les numéros d’urgence', icon: '📞' }]
    : [...[...new Set(QUESTIONS.map((x) => x.theme))].map((id) => ({ id, label: fiche(id).title })), { id: 'tout', label: 'Tout mélanger' }];
  const cleProgres = () => 'progres-' + (jeune() ? 'jeune' : 'grand');
  const progres = () => memo.lire(cleProgres(), { xp: 0, meilleurs: {} });

  // --- Passage de niveau : jeton qui tourne et confettis ---
  function feteNiveau(n) {
    const couleurs = ['#c8102e', '#f1c40f', '#3aa76d', '#4a90d9', '#9b6bd3'];
    const confettis = Array.from({ length: jeune() ? 36 : 14 }, (_, i) => `<i style="left:${Math.random() * 100}%;background:${couleurs[i % 5]};animation-delay:${(Math.random() * 0.8).toFixed(2)}s;animation-duration:${(1.8 + Math.random() * 1.4).toFixed(2)}s"></i>`).join('');
    const d = document.createElement('div');
    d.className = 'fete';
    d.innerHTML = `<div class="confettis">${confettis}</div><div class="carton" role="dialog" aria-label="Niveau ${n} atteint">${jeton(n)}
      <p class="grand">Niveau ${n} !</p>${jeune() ? `<p>Tu deviens <b>${titreNiveau(n)}</b></p>` : '<p>Bien joué.</p>'}
      <button class="btn" id="fermerFete">Continuer</button></div>`;
    document.body.append(d);
    d.querySelector('#fermerFete').addEventListener('click', () => d.remove());
    d.querySelector('#fermerFete').focus();
  }
  window.__feteNiveau = feteNiveau; // pour les tests

  window.vueFormation = function () {
    titre('Se former', false);
    const p = progres(), niveau = niveauDe(p.xp), reste = p.xp % xpNiveau(), pct = Math.round(100 * reste / xpNiveau());
    vue.innerHTML = `<div class="niveau avecJeton">${jeton(niveau)}<div><b>Niveau ${niveau}</b>${jeune() ? ` · ${titreNiveau(niveau)}` : ''}<br><small>${p.xp} XP</small>
        <div class="barre"><i style="width:${pct}%"></i></div><small>Encore ${xpNiveau() - reste} XP avant le niveau ${niveau + 1}. Une bonne réponse = ${XP_PAR_REPONSE} XP.</small></div></div>
      <h2 class="section">${jeune() ? 'Choisis ta mission' : 'Choisir un thème'}</h2>
      ${jeune()
        ? `<div class="grille">${themes().map((t) => `<a class="tuile mission" href="#/quiz/${t.id}"><i>${t.icon}</i>${esc(t.label)}${etoiles(p.meilleurs[t.id])}</a>`).join('')}</div>`
        : `<ul class="liste">${themes().map((t) => { const m = p.meilleurs[t.id]; return `<li><a href="#/quiz/${t.id}"><span>${esc(t.label)}</span><small>${m ? `${m[0]}/${m[1]} ` : ''}${etoiles(m)}</small></a></li>`; }).join('')}</ul>`}
      ${jeune() ? '' : `<h2 class="section">Fiche relais</h2>
      <ul class="liste"><li><a href="#/relais/guide"><span>📝 Bien remplir la fiche relais</span><small>guide et exemple</small></a></li>
        <li><a href="#/relais/essai"><span>✍️ S’entraîner sur une fiche d’essai</span><small>sans toucher à une vraie fiche</small></a></li></ul>`}
      <p class="source">Les bonnes réponses reprennent les textes officiels. Réviser ici ne remplace pas une formation avec un formateur.</p>`;
    scrollTo(0, 0);
  };

  window.vueQuiz = function (theme) {
    const t = themes().find((x) => x.id === theme);
    if (!t) return vueFormation();
    const questions = jeune() ? questionsJeune(theme) : questionsAdulte(theme);
    for (const x of questions) { x.bon = propre(x.bon); x.choix = x.choix.map(propre); }
    let i = 0, score = 0;
    titre(t.label, true);
    const poser = () => {
      const q = questions[i];
      vue.innerHTML = `<div class="barre fine"><i style="width:${Math.round(100 * i / questions.length)}%"></i></div>
        <p class="meta">Question ${i + 1} sur ${questions.length} · ${score * XP_PAR_REPONSE} XP gagnés</p>
        ${q.dessin || ''}<p class="question">${esc(q.texte)}</p>
        ${q.choix.map((c, k) => `<button class="choix" data-k="${k}">${esc(c)}</button>`).join('')}<div id="suite"></div>`;
      scrollTo(0, 0);
      vue.querySelectorAll('.choix').forEach((b) => b.addEventListener('click', () => {
        const juste = q.choix[+b.dataset.k] === q.bon;
        if (juste) score++;
        vue.querySelectorAll('.choix').forEach((x) => { x.disabled = true; if (q.choix[+x.dataset.k] === q.bon) x.classList.add('bon'); });
        if (!juste) b.classList.add('faux');
        const lien = q.fiche ? `#/fiche/${q.fiche}` : q.situation ? `#/s/${q.situation}` : '';
        $('#suite').innerHTML = `<p class="retour">${juste ? `<span class="gain">+${XP_PAR_REPONSE} XP</span> ✔ Bonne réponse` : '✘ Raté. La bonne réponse est en vert.'}${lien ? ` · <a href="${lien}">Revoir la fiche</a>` : ''}</p>
          <button class="btn" id="suivant">${i + 1 < questions.length ? 'Question suivante' : 'Voir mon résultat'}</button>`;
        $('#suivant').addEventListener('click', () => { i++; i < questions.length ? poser() : finir(); });
        $('#suivant').scrollIntoView({ block: 'nearest' });
      }));
    };
    const finir = () => {
      const p = progres(), avant = niveauDe(p.xp);
      p.xp += score * XP_PAR_REPONSE;
      const m = p.meilleurs[theme];
      if (!m || score / questions.length > m[0] / m[1]) p.meilleurs[theme] = [score, questions.length];
      memo.ecrire(cleProgres(), p);
      const apres = niveauDe(p.xp);
      vue.innerHTML = `<div class="niveau resultat">${etoiles([score, questions.length])}<br><b>${score} bonne${score > 1 ? 's' : ''} réponse${score > 1 ? 's' : ''} sur ${questions.length}</b><br>+${score * XP_PAR_REPONSE} XP</div>
        <p><a class="btn lien" href="#/quiz/${theme}?${Date.now()}">Rejouer</a> <a class="btn lien clair" href="#/former">Retour</a></p>`;
      scrollTo(0, 0);
      if (apres > avant) feteNiveau(apres);
    };
    questions.length ? poser() : vueFormation();
  };
})();
