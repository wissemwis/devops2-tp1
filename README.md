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

## Lancer avec Docker

Prérequis : Docker installé.

Construire l'image (build) :

```bash
docker build -t quizzo:1.0 .
```

Lancer le conteneur (run) :

```bash
docker run -d --name quizzo -p 3000:3000 quizzo:1.0   # http://localhost:3000
```

Si le port 3000 est déjà utilisé sur votre machine, changez le port côté hôte, par exemple `-p 8080:3000`.

Arrêter et supprimer le conteneur :

```bash
docker stop quizzo
docker rm quizzo
```

## Structure

- `app/layout.tsx` : layout racine (langue, métadonnées)
- `app/page.tsx` : page d'accueil
- `app/globals.css` : styles aux couleurs de la charte DevOps 2
- `components/DevOpsLoop.tsx` : boucle DevOps en SVG
- `docs/` : énoncés des TP
