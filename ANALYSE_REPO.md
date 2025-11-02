# Analyse du monorepo Logme

## 1. Configuration actuelle du monorepo

### ✅ Points positifs

- **Workspaces Yarn** : Configuration correcte avec `workspaces: ["apps/*"]` dans le `package.json` racine
- **Structure claire** : Séparation backend/frontend dans `apps/`
- **TypeScript** : Configuré dans les deux applications
- **Docker** : Dockerfiles présents pour backend et frontend
- **Docker Compose** : Fichier présent pour le développement local
- **Migrations TypeORM** : Système de migrations en place
- **Authentification JWT** : Implémentée avec access et refresh tokens

### ⚠️ Problèmes identifiés

#### Configuration monorepo
- Scripts limités : Seul `front:dev` dans le `package.json` racine
- Pas de scripts globaux pour build/test/lint
- Pas de configuration partagée (ex: ESLint à la racine)

#### Dockerfiles
- **Backend** : CMD commenté, ne peut pas démarrer en production
- **Frontend** : CMD commenté, ne peut pas servir en production
- Pas de `.dockerignore` : `node_modules` et `dist` seront copiés inutilement
- Pas de builds multi-stage : Images potentiellement volumineuses
- Pas d'optimisation pour la production

#### Docker Compose
- Configuration **dev uniquement** : `command: sleep infinity` pour les deux services
- Volumes montés en développement : Pas adapté à la production
- Ports exposés directement : Pas de reverse proxy (Nginx)

#### Configuration backend
- **CORS hardcodé** : `origin: ['http://localhost:5173', 'http://localhost:4173']` dans `main.ts`
- Variables d'environnement : Pas de `.env.example` documenté
- Port : Fallback à 3000 mais devrait être configurable via `PORT`
- **Cookies non sécurisés** : `secure: false` dans `auth.service.ts` (TODO pour prod)

#### Configuration frontend
- **URL API hardcodée** : `'http://localhost:3000/api/v1'` dans `store.ts`
- Pas de variable d'environnement pour l'URL de l'API
- Vite config minimal : Pas de configuration de proxy en dev

#### Variables d'environnement
- Pas de `.env.example` dans le backend
- Pas de documentation des variables requises
- Variables identifiées nécessaires :
  - `ACCESS_JWT_SECRET`
  - `REFRESH_JWT_SECRET`
  - `HEALTH_DATA_SECRET`
  - `MYSQL_HOST`
  - `MYSQL_PORT`
  - `MYSQL_USER`
  - `MYSQL_PASSWORD`
  - `MYSQL_DATABASE`
  - `PORT`

#### Déploiement
- Pas de script de déploiement
- Pas de docker-compose pour production
- Pas de configuration Nginx
- Pas de configuration SSL/HTTPS
- Migrations : Pas d'exécution automatique au démarrage du container

---

## 2. Améliorations recommandées

### A. Configuration monorepo

#### Scripts globaux dans `package.json` racine
```json
{
  "scripts": {
    "front:dev": "yarn workspace frontend dev",
    "back:dev": "yarn workspace backend start:dev",
    "build": "yarn workspace backend build && yarn workspace frontend build",
    "build:back": "yarn workspace backend build",
    "build:front": "yarn workspace frontend build",
    "lint": "yarn workspace backend lint && yarn workspace frontend lint",
    "test": "yarn workspace backend test && yarn workspace frontend test"
  }
}
```

#### Configuration ESLint partagée (optionnel)
- Déplacer la config ESLint à la racine si elle est identique
- Ou créer un package partagé pour la configuration

### B. Dockerfiles optimisés

#### Backend Dockerfile multi-stage
```dockerfile
# Stage 1: Build
FROM node:22-bullseye AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Stage 2: Production
FROM node:22-bullseye-slim
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/database ./database
EXPOSE 3000
CMD ["yarn", "start:prod"]
```

#### Frontend Dockerfile multi-stage
```dockerfile
# Stage 1: Build
FROM node:22-bullseye AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Stage 2: Production (serveur statique)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### `.dockerignore` pour backend et frontend
```
node_modules
dist
.git
.env
*.log
.vscode
.idea
coverage
*.md
```

### C. Configuration backend pour production

#### CORS dynamique dans `main.ts`
```typescript
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || 
  ['http://localhost:5173', 'http://localhost:4173'];

