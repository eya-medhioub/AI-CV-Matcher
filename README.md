# AI CV Matcher

## Présentation

**AI CV Matcher** est une application web client-side qui aide à comparer plusieurs CV avec une offre d'emploi. Elle présente les résultats sous forme de cartes ou de tableau afin de faciliter l'analyse des profils.

Ce projet a été réalisé dans un cadre universitaire en utilisant uniquement HTML, CSS et JavaScript.

## Objectif

L'objectif est de fournir un outil simple d'aide au recrutement capable de :

- analyser le texte d'une offre d'emploi ;
- détecter les compétences recherchées ;
- ajouter plusieurs candidats ;
- comparer les compétences de chaque CV avec l'offre ;
- calculer un score de correspondance indicatif ;
- afficher les compétences correspondantes et manquantes ;
- comparer le niveau d'expérience ;
- présenter clairement les résultats dans un dashboard.

Le score est un indicateur d'aide à l'analyse. Il ne constitue pas une décision automatique de recrutement.

## Fonctionnalités

- Saisie d'une offre d'emploi.
- Détection des compétences à partir d'un dictionnaire de mots-clés et d'alias.
- Ajout de plusieurs candidats avec leur nom et le texte de leur CV.
- Suppression d'un candidat avant l'analyse.
- Calcul du score de chaque candidat.
- Affichage des compétences correspondantes.
- Affichage des compétences manquantes.
- Détection indicative du niveau d'expérience : Junior, Mid-level ou Senior.
- Classement des candidats par score décroissant.
- Dashboard sous forme de cartes.
- Vue tableau pour comparer les candidats côte à côte.
- Résumé avec le nombre de candidats, le score moyen et le meilleur profil.
- Interface responsive pour ordinateur, tablette et mobile.
- Réinitialisation de l'analyse.

## Technologies utilisées

- HTML5
- CSS3
- JavaScript vanilla (sans framework)
- DOM API du navigateur
- Google Fonts pour la typographie Inter

Aucun backend, aucune base de données et aucun framework JavaScript ne sont utilisés.

## AI Tool utilisé

GitHub Copilot

## Comment Copilot a été utilisé

- Génération de la structure
- Génération du HTML
- Génération du CSS
- Génération du JavaScript
- Correction des erreurs
- Amélioration de l'interface

Copilot a notamment été utilisé pour proposer l'organisation des fichiers, générer les composants de l'interface, écrire la logique de comparaison, corriger des erreurs de syntaxe et améliorer la présentation responsive du dashboard.

## Résultats

L'application permet d'obtenir rapidement une comparaison lisible de plusieurs candidats pour une même offre d'emploi. Pour chaque candidat, l'utilisateur peut consulter :

- son nom ;
- son score de correspondance ;
- son niveau d'expérience ;
- les compétences correspondantes ;
- les compétences manquantes.

Les profils sont classés automatiquement selon leur score et peuvent être consultés dans une vue par cartes ou dans un tableau comparatif.

## Limites

- L'analyse repose sur des mots-clés prédéfinis et non sur une compréhension complète du langage naturel.
- Le score est indicatif et ne remplace pas l'évaluation humaine.
- Le niveau d'expérience est détecté à partir d'expressions simples comme « junior », « senior » ou « 3 ans ».
- Les fichiers PDF et Word ne sont pas analysés directement ; le texte du CV doit être copié dans l'application.
- Les données sont conservées uniquement en mémoire pendant la session et peuvent être perdues lors du rechargement de la page.
- Les compétences spécialisées absentes du dictionnaire peuvent ne pas être détectées.
- L'application ne fournit ni authentification ni gestion multi-utilisateur.

## Conclusion

**AI CV Matcher** est un prototype pédagogique qui montre comment créer une application d'aide au recrutement avec des technologies web fondamentales. L'utilisation de GitHub Copilot a facilité la génération de la structure, l'implémentation des fonctionnalités, la correction des erreurs et l'amélioration de l'interface.

L'application constitue une base évolutive pour de futures améliorations, comme l'analyse de fichiers PDF, la sauvegarde des résultats, l'ajout de graphiques ou l'intégration d'un véritable service d'analyse sémantique.
