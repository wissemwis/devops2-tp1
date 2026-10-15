# Séance 3 — fichiers de la démo 1

Fichiers prêts à l'emploi pour la démo « conteneuriser Quizzo » (plan B si la frappe en direct déraille). Déroulé complet : [docs/S3-demo1-notes-enseignant.md](../../docs/S3-demo1-notes-enseignant.md).

| Fichier | Copie à faire à la racine du dépôt |
|---|---|
| `Dockerfile.v1` | `cp demo/seance3/Dockerfile.v1 Dockerfile` |
| `Dockerfile.v2` | `cp demo/seance3/Dockerfile.v2 Dockerfile` et `cp demo/seance3/dockerignore .dockerignore` |
| `Dockerfile.v3` | `cp demo/seance3/Dockerfile.v3 Dockerfile`, plus `output: "standalone"` dans `next.config.ts` |

Le fichier s'appelle `dockerignore` (sans point) pour ne pas s'appliquer tant qu'il n'est pas copié.
