// ---------------------------------------------------------
// AI CV Matcher - logique de comparaison offre CV
// ---------------------------------------------------------
// Ce fichier contient les fonctions principales pour :
// - lire le texte de l'offre et du CV
// - détecter les compétences présentes
// - comparer les compétences
// - comparer l'expérience
// - calculer un score indicatif
// - afficher les résultats dans le dashboard

// ---------------------------------------------------------
// 1) Dictionnaire des compétences
// ---------------------------------------------------------
// Il contient les compétences les plus courantes dans les offres
// et les CV. Une compétence peut avoir plusieurs variantes.
const skillDictionary = [
  { label: 'HTML', aliases: ['html', 'html5', 'markup'] },
  { label: 'CSS', aliases: ['css', 'css3', 'sass', 'less', 'flexbox', 'grid'] },
  { label: 'JavaScript', aliases: ['javascript', 'js', 'ecmascript', 'es6'] },
  { label: 'React', aliases: ['react', 'reactjs', 'components', 'redux'] },
  { label: 'TypeScript', aliases: ['typescript', 'ts', 'typed javascript'] },
  { label: 'Node.js', aliases: ['node', 'node.js', 'nodejs', 'express'] },
  { label: 'Python', aliases: ['python', 'django', 'flask'] },
  { label: 'SQL', aliases: ['sql', 'mysql', 'postgresql', 'database', 'base de données'] },
  { label: 'UX Design', aliases: ['ux', 'ux design', 'user experience', 'wireframe', 'prototype'] },
  { label: 'UI Design', aliases: ['ui', 'ui design', 'interface', 'design system', 'figma'] },
  { label: 'Gestion de projet', aliases: ['gestion de projet', 'project management', 'scrum', 'agile', 'kanban'] },
  { label: 'Communication', aliases: ['communication', 'client communication', 'présentation', 'presentation'] },
  { label: 'API', aliases: ['api', 'rest api', 'integration api', 'web services'] },
  { label: 'Responsive Design', aliases: ['responsive design', 'responsive', 'mobile first', 'adaptatif'] },
  { label: 'Accessibilité', aliases: ['accessibilite', 'accessibility', 'a11y', 'wcag'] },
  { label: 'Git', aliases: ['git', 'github', 'gitlab', 'version control'] },
  { label: 'Test Unitaire', aliases: ['test unitaire', 'unit tests', 'jest', 'testing'] },
  { label: 'Analyse de données', aliases: ['analyse de données', 'data analysis', 'tableau', 'power bi'] },
  { label: 'Leadership', aliases: ['leadership', 'lead', 'management', 'encadrement'] },
  { label: 'Créativité', aliases: ['créativité', 'creativite', 'innovation', 'brainstorming'] }
];

// ---------------------------------------------------------
// 2) Fonction : normaliser le texte
// ---------------------------------------------------------
// Cette fonction transforme le texte pour faciliter les comparaisons.
// On le met en minuscules, on enlève les accents, et on supprime
// les caractères spéciaux inutiles.
function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9à-ÿ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------
// 3) Fonction : extraire les compétences d'un texte
// ---------------------------------------------------------
// On parcourt les compétences du dictionnaire et on vérifie si elles
// apparaissent dans le texte. Une compétence peut avoir plusieurs variantes.
function extractSkillsFromText(text) {
  const normalized = normalizeText(text);
  const matches = new Set();

  skillDictionary.forEach((skill) => {
    const aliases = [skill.label, ...skill.aliases];
    const found = aliases.some((alias) => {
      const cleanAlias = normalizeText(alias);
      return normalized.includes(cleanAlias);
    });

    if (found) {
      matches.add(skill.label);
    }
  });

  return Array.from(matches);
}

// ---------------------------------------------------------
// 4) Fonction : extraire l'expérience depuis un texte
// ---------------------------------------------------------
// On cherche des indices comme :
// - 3 ans
// - Senior
// - Junior
// - Mid-level
function extractExperienceLevel(text) {
  const normalized = normalizeText(text);

  if (normalized.includes('senior') || normalized.includes('experimente') || normalized.includes('lead')) {
    return 'Senior';
  }

  if (normalized.includes('junior') || normalized.includes('débutant') || normalized.includes('beginner')) {
    return 'Junior';
  }

  if (normalized.includes('mid') || normalized.includes('intermediaire') || normalized.includes('middle')) {
    return 'Mid-level';
  }

  const yearMatch = normalized.match(/(\d+)\s*(ans|years?|annees?|yr|y)/);
  if (yearMatch) {
    const value = Number(yearMatch[1]);
    if (value >= 5) return 'Senior';
    if (value >= 2) return 'Mid-level';
    return 'Junior';
  }

  return 'Expérience non précisée';
}

// ---------------------------------------------------------
// 5) Fonction : comparer les compétences
// ---------------------------------------------------------
// On compare les compétences demandées par l'offre et celles présentes
// dans le CV. Cela permet de savoir ce qui correspond et ce qui manque.
function compareSkills(requiredSkills, candidateSkills) {
  const matchedSkills = requiredSkills.filter((skill) => candidateSkills.includes(skill));
  const missingSkills = requiredSkills.filter((skill) => !candidateSkills.includes(skill));

  return { matchedSkills, missingSkills };
}

