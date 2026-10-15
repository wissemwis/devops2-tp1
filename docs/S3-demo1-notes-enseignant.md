# Séance 3 — Démo 1 : conteneuriser Quizzo

Module DevOps 2 (ECUE733) · Séance 3 « Docker & Compose » · Document réservé à l'enseignant.

Durée : 20 à 25 min, en direct, au vidéoprojecteur. Les étudiants regardent, ils ne tapent pas : ils referont la même chose en TP.

## Message de la démo

> « Ça marche sur ma machine » → **« ça marche dans l'image »**. Une image se construit couche par couche, et l'ordre des couches décide de la vitesse et de la taille.

Trois versions du même Dockerfile, chacune corrige un défaut visible de la précédente :

| Version | Ce qu'on montre | Taille mesurée | Build mesuré |
|---|---|---|---|
| v1 « naïve » | Ça marche, mais 2,6 Go et un contexte de 570 Mo | 2,61 Go | ≈ 2 min 45 (1re fois, téléchargement de `node:22` compris) |
| v2 « cache » | `.dockerignore`, `npm ci` dans sa propre couche, image `alpine` | 1,21 Go | 66 s, puis **16 s** après une modification du code (`npm ci` en `CACHED`) |
| v3 « multi-étapes » | Étape build + étape d'exécution, utilisateur non root | **332 Mo** | ≈ 17 s (cache chaud) |

Mesures faites le 15/10/2026 avec Docker 29.8, Next.js 16.3.8, sur le dépôt tel quel. Elles varient avec le réseau, mais les rapports (÷ 2, puis ÷ 8) restent les mêmes.

Les fichiers prêts à l'emploi sont dans [`demo/seance3/`](../demo/seance3/) (plan B si la frappe en direct déraille).

## 1. Avant la séance

- [ ] Docker Desktop (ou Docker Engine) démarré : `docker version` affiche **Client et Server**.
- [ ] **Pré-télécharger les images de base, chez vous ou la veille** :
  ```bash
  docker pull node:22
  docker pull node:22-alpine
  ```
  En salle, tous les postes sortent par la même IP : Docker Hub limite les téléchargements anonymes et répond `429 Too Many Requests` (constaté en préparant cette démo). `node:22` pèse près de 1 Go, ne comptez pas sur le Wi-Fi de la salle.
- [ ] Faire tourner la démo une fois en entier pour remplir le cache, puis **vider uniquement le cache de build** pour que la v1 soit lente devant les étudiants :
  ```bash
  docker builder prune -f
  docker rmi quizzo:v1 quizzo:v2 quizzo:v3 2>/dev/null
  ```
  (Ne pas faire `docker system prune -a` : cela supprime aussi `node:22`.)
- [ ] Dans le clone du dépôt : `git switch main && git pull && npm install && npm run build`. Il **faut** que `node_modules/` et `.next/` existent : c'est ce qui rend le contexte de la v1 énorme.
- [ ] Ports 3000, 8080 et 8081 libres (pas de `npm run dev` oublié).
- [ ] Police du terminal agrandie (≥ 20 pt) et deux onglets : un pour les commandes, un pour `docker images` / `docker ps`.

## 2. Déroulé

| Minute | Étape | Ce qu'on tape | Ce qu'on fait remarquer |
|---|---|---|---|
| 0 – 2 | Le problème | `node -v` | « Quizzo exige Node ≥ 20.9. Combien d'entre vous avaient la bonne version en séance 1 ? » |
| 2 – 7 | v1 : premier Dockerfile | voir 3.1 | Chaque instruction = une couche. Le contexte envoyé : **570 Mo** |
| 7 – 10 | Lancer le conteneur | voir 3.2 | `-p 8080:3000` : port de la machine → port du conteneur |
| 10 – 14 | Le cache | voir 3.3 | Une phrase modifiée → tout `npm install` est rejoué |
| 14 – 19 | v2 : ordre des couches | voir 3.4 | `CACHED` sur `npm ci`, 16 s au lieu de 66 s |
| 19 – 24 | v3 : multi-étapes | voir 3.5 | 2,61 Go → 332 Mo, `whoami` → `node` |
| 24 – 25 | Transition vers le TP | — | « Vous allez faire la même chose, puis ajouter Compose » |

Si vous êtes en retard à la minute 14, montrez la v2 en une seule fois (fichier prêt) et gardez du temps pour la v3 : c'est elle que les étudiants doivent retenir.

## 3. Pas à pas

### 3.1 v1 : le Dockerfile naïf (minute 2)

Créer `Dockerfile` à la racine du dépôt **en le tapant** (ou `cp demo/seance3/Dockerfile.v1 Dockerfile`) :

```dockerfile
FROM node:22
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Commenter chaque ligne en une phrase : image de base, dossier de travail, copie, installation, build, port documenté, commande de démarrage.

```bash
docker build -t quizzo:v1 .
```

Pendant le build, montrer en haut de la sortie :

```
=> transferring context: 570.28MB
```

« Docker vient d'envoyer 570 Mo au moteur. Qu'est-ce qu'il y a de si gros dans le dossier ? » → `node_modules` (477 Mo) et `.next` (103 Mo), déjà ignorés par Git mais **pas par Docker**. On le corrigera en v2 ; ne pas le corriger maintenant.

Sous Windows / macOS, le `node_modules` copié contient en plus des binaires compilés pour l'hôte : ici `npm install` les remplace, mais c'est une source classique de bugs. À citer, pas à démontrer.

### 3.2 Lancer le conteneur (minute 7)

```bash
docker run -d --name quizzo -p 8080:3000 quizzo:v1
docker ps
docker logs quizzo
```

Ouvrir <http://localhost:8080> : la page d'accueil de Quizzo s'affiche.

Points à faire dire aux étudiants :
- les logs disent `http://localhost:3000`, mais on ouvre **8080** : c'est le `-p hôte:conteneur` ;
- `EXPOSE` ne publie rien, il documente ; sans `-p`, la page est injoignable (le montrer si le temps le permet : `docker run -d --name test quizzo:v1` puis `docker ps`, colonne PORTS).

