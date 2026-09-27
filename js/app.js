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

const defaultProfiles = [
  {
    name: 'Amélie Renaud',
    experience: 'Senior',
    text: `Amélie Renaud - Développeuse front-end
    Expérience : 4 ans en développement web front-end
    Compétences : HTML, CSS, JavaScript, React, TypeScript, UX design, intégration d'API, gestion de projet, communication.
    Accueil des utilisateurs, tests unitaires, responsive design et collaboration avec les équipes design et produit.`
  },
  {
    name: 'Nicolas Martin',
    experience: 'Mid-level',
    text: `Nicolas Martin - Développeur web
    Expérience : 2 ans en développement front-end
    Compétences : HTML, CSS, JavaScript, Git, SQL, API, responsive design.
    Connaissance de la gestion de projet et des principes d'accessibilité.`
  },
  {
    name: 'Sarah Benali',
    experience: 'Junior',
    text: `Sarah Benali - Assistante UX/UI
    Expérience : 1 an en design produit et web
    Compétences : UX design, UI design, communication, créativité, Figma, HTML, CSS.
    Intérêt pour le design centré utilisateur et la collaboration avec les équipes de développement.`
  }
];

const state = {
  results: []
};

function normalizeText(value) {
  return value.toLowerCase().replace(/[^a-z0-9à-ÿ\s]/g, ' ');
}

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

function computeCandidateResult(candidateName, cvText, requiredSkills) {
  const candidateSkills = extractSkillsFromText(cvText);
  const matchedSkills = requiredSkills.filter((skill) => candidateSkills.includes(skill));
  const missingSkills = requiredSkills.filter((skill) => !candidateSkills.includes(skill));
  const score = requiredSkills.length
    ? Math.min(100, Math.round((matchedSkills.length / requiredSkills.length) * 100))
    : 0;

  return {
    name: candidateName,
    score,
    matchedSkills,
    missingSkills,
    experience: extractExperienceLevel(cvText),
    candidateSkills
  };
}

function getRequiredSkillsFromJob(jobText) {
  const skills = extractSkillsFromText(jobText);

  if (skills.length === 0) {
    return [
      'HTML',
      'CSS',
      'JavaScript',
      'React',
      'API',
      'Gestion de projet',
      'Communication'
    ];
  }

  return skills;
}

function setSummary(results) {
  const summaryContainer = document.getElementById('resultSummary');
  if (!summaryContainer) return;

  const bestCandidate = results.reduce((best, candidate) => {
    return candidate.score > best.score ? candidate : best;
  }, results[0] || { score: 0, name: 'Aucun candidat' });

  const averageScore = results.length
    ? Math.round(results.reduce((sum, candidate) => sum + candidate.score, 0) / results.length)
    : 0;

  summaryContainer.innerHTML = `
    <div class="summary-card">
      <div class="metric">${results.length}</div>
      <span>Candidats analysés</span>
    </div>
    <div class="summary-card">
      <div class="metric">${averageScore}%</div>
      <span>Score moyen</span>
    </div>
    <div class="summary-card">
      <div class="metric">${bestCandidate.score}%</div>
      <span>Meilleur profil : ${bestCandidate.name}</span>
    </div>
  `;
}