// ---------------------------------------------------------
// 6) Fonction : comparer l'expérience demandée et l'expérience du candidat
// ---------------------------------------------------------
// On compare le niveau d'expérience mentionné dans l'offre et dans le CV.
// L'objectif est d'aider à l'analyse, pas de décider automatiquement.
function compareExperience(requiredText, candidateText) {
  const requiredExp = extractExperienceLevel(requiredText);
  const candidateExp = extractExperienceLevel(candidateText);

  const order = ['Junior', 'Mid-level', 'Senior'];
  const requiredIndex = order.indexOf(requiredExp);
  const candidateIndex = order.indexOf(candidateExp);

  const compatible = candidateIndex >= requiredIndex;

  return {
    status: compatible ? 'Expérience compatible' : 'Expérience insuffisante',
    required: requiredExp,
    candidate: candidateExp,
    compatible
  };
}

// ---------------------------------------------------------
// 7) Fonction : calculer le score de correspondance
// ---------------------------------------------------------
// Le score est un indicateur d'aide à l'analyse.
// Il n'est pas une décision automatique de recrutement.
function calculateMatchScore(requiredSkills, candidateSkills, experienceMatch) {
  const totalSkills = requiredSkills.length || 1;
  const ratio = (candidateSkills.filter((skill) => requiredSkills.includes(skill)).length / totalSkills) * 100;

  let score = Math.round(ratio);

  if (experienceMatch.compatible) {
    score += 10;
  }

  if (candidateSkills.length > requiredSkills.length) {
    score += 5;
  }

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  return score;
}

// ---------------------------------------------------------
// 8) Fonction principale : analyse complète de l'offre et du CV
// ---------------------------------------------------------
function analyzeCVMatch(jobDescription, cvText) {
  const requiredSkills = extractSkillsFromText(jobDescription);
  const candidateSkills = extractSkillsFromText(cvText);
  const comparison = compareSkills(requiredSkills, candidateSkills);
  const experienceComparison = compareExperience(jobDescription, cvText);
  const score = calculateMatchScore(requiredSkills, candidateSkills, experienceComparison);

  return {
    requiredSkills,
    candidateSkills,
    matchedSkills: comparison.matchedSkills,
    missingSkills: comparison.missingSkills,
    experience: experienceComparison,
    score,
    interpretation: `Indicateur d'aide à l'analyse et non une décision automatique de recrutement.`
  };
}

// ---------------------------------------------------------
// 9) Fonction : afficher les résultats du dashboard
// ---------------------------------------------------------
// Cette fonction met à jour le DOM pour afficher les résultats de l'analyse.
// CORRECTION : utilise #candidateGrid au lieu de #resultPanel
function displayMatchResults(resultData) {
  const candidateGrid = document.getElementById('candidateGrid');

  if (!candidateGrid) {
    console.error('Conteneur #candidateGrid introuvable.');
    return;
  }

  const matchedHTML = resultData.matchedSkills.length
    ? resultData.matchedSkills.map((skill) => `<span class="skill-pill match">${skill}</span>`).join('')
    : `<span class="skill-pill missing">Aucune compétence correspondante</span>`;

  const missingHTML = resultData.missingSkills.length
    ? resultData.missingSkills.map((skill) => `<span class="skill-pill missing">${skill}</span>`).join('')
    : `<span class="skill-pill match">Aucune compétence manquante</span>`;

  // Affichage dans une seule carte pour l'analyse CV/Offre
  candidateGrid.innerHTML = `
    <article class="candidate-card">
      <div class="candidate-header">
        <div class="candidate-name">Résultat de l'analyse</div>
        <span class="score-badge">${resultData.score}%</span>
      </div>

      <div class="level">
        <span class="dot"></span>
        <span>${resultData.experience.status}</span>
      </div>

      <div class="match-progress">
        <span style="width: ${resultData.score}%"></span>
      </div>

      <div class="skills-block">
        <div class="skills-header">Compétences correspondantes</div>
        <div class="skill-list">
          ${matchedHTML}
        </div>
      </div>

      <div class="skills-block">
        <div class="skills-header">Compétences manquantes</div>
        <div class="skill-list">
          ${missingHTML}
        </div>
      </div>

      <p style="font-size: 0.85rem; color: var(--text-soft); margin-top: 16px; border-top: 1px solid var(--border); padding-top: 12px;">
        ℹ️ ${resultData.interpretation}
      </p>
    </article>
  `;
}

// ---------------------------------------------------------
// 10) Événement : bouton "Analyser le CV"
// ---------------------------------------------------------
// Quand l'utilisateur clique sur le bouton, on récupère le texte
// de l'offre et du CV, puis on lance l'analyse.
document.addEventListener('DOMContentLoaded', function () {
  const analyzeBtn = document.getElementById('analyzeBtn');

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', function () {
      // Récupère les textes des champs
      const jobDescription = document.getElementById('jobDescription')?.value || '';
      const cvText = document.getElementById('cvText')?.value || '';

      // Vérifie que les deux champs sont remplis
      if (!jobDescription.trim() || !cvText.trim()) {
        alert('Veuillez saisir l\'offre d\'emploi ET le texte du CV.');
        return;
      }

      // Lance l'analyse
      const result = analyzeCVMatch(jobDescription, cvText);
      
      // Affiche les résultats dans le dashboard
      displayMatchResults(result);
      
      // Scroll vers la section des résultats
      document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    });
  }
});
