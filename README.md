# AI CV Matcher

Application web simple en HTML, CSS et JavaScript pour comparer les compétences d’un candidat avec celles d’une offre d’emploi.

## Fonctionnalités

- Saisie d’une offre d’emploi
- Import de plusieurs CV (fichiers texte)
- Analyse des compétences par mots-clés
- Calcul d’un score de correspondance
- Affichage des compétences correspondantes et manquantes
- Dashboard moderne et responsive
- Stockage local dans le navigateur (optionnel via JavaScript)

## Structure du projet

- `index.html` : page principale
- `css/styles.css` : styles du design
- `js/app.js` : logique métier et rendu interface

## Lancer le projet

Ouvrez simplement le fichier `index.html` dans votre navigateur.

Pour un environnement local plus fluide, vous pouvez aussi lancer un petit serveur local :

```bash
python3 -m http.server 8000
```

Puis ouvrez :

```text
http://localhost:8000
```

## Remarque

L’outil fonctionne avec des CV en texte, ou avec un contenu copié-collé dans la zone dédiée. Il s’agit d’une version statique et pédagogique, adaptée à un projet universitaire.
