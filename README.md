# Nuxt Application

## Description

Cette application est construite avec Nuxt, Tailwind CSS et utilise WebSocket pour la communication en temps réel. Elle
comprend une page de connexion stylisée et une fonctionnalité de chat en temps réel.

## Prérequis

- Node.js (version 16 ou supérieure)
- pnpm (version 9.15.1 ou supérieure)

## Installation

1. Clonez le dépôt :
    ```bash
    git clone <URL_DU_DEPOT>
    cd <NOM_DU_DEPOT>
    ```

2. Installez les dépendances :
    ```bash
    pnpm install
    ```

## Démarrage

Pour démarrer l'application en mode développement :

```bash
pnpm dev
```

Pour construire l'application pour la production :

```bash
pnpm build
```

Pour prévisualiser l'application de production :

```bash
pnpm preview
```

## Fonctionnalités

- **Page de connexion** : Utilise NuxtUI et Tailwind CSS pour un design moderne et réactif.
- **Chat en temps réel** : Utilise WebSocket pour la communication en temps réel entre les utilisateurs.

## Structure du projet

- `pages/index.vue` : Contient le formulaire de connexion.
- `server/ws/server.js` : Gère les connexions WebSocket et la communication en temps réel.
- `package.json` : Liste les dépendances et les scripts de l'application.

## Scripts

- `pnpm dev` : Démarre l'application en mode développement.
- `pnpm build` : Construit l'application pour la production.
- `pnpm preview` : Prévisualise l'application de production.
- `pnpm socket` : Démarre le serveur WebSocket.

## Dépendances principales

- `nuxt` : Framework Vue.js pour le rendu côté serveur.
- `tailwindcss` : Framework CSS utilitaire.
- `@nuxt/ui` : Composants UI pour Nuxt.
- `ws` : Bibliothèque WebSocket pour Node.js.
- `prisma` : ORM pour Node.js et TypeScript.

## Développement

Pour contribuer au développement de cette application, veuillez suivre les étapes ci-dessous :

1. Forkez le dépôt.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalité`).
3. Commitez vos modifications (`git commit -am 'Ajoute une nouvelle fonctionnalité'`).
4. Poussez votre branche (`git push origin feature/ma-fonctionnalité`).
5. Ouvrez une Pull Request.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE]() pour plus de détails.

Auteur: `@CyrilleSaga`