# Quizzo — projet fil rouge DevOps 2




**Quizzo** est une application de questionnaires en ligne : création, diffusion et collecte des réponses. C'est le projet fil rouge du module DevOps 2 (ECUE733). Il évolue de séance en séance : gestion de projet, travail collaboratif avec Git, puis conteneurs, intégration et déploiement continus.

Ce dépôt est le **point de départ** : une application Next.js (App Router, TypeScript) qui contient seulement une page d'accueil.

## Séance 1 — TP1

👉 **Énoncé : [docs/TP1-enonce.md](docs/TP1-enonce.md)**

Ne clonez pas ce dépôt directement. Le membre A du binôme le **forke**, puis A et B clonent ce fork. Tout est détaillé dans l'énoncé.

## Lancer le projet

Prérequis : Node.js 20.9 ou plus.

```bash
npm install
npm run dev     # http://localhost:3000
```

Build de production :

```bash
npm run build
npm start
```

## Structure

- `app/layout.tsx` : layout racine (langue, métadonnées)
- `app/page.tsx` : page d'accueil
- `app/globals.css` : styles aux couleurs de la charte DevOps 2
- `components/DevOpsLoop.tsx` : boucle DevOps en SVG
- `docs/` : énoncés des TP
