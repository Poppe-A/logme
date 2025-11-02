# Guide de Développement - LogMe

## 🚀 Démarrage Rapide

### Option 1 : Tout dans Docker (Recommandé)

Cette approche lance tous les services dans Docker, ce qui garantit un environnement de développement cohérent.

#### 1. Démarrer tous les conteneurs

```bash
docker-compose up -d
```

Ou utilisez le script raccourci :

```bash
yarn docker:up
```

#### 2. Vérifier que les conteneurs tournent

```bash
docker-compose ps
```

Vous devriez voir `logme-mysql`, `logme-back` et `logme-front` en cours d'exécution.

#### 3. Lancer le backend dans le conteneur (Terminal 1)

```bash
# Se connecter au conteneur backend
yarn docker:backend

# Dans le conteneur, lancer le backend en mode dev :
yarn workspace backend start:dev
```

Le backend sera disponible sur `http://localhost:3000` avec hot-reload activé.

#### 4. Lancer le frontend dans le conteneur (Terminal 2)

Dans un autre terminal :

```bash
# Se connecter au conteneur frontend
yarn docker:frontend

# Dans le conteneur, lancer le frontend en mode dev :
yarn workspace frontend dev
```

Le frontend sera disponible sur `http://localhost:5173` avec hot-reload activé.

#### 5. Configuration des variables d'environnement

Assurez-vous d'avoir un fichier `.env` dans `apps/backend/` avec :

```bash
# apps/backend/.env
DB_HOST=db
DB_PORT=3306
DB_USERNAME=logme-user
DB_PASSWORD=password
DB_DATABASE=logme
JWT_SECRET=votre_secret_jwt
```

**Note importante** : Dans Docker, utilisez `DB_HOST=db` (nom du service dans docker-compose), pas `localhost`.

---

### Option 2 : Base de données Docker + Apps locales (Alternative)

Cette approche peut être plus rapide si vous préférez développer sans Docker pour les apps.

#### 1. Installer les dépendances

```bash
# À la racine du projet
yarn install
```

#### 2. Démarrer uniquement la base de données

```bash
docker-compose up -d db
```

#### 3. Configurer les variables d'environnement

```bash
# apps/backend/.env
DB_HOST=localhost
DB_PORT=33060
DB_USERNAME=logme-user
DB_PASSWORD=password
DB_DATABASE=logme
JWT_SECRET=votre_secret_jwt
```

**Note importante** : En local, utilisez `DB_HOST=localhost` et `DB_PORT=33060`.

#### 4. Lancer le backend (Terminal 1)

```bash
yarn back:dev
```

#### 5. Lancer le frontend (Terminal 2)

```bash
yarn front:dev
```

---

## 📋 Scripts Utiles

### Scripts racine (package.json)

| Script | Description |
|--------|-------------|
| `yarn docker:up` | Démarre tous les containers Docker |
| `yarn docker:down` | Arrête tous les containers |
| `yarn docker:logs` | Affiche les logs des containers |
| `yarn docker:backend` | Accède au shell du container backend |
| `yarn docker:frontend` | Accède au shell du container frontend |
| `yarn dev:all` | Démarre tous les containers Docker |
| `yarn back:dev` | Lance le backend en mode dev (si Option 2) |
| `yarn front:dev` | Lance le frontend en mode dev (si Option 2) |
| `yarn dev:setup` | Installe les dépendances + démarre la DB (si Option 2) |

### Scripts backend

Dans `apps/backend/` :

```bash
yarn start:dev      # Démarre en mode développement (watch)
yarn start:debug    # Démarre en mode debug
yarn migrate        # Exécute les migrations
yarn migration:down # Annule la dernière migration
yarn seed           # Exécute les seeds
```

### Scripts frontend

Dans `apps/frontend/` :

```bash
yarn dev      # Démarre le serveur de développement
yarn build    # Build pour la production
yarn preview  # Prévisualise le build de production
```

---

## 🛠️ Commandes Docker Utiles

### Gestion des containers

```bash
# Démarrer les containers
docker-compose up -d

# Arrêter les containers
docker-compose down

# Voir les logs
docker-compose logs -f [service]  # service = db, back, frontend

# Redémarrer un service
docker-compose restart [service]

# Rebuild les images
docker-compose build [service]
```

### Accès aux containers

```bash
# Shell du backend
docker exec -it logme-back bash

# Shell de la base de données
docker exec -it logme-mysql bash
mysql -u logme-user -p logme

# Shell du frontend
docker exec -it logme-front bash
```

---

## 🔧 Configuration Base de Données

### Connexion depuis un container (Option 1 - Recommandé)

- **Host**: `db` (nom du service dans docker-compose)
- **Port**: `3306`
- **Database**: `logme`
- **User**: `logme-user`
- **Password**: `password`

### Connexion depuis l'extérieur du container (Option 2 - Apps locales)

- **Host**: `localhost`
- **Port**: `33060` (mappé depuis le port 3306 du container)
- **Database**: `logme`
- **User**: `logme-user`
- **Password**: `password`

---

## 🐛 Dépannage

### Les containers ne démarrent pas

```bash
# Vérifier les logs
docker-compose logs

# Vérifier si les ports sont libres
lsof -i :33060  # DB
lsof -i :3000   # Backend
lsof -i :5173  # Frontend
```

### Problèmes de dépendances

```bash
# Nettoyer et réinstaller
rm -rf node_modules apps/*/node_modules
yarn install
```

### Base de données corrompue

```bash
# Supprimer le volume et recréer
docker-compose down -v
docker-compose up -d db
# Puis relancer les migrations
yarn migrate
```

### Rebuild les images Docker

```bash
docker-compose build --no-cache
docker-compose up -d
```

---

## 📝 URLs de Développement

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Base de données**: localhost:33060

---

## ✅ Vérification que tout fonctionne

1. **Base de données** : `docker-compose ps` doit montrer `logme-mysql` comme "Up"
2. **Backend** : Ouvrir http://localhost:3000/api/v1/health (si configuré)
3. **Frontend** : Ouvrir http://localhost:5173 et voir l'interface