app.enableCors({
  origin: allowedOrigins,
  credentials: true,
});
```

#### Cookies sécurisés conditionnels
```typescript
const isProduction = process.env.NODE_ENV === 'production';

this.setCookies(res, refreshToken, {
  httpOnly: true,
  path: '/',
  secure: isProduction, // HTTPS en production
  sameSite: isProduction ? 'strict' : 'lax',
  maxAge: 1000 * 60 * 60 * 24 * 7,
});
```

#### `.env.example` backend
```
# Server
PORT=3000
NODE_ENV=production

# Database
MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_USER=logme-user
MYSQL_PASSWORD=password
MYSQL_DATABASE=logme

# JWT
ACCESS_JWT_SECRET=your-access-secret-key-here
REFRESH_JWT_SECRET=your-refresh-secret-key-here

# Health
HEALTH_DATA_SECRET=your-health-secret-key-here

# CORS
ALLOWED_ORIGINS=https://votre-domaine.com
```

### D. Configuration frontend pour production

#### Variable d'environnement pour l'API
- Créer `.env.example` :
```
VITE_API_URL=http://localhost:3000/api/v1
```

- Modifier `store.ts` :
```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
createApiClient(apiUrl, store.getState, store.dispatch);
```

#### Configuration Vite pour build
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
});
```

### E. Docker Compose pour production

Créer `docker-compose.prod.yml` :
```yaml
services:
  db:
    image: mysql:8.2
    container_name: logme-mysql-prod
    volumes:
      - logme-db-prod:/var/lib/mysql
    environment:
      - TZ=Europe/Paris
      - MYSQL_DATABASE=${MYSQL_DATABASE}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - DEFAULT_AUTHENTICATION_PLUGIN=mysql_native_password
    restart: unless-stopped
    networks:
      - logme-network

  back:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
    container_name: logme-back-prod
    env_file:
      - ./apps/backend/.env
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - logme-network
    command: sh -c "yarn migrate && yarn start:prod"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./apps/frontend
      dockerfile: Dockerfile
    container_name: logme-front-prod
    restart: unless-stopped
    networks:
      - logme-network

  nginx:
    image: nginx:alpine
    container_name: logme-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - back
    restart: unless-stopped
    networks:
      - logme-network

volumes:
  logme-db-prod:

networks:
  logme-network:
    driver: bridge
```

### F. Configuration Nginx

Créer `nginx/conf.d/default.conf` :
```nginx
upstream backend {
    server back:3000;
}

upstream frontend {
    server frontend:80;
}

server {
    listen 80;
    server_name votre-domaine.com;

    # Redirection HTTPS (optionnel)
    # return 301 https://$server_name$request_uri;

    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Configuration HTTPS (optionnel)
# server {
#     listen 443 ssl http2;
#     server_name votre-domaine.com;
#
#     ssl_certificate /etc/nginx/ssl/cert.pem;
#     ssl_certificate_key /etc/nginx/ssl/key.pem;
#
#     # ... même configuration que ci-dessus
# }
```

### G. Scripts de déploiement

Créer `scripts/deploy.sh` :
```bash
#!/bin/bash
set -e

echo "🚀 Déploiement de Logme..."

# Vérifier les variables d'environnement
if [ ! -f "apps/backend/.env" ]; then
    echo "❌ Erreur: apps/backend/.env manquant"
    exit 1
fi

# Build des images
echo "📦 Build des images Docker..."
docker-compose -f docker-compose.prod.yml build

# Démarrer les services
echo "▶️  Démarrage des services..."
docker-compose -f docker-compose.prod.yml up -d

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 10

# Exécuter les migrations (si pas déjà fait dans le CMD)
# docker-compose -f docker-compose.prod.yml exec back yarn migrate

echo "✅ Déploiement terminé!"
```

### H. Script d'initialisation des migrations

Modifier le Dockerfile backend ou ajouter un script :
```dockerfile
# Ajouter un script d'entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["yarn", "start:prod"]
```

Créer `apps/backend/docker-entrypoint.sh` :
```bash
#!/bin/sh
set -e

echo "🔄 Exécution des migrations..."
yarn migrate

echo "▶️  Démarrage de l'application..."
exec "$@"
```

---