function renderResults(results) {
  const candidateGrid = document.getElementById('candidateGrid');
  if (!candidateGrid) return;

  if (!results.length) {
    candidateGrid.innerHTML = `
      <div class="empty-state">
        <h3>Aucun résultat pour le moment.</h3>
        <p>Saisissez une offre d’emploi, ajoutez un ou plusieurs CV puis lancez l’analyse.</p>
      </div>
    `;
    setSummary([]);
    return;
  }

  candidateGrid.innerHTML = results
    .map((candidate) => {
      const matchedList = candidate.matchedSkills.length
        ? candidate.matchedSkills
        : ['Aucune correspondance'];
      const missingList = candidate.missingSkills.length
        ? candidate.missingSkills
        : ['Aucune compétence manquante'];

      return `
        <article class="candidate-card">
          <div class="candidate-header">
            <div class="candidate-name">${candidate.name}</div>
            <span class="score-badge">${candidate.score}%</span>
          </div>

          <div class="level">
            <span class="dot"></span>
            <span>Niveau : ${candidate.experience}</span>
          </div>

          <div class="match-progress">
            <span style="width: ${candidate.score}%"></span>
          </div>

          <div class="skills-block">
            <div class="skills-header">Compétences correspondantes</div>
            <div class="skill-list">
              ${matchedList
                .map((skill) => `<span class="skill-pill match">${skill}</span>`)
                .join('')}
            </div>
          </div>

          <div class="skills-block">
            <div class="skills-header">Compétences manquantes</div>
            <div class="skill-list">
              ${missingList
                .map((skill) => `<span class="skill-pill missing">${skill}</span>`)
                .join('')}
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  setSummary(results);
}

function analyzeJobAndCVs() {
  const jobDescription = document.getElementById('jobDescription').value.trim();
  const cvTextValue = document.getElementById('cvText').value.trim();
  const files = Array.from(document.getElementById('cvFiles').files || []);

  if (!jobDescription) {
    alert('Veuillez saisir une offre d’emploi avant de lancer l’analyse.');
    return;
  }

  const requiredSkills = getRequiredSkillsFromJob(jobDescription);
  const results = [];

  const addResult = (name, text) => {
    const result = computeCandidateResult(name, text, requiredSkills);
    results.push(result);
  };

  if (files.length > 0) {
    const fileReaders = files.map((file) => {
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        return file.text().then((content) => {
          addResult(file.name.replace(/\.[^/.]+$/, ''), content);
        });
      }
      return Promise.resolve();
    });

    Promise.all(fileReaders).then(() => {
      if (cvTextValue) {
        addResult('CV saisi manuellement', cvTextValue);
      }

      if (!results.length) {
        alert('Aucun CV valide détecté. Veuillez ajouter des fichiers texte ou coller le contenu du CV.');
        return;
      }

      state.results = results.sort((a, b) => b.score - a.score);
      renderResults(state.results);
    });
    return;
  }

  if (cvTextValue) {
    addResult('CV saisi manuellement', cvTextValue);
  }

  if (!results.length) {
    state.results = defaultProfiles.map((profile) => computeCandidateResult(profile.name, profile.text, requiredSkills));
  } else {
    state.results = results.sort((a, b) => b.score - a.score);
  }

  renderResults(state.results);
}

function runDemoData() {
  const requiredSkills = getRequiredSkillsFromJob(document.getElementById('jobDescription').value);
  const demoResults = defaultProfiles.map((profile) => {
    return computeCandidateResult(profile.name, profile.text, requiredSkills);
  });

  state.results = demoResults.sort((a, b) => b.score - a.score);
  renderResults(state.results);
}

function resetAll() {
  document.getElementById('jobDescription').value = `Nous recherchons un développeur front-end expérimenté en HTML, CSS, JavaScript, React, UX design et gestion de projet. Le candidat doit maîtriser le développement web responsive, les composants réutilisables, l’intégration d’API et le travail en équipe. Une bonne communication et une forte autonomie sont nécessaires.`;
  document.getElementById('cvText').value = `Amélie Renaud - Développeuse front-end

Expérience :
- 4 ans en développement web front-end
- Maîtrise HTML5, CSS3, JavaScript, React, TypeScript
- Création de sites responsive et accessibles
- Collaboration avec UX/UI et intégration d’API
- Gestion de projet et communication avec les équipes

Compétences : HTML, CSS, JavaScript, React, TypeScript, UX design, intégration d’API, gestion de projet, communication.

Niveau : Senior`;
  document.getElementById('cvFiles').value = '';
  runDemoData();
}

document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const resetBtn = document.getElementById('resetBtn');
  const jobAnalyzeBtn = document.getElementById('jobAnalyzeBtn');

  if (jobAnalyzeBtn) {
    jobAnalyzeBtn.addEventListener('click', () => {
      const jobText = document.getElementById('jobDescription').value.trim();
      if (!jobText) {
        alert('Veuillez renseigner l’offre d’emploi.');
        return;
      }
      const requiredSkills = getRequiredSkillsFromJob(jobText);
      const summary = requiredSkills.slice(0, 6).join(', ');
      alert(`Offre analysée. Compétences clés détectées : ${summary}`);
    });
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', analyzeJobAndCVs);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetAll);
  }

  runDemoData();
});
