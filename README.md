# eisenhower-tasks

# Matrice d'Eisenhower

Application de bureau minimaliste pour gérer vos tâches selon la matrice d'Eisenhower.

## Fonctionnalités

- ✨ Interface minimaliste et épurée
- 📝 Ajout rapide de tâches
- 🎯 Drag & drop intuitif vers les 4 quadrants
- 🎨 Code couleur automatique selon la priorité
- 📊 Liste priorisée en temps réel
- 💾 Sauvegarde automatique locale
- 🖥️ Multi-plateforme (macOS, Windows, Linux)

## Les 4 quadrants

1. **Urgent & Important** (Rouge) - À faire immédiatement
2. **Important & Non urgent** (Bleu) - À planifier
3. **Urgent & Non important** (Orange) - À déléguer
4. **Non urgent & Non important** (Gris) - À éliminer

## Installation

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Étapes

1. Clonez ou téléchargez ce projet

2. Installez les dépendances :
```bash
npm install
```

## Utilisation

### Mode développement

Lancez l'application en mode développement :
```bash
npm start
```

### Build de l'application

#### Pour macOS :
```bash
npm run build:mac
```

L'application sera générée dans le dossier `dist/` au format .dmg et .zip

#### Pour Windows :
```bash
npm run build:win
```

Génère des installateurs .exe (NSIS) et version portable

#### Pour Linux :
```bash
npm run build:linux
```

Génère une AppImage et un package .deb

#### Build pour toutes les plateformes :
```bash
npm run build
```

## Utilisation de l'application

1. **Ajouter une tâche** : Tapez dans le champ en haut à gauche et cliquez sur "Ajouter" (ou appuyez sur Entrée)

2. **Classer une tâche** : Glissez-déposez la tâche depuis la colonne de gauche vers le quadrant approprié

3. **Voir vos priorités** : Consultez la colonne de droite pour voir toutes vos tâches triées par priorité

4. **Supprimer une tâche** : Cliquez sur le ✕ à droite de la tâche

5. **Raccourci clavier** : Cmd+N (Mac) ou Ctrl+N (Win/Linux) pour créer une nouvelle tâche

## Stockage des données

Les tâches sont automatiquement sauvegardées localement dans :
- macOS : `~/Library/Application Support/eisenhower-matrix/tasks.json`
- Windows : `%APPDATA%/eisenhower-matrix/tasks.json`
- Linux : `~/.config/eisenhower-matrix/tasks.json`

Aucune connexion internet n'est requise. Toutes vos données restent sur votre ordinateur.

## Structure du projet

```
eisenhower-matrix/
├── main.js           # Processus principal Electron
├── preload.js        # Script de préchargement sécurisé
├── index.html        # Interface utilisateur
├── styles.css        # Styles CSS
├── renderer.js       # Logique de l'application
├── package.json      # Configuration npm
└── README.md         # Ce fichier
```

## Technologies utilisées

- Electron - Framework pour applications de bureau
- Vanilla JavaScript - Pas de framework frontend
- CSS Grid & Flexbox - Layout responsive
- HTML5 Drag & Drop API - Interaction drag & drop native

## Licence

MIT

## Auteur

Créé avec ❤️ pour améliorer votre productivité