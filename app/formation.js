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
  let banque = null;
  // Débuts des mots du titre d'une fiche (« Brûlures » → « brul ») : une phrase qui les contient donne la réponse.
  const racines = (titre) => norm(titre).split(' ').filter((m) => m.length >= 5).map((m) => m.slice(0, 4));
  // Actions communes à presque toutes les situations : elles ne permettent pas de distinguer une fiche d'une autre.
  const COMMUN = /^(protéger|surveiller|faire alerter|alerter|en cas d[’']aggravation|rassurer|réchauffer|desserrer|demander de l[’']aide|se laver|se protéger|installer la victime en position|allonger confortablement)/i;

  // --- Banque de phrases officielles, propres à une seule fiche ---
  function construire() {
    const PR = FICHES.filter((f) => f.type === 'PR'), FT = FICHES.filter((f) => f.type === 'FT');
    const vues = {};
    const actions = {}, points = {};
    for (const f of PR) {
      // Chaque action garde son intertitre officiel (ex. « La victime saigne du nez ») pour rester dans son contexte.
      let contexte = '';
      actions[f.id] = [];
      for (const b of f.blocks.slice(debutAction(f))) {
        if (b.k === 'h2') contexte = '';
        else if (b.k === 'h3') contexte = b.t;
        else if (b.k === 'li' && b.l === 1 && b.t.length >= 20 && !/:$/.test(b.t.trim()) && !COMMUN.test(b.t)) actions[f.id].push({ nu: b.t, cas: contexte, trahit: racines(f.title).some((r) => (' ' + norm(b.t)).includes(' ' + r)) });
      }
      for (const t of new Set(actions[f.id].map((x) => cle(x.nu)))) vues[t] = (vues[t] || 0) + 1;
    }
    for (const f of PR) actions[f.id] = actions[f.id].filter((x) => vues[cle(x.nu)] === 1);
    // Principe d'action de chaque procédure (paragraphe et éventuelle liste qui le suit).
    const principes = {};
    for (const f of PR) {
      const i = f.blocks.findIndex((b) => b.k === 'h2' && /^Principe/.test(b.t));
      const morceaux = [];
      if (i >= 0) for (const b of f.blocks.slice(i + 1)) { if (b.k === 'h2' || b.k === 'h3') break; morceaux.push(b.t); }
      principes[f.id] = morceaux.length ? [morceaux.join(' ')] : [];
    }
    const vuesP = {};
    for (const f of FT) {
      const i = f.blocks.findIndex((b) => b.k === 'h2' && b.t === 'Points clés');
      let amorce = '';
      points[f.id] = [];
      if (i >= 0) for (const b of f.blocks.slice(i + 1)) {
        if (b.k === 'p') amorce = /:$/.test(b.t.trim()) ? b.t.trim() + ' ' : '';
        else if (b.k === 'li' && b.l === 1) points[f.id].push(amorce + b.t);
      }
      for (const t of new Set(points[f.id].map(cle))) vuesP[t] = (vuesP[t] || 0) + 1;
    }
    for (const f of FT) points[f.id] = points[f.id].filter((t) => vuesP[cle(t)] === 1);
    return { PR, FT, actions, points, principes };
  }

  const autres = (obj, sauf, n) => melanger(Object.entries(obj).filter(([k]) => !sauf.includes(k)).flatMap(([, v]) => v)).slice(0, n);

  function questionsAdulte(theme) {
    const { PR, actions, points, principes } = banque;
    // Leurres : actions d'autres fiches, en écartant celles qui nomment leur propre situation.
    const leurres = Object.fromEntries(PR.map((x) => [x.id, actions[x.id].filter((y) => !y.trahit).map((y) => y.nu)]));
    const q = [];
    for (const p of PR.filter((x) => theme === 'tout' || x.id === theme)) {
      for (const a of actions[p.id]) {
        q.push({ fiche: p.id, texte: `Laquelle de ces actions fait partie de la conduite à tenir « ${p.title} »${a.cas ? `, cas « ${a.cas} »` : ''} ?`, bon: a.nu, choix: melanger([a.nu, ...autres(leurres, [p.id], 3)]) });
        if (!a.trahit) q.push({ fiche: p.id, texte: `« ${a.nu} » — à quelle situation correspond cette action ?`, bon: p.title, choix: melanger([p.title, ...melanger(PR.filter((x) => x.id !== p.id).map((x) => x.title)).slice(0, 3)]) });
      }
      for (const pr of principes[p.id]) q.push({ fiche: p.id, texte: `Quel est le principe d’action face à « ${p.title} » ?`, bon: pr, choix: melanger([pr, ...autres(principes, [p.id], 3)]) });
      for (const id of (LIES[p.id] || []).filter((x) => points[x] && points[x].length)) for (const pt of points[id]) {
        const ft = fiche(id);
        q.push({ fiche: id, texte: `Lequel de ces points clés concerne « ${ft.title} » ?`, bon: pt, choix: melanger([pt, ...autres(points, [id], 3)]) });
      }
    }
    return melanger(q).slice(0, 8);
  }

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
      return { situation: id, dessin: DESSINS[id], texte: `${s.label} : quel est le bon geste ?`, bon: g[0], choix: melanger([g[0], ...autres(APS.gestes, exclus, 3)]) };
    }));
  }

  const themes = () => jeune()
    ? [{ id: 'dessins', label: 'Reconnaître la situation', icon: '🖼️' }, { id: 'gestes', label: 'Les gestes que je sais faire', icon: '🤲' }, { id: 'numeros', label: 'Les numéros d’urgence', icon: '📞' }]
    : [...banque.PR.map((p) => ({ id: p.id, label: p.title })), { id: 'tout', label: 'Tout mélanger' }];
  const cleProgres = () => 'progres-' + (jeune() ? 'jeune' : 'grand');
  const progres = () => memo.lire(cleProgres(), { xp: 0, meilleurs: {} });

  // --- Passage de niveau : jeton qui tourne et confettis ---
  function feteNiveau(n) {
    const couleurs = ['#c8102e', '#f1c40f', '#3aa76d', '#4a90d9', '#9b6bd3'];
    const confettis = Array.from({ length: jeune() ? 36 : 14 }, (_, i) => `<i style="left:${Math.random() * 100}%;background:${couleurs[i % 5]};animation-delay:${(Math.random() * 0.8).toFixed(2)}s;animation-duration:${(1.8 + Math.random() * 1.4).toFixed(2)}s"></i>`).join('');
    const d = document.createElement('div');
    d.className = 'fete';
    d.innerHTML = `<div class="confettis">${confettis}</div><div class="carton" role="dialog" aria-label="Niveau ${n} atteint">${jeton(n)}
      <p class="grand">Niveau ${n} !</p>${jeune() ? `<p>Tu deviens <b>${titreNiveau(n)}</b></p>` : '<p>Continuez, chaque révision compte.</p>'}
      <button class="btn" id="fermerFete">Continuer</button></div>`;
    document.body.append(d);
    d.querySelector('#fermerFete').addEventListener('click', () => d.remove());
    d.querySelector('#fermerFete').focus();
  }
  window.__feteNiveau = feteNiveau; // pour les tests

  window.vueFormation = function () {
    banque ||= construire();
    titre('Se former', false);
    const p = progres(), niveau = niveauDe(p.xp), reste = p.xp % xpNiveau(), pct = Math.round(100 * reste / xpNiveau());
    vue.innerHTML = `<div class="niveau avecJeton">${jeton(niveau)}<div><b>Niveau ${niveau}</b>${jeune() ? ` · ${titreNiveau(niveau)}` : ''}<br><small>${p.xp} XP</small>
        <div class="barre"><i style="width:${pct}%"></i></div><small>Encore ${xpNiveau() - reste} XP avant le niveau ${niveau + 1}. Une bonne réponse = ${XP_PAR_REPONSE} XP.</small></div></div>
      <h2 class="section">${jeune() ? 'Choisis ta mission' : 'Choisir un thème'}</h2>
      ${jeune()
        ? `<div class="grille">${themes().map((t) => `<a class="tuile mission" href="#/quiz/${t.id}"><i>${t.icon}</i>${esc(t.label)}${etoiles(p.meilleurs[t.id])}</a>`).join('')}</div>`
        : `<ul class="liste">${themes().map((t) => { const m = p.meilleurs[t.id]; return `<li><a href="#/quiz/${t.id}"><span>${esc(t.label)}</span><small>${m ? `${m[0]}/${m[1]} ` : ''}${etoiles(m)}</small></a></li>`; }).join('')}</ul>`}
      <p class="source">Les questions et les réponses sont tirées des textes officiels, sans réécriture. Ce module aide à réviser : il ne remplace pas une formation avec un formateur.</p>`;
    scrollTo(0, 0);
  };

  window.vueQuiz = function (theme) {
    banque ||= construire();
    const t = themes().find((x) => x.id === theme);
    if (!t) return vueFormation();
    const questions = jeune() ? questionsJeune(theme) : questionsAdulte(theme);
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
        $('#suite').innerHTML = `<p class="retour">${juste ? `<span class="gain">+${XP_PAR_REPONSE} XP</span> ✔ Bonne réponse` : '✘ Ce n’est pas ça : la bonne réponse est en vert.'}${lien ? ` · <a href="${lien}">Revoir la fiche</a>` : ''}</p>
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