## 3. Checklist pour déploiement VPS

### Prérequis sur le VPS
- [ ] Docker installé
- [ ] Docker Compose installé
- [ ] Domaine configuré (optionnel mais recommandé)
- [ ] Certificat SSL (Let's Encrypt avec Certbot recommandé)

### Configuration à faire

#### 1. Variables d'environnement
- [ ] Créer `apps/backend/.env` avec toutes les variables nécessaires
- [ ] Générer des secrets JWT sécurisés (utiliser `openssl rand -hex 32`)
- [ ] Configurer les mots de passe de la base de données

#### 2. Dockerfiles
- [ ] Optimiser les Dockerfiles (multi-stage)
- [ ] Ajouter `.dockerignore` pour backend et frontend
- [ ] Activer les CMD dans les Dockerfiles

#### 3. Docker Compose
- [ ] Créer `docker-compose.prod.yml`
- [ ] Configurer les healthchecks
- [ ] Configurer les réseaux Docker
- [ ] Configurer les volumes persistants

#### 4. Nginx
- [ ] Installer Nginx ou utiliser le container
- [ ] Configurer le reverse proxy
- [ ] Configurer SSL/HTTPS (Let's Encrypt)

#### 5. Backend
- [ ] Configurer CORS dynamiquement (variables d'environnement)
- [ ] Activer les cookies sécurisés en production
- [ ] Configurer l'URL de l'API dans le frontend

#### 6. Frontend
- [ ] Utiliser les variables d'environnement pour l'URL API
- [ ] Builder le frontend avec les bonnes variables

#### 7. Base de données
- [ ] Configurer les sauvegardes automatiques
- [ ] Configurer la persistance des données (volumes)

#### 8. Déploiement
- [ ] Créer le script de déploiement
- [ ] Tester le déploiement localement avec `docker-compose.prod.yml`
- [ ] Configurer le redémarrage automatique (restart: unless-stopped)

#### 9. Monitoring (optionnel)
- [ ] Configurer les logs Docker
- [ ] Ajouter un healthcheck endpoint
- [ ] Configurer des alertes (optionnel)

#### 10. Sécurité
- [ ] Mots de passe forts
- [ ] Secrets JWT robustes
- [ ] HTTPS activé
- [ ] Firewall configuré (UFW)
- [ ] Ports non essentiels fermés

---

## 4. Fichiers à créer/modifier

### Fichiers à créer
1. `docker-compose.prod.yml` - Configuration Docker pour production
2. `apps/backend/.env.example` - Template des variables d'environnement
3. `apps/frontend/.env.example` - Template des variables d'environnement
4. `apps/backend/.dockerignore` - Ignore les fichiers inutiles
5. `apps/frontend/.dockerignore` - Ignore les fichiers inutiles
6. `nginx/conf.d/default.conf` - Configuration Nginx
7. `apps/backend/docker-entrypoint.sh` - Script d'initialisation
8. `scripts/deploy.sh` - Script de déploiement
9. `README_DEPLOYMENT.md` - Documentation de déploiement

### Fichiers à modifier
1. `package.json` (racine) - Ajouter scripts globaux
2. `apps/backend/Dockerfile` - Optimiser pour production
3. `apps/frontend/Dockerfile` - Optimiser pour production
4. `apps/backend/src/main.ts` - CORS dynamique
5. `apps/backend/src/auth/auth.service.ts` - Cookies sécurisés
6. `apps/frontend/src/utils/store.ts` - URL API via variable d'environnement
7. `apps/frontend/vite.config.ts` - Configuration de build

---

## Résumé

### État actuel
Le monorepo est **fonctionnel pour le développement** mais **pas prêt pour la production**.

### Priorités
1. **Critique** : Optimiser les Dockerfiles et ajouter les CMD
2. **Critique** : Créer `docker-compose.prod.yml` pour la production
3. **Important** : Configurer les variables d'environnement (CORS, API URL, cookies)
4. **Important** : Ajouter Nginx comme reverse proxy
5. **Recommandé** : Scripts de déploiement et documentation

### Estimation du temps
- Configuration Docker : 2-3h
- Configuration Nginx : 1h
- Variables d'environnement : 30min
- Scripts de déploiement : 1h
- Tests : 1-2h

**Total : ~5-7 heures de travail**