```bash
docker images quizzo        # 2.61GB
docker rm -f quizzo
```

« 2,6 Go pour une page d'accueil. Retenez ce chiffre. »

### 3.3 Le cache (minute 10)

Modifier une phrase dans `app/page.tsx` (par exemple « Éditeur simple » → « Éditeur très simple »), puis :

```bash
docker build -t quizzo:v1 .
```

Faire lire la sortie : `COPY . .` a changé, donc **toutes les couches suivantes** sont reconstruites, y compris `npm install`. Une phrase modifiée = toutes les dépendances retéléchargées.

Question à la salle : « Quels fichiers décident vraiment s'il faut relancer `npm install` ? » → `package.json` et `package-lock.json`.

### 3.4 v2 : `.dockerignore` et ordre des couches (minute 14)

Créer `.dockerignore` à la racine (ou `cp demo/seance3/dockerignore .dockerignore`) :

```
node_modules
.next
.git
*.md
Dockerfile*
.dockerignore
```

Modifier le `Dockerfile` (ou `cp demo/seance3/Dockerfile.v2 Dockerfile`) :

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Trois changements, à annoncer avant de lancer :
1. `alpine` : image de base beaucoup plus petite ;
2. `package*.json` copiés **avant** le code, puis `npm ci` (installation exacte du `package-lock.json`, faite pour les builds automatisés) ;
3. `.dockerignore` : le contexte tombe de 570 Mo à quelques Ko.

```bash
docker build -t quizzo:v2 .      # ≈ 66 s
```

Remodifier une phrase dans `app/page.tsx`, puis relancer :

```bash
docker build -t quizzo:v2 .      # ≈ 16 s
```

Montrer dans la sortie :

```
=> CACHED [3/6] COPY package.json package-lock.json ./
=> CACHED [4/6] RUN npm ci
```

```bash
docker images quizzo        # v2 : 1.21GB
```

« Plus rapide, deux fois plus petit… mais 1,2 Go, c'est encore beaucoup. Qu'y a-t-il dans l'image dont on n'a **pas besoin** pour faire tourner le site ? » → le compilateur TypeScript, les sources, les dépendances de dev, le cache de build.

### 3.5 v3 : build multi-étapes (minute 19)

Une seule ligne à ajouter dans `next.config.ts` : Next.js produit alors un serveur autonome dans `.next/standalone`, avec uniquement les dépendances nécessaires à l'exécution.

```ts
const nextConfig: NextConfig = {
  output: "standalone",
};
```

Puis le `Dockerfile` (ou `cp demo/seance3/Dockerfile.v3 Dockerfile`) :

```dockerfile
# Étape 1 : construire l'application
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : image d'exécution, sans les outils de build
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t quizzo:v3 .
docker run -d --name quizzo -p 8081:3000 quizzo:v3
docker exec quizzo whoami      # node
docker images quizzo
```

Ouvrir <http://localhost:8081> : la page s'affiche **avec ses styles**.

Finir sur le tableau des tailles, à l'écran :

```
REPOSITORY   TAG   SIZE
quizzo       v3    332MB
quizzo       v2    1.21GB
quizzo       v1    2.61GB
```

Points clés :
- seule la **dernière étape** part dans l'image finale ; l'étape `build` sert puis disparaît ;
- `USER node` : le processus ne tourne plus en root dans le conteneur (bonne pratique de sécurité, à rappeler au TP) ;
- moins de contenu = moins à télécharger au déploiement et moins de failles potentielles.

### 3.6 Remise à zéro après la démo

```bash
docker rm -f quizzo test 2>/dev/null
git restore app/page.tsx next.config.ts
rm Dockerfile .dockerignore
```

Ne rien pousser : le Dockerfile est l'objet du TP.

## 4. Si ça casse

| Symptôme | Cause | Réaction |
|---|---|---|
| `Cannot connect to the Docker daemon` | Docker Desktop pas démarré | Le lancer, attendre l'icône « running » (≈ 30 s) |
| `429 Too Many Requests` au `FROM` | Limite Docker Hub (IP partagée de la salle) | Images pré-téléchargées (section 1). Sinon, attendre 30 s et relancer |
| `bind: address already in use` | Port 8080 ou 8081 déjà pris | Changer le port de gauche : `-p 8090:3000` |
| v3 : page sans styles | Ligne `COPY … .next/static` oubliée | Bon exemple de « l'image ne contient que ce qu'on y copie » : l'ajouter en direct |
| v3 : `Cannot find module '/app/server.js'` | `output: "standalone"` absent de `next.config.ts` | Ajouter la ligne, reconstruire |
| `npm ci` échoue (« lock file out of sync ») | `package-lock.json` modifié localement | `git restore package-lock.json` |
| Le build de la v1 est rapide | Cache encore présent | Montrer quand même le contexte de 570 Mo ; passer plus vite sur la lenteur |

## 5. Transition vers la suite de la séance

- Écrire le Dockerfile de Quizzo est l'objet du TP : les étudiants refont le chemin v1 → v3 sur leur fork (à ajuster selon l'énoncé du TP3).
- Annonce pour la démo suivante : « Quizzo, c'est aussi une API Strapi et une base PostgreSQL. Trois conteneurs à lancer et à relier : c'est le rôle de **Docker Compose**. »
