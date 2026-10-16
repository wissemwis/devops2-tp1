# Image de base : Node.js 22 (version LTS) sur Alpine, légère
FROM node:22-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie des fichiers de dépendances en premier pour profiter du cache Docker
COPY package*.json ./
RUN npm install

# Copie du reste du code source puis build de production Next.js
COPY . .
RUN npm run build

# Port d'écoute de l'application
EXPOSE 3000

# Démarrage du serveur Next.js en mode production
CMD ["npm", "start"]
