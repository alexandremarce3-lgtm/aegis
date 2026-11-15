/* Partagé entre l'appli et l'outil qui fabrique les fichiers audio : même identifiant, même texte lu. */
(() => {
  // Le texte lu est celui affiché ; seuls la ponctuation de liste et les sigles sont adaptés pour l'oreille.
  window.pourOreille = (t) => t.replace(/\s*;/g, '.').replace(/\s*:\s*$/g, '.').replace(/\bRCP\b/g, 'R C P').replace(/\bDAE\b/g, 'D A E').replace(/\bPLS\b/g, 'P L S').replace(/\bLVA\b/g, 'L V A');
  // Identifiant d'une phrase : empreinte de son texte exact (FNV-1a, 32 bits). Si le texte change, l'audio n'est plus utilisé.
  window.idVoix = (t) => { let h = 0x811c9dc5; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(16).padStart(8, '0'); };
})();
