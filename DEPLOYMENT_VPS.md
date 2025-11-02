# Guide de Déploiement VPS - LogMe

## 🗄️ Configuration MySQL sur le VPS

### ✅ Recommandation : Container Docker

**Pourquoi Docker pour MySQL ?**

1. **Isolation** : La base de données est isolée de votre système
2. **Facilité de gestion** : Mise à jour, sauvegarde, restauration simplifiées
3. **Cohérence** : Même environnement que le développement
4. **Portabilité** : Facile à migrer ou dupliquer
5. **Sauvegardes** : Volumes Docker faciles à sauvegarder

### 🔐 Utilisateur SQL dédié : OUI, absolument !

**Bonnes pratiques de sécurité :**

1. ✅ **Créer un utilisateur dédié** à l'application (pas `root`)
2. ✅ **Principe du moindre privilège** : Donner uniquement les permissions nécessaires
3. ✅ **Mot de passe fort** : Générer un mot de passe aléatoire et sécurisé
4. ✅ **Pas d'accès root depuis l'app** : L'utilisateur de l'app ne doit pas avoir accès root

## 📋 Configuration Recommandée

### 1. Structure des répertoires sur le VPS

```bash
# Sur votre VPS
mkdir -p /opt/logme/{db,backend,frontend}
mkdir -p /opt/logme/db/{data,backups,init}
mkdir -p /opt/logme/backend/.env
```

### 2. Docker Compose pour Production

Créez `/opt/logme/docker-compose.prod.yml` :

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.2
    container_name: logme-mysql-prod
    restart: unless-stopped
    environment:
      - TZ=Europe/Paris
      - MYSQL_DATABASE=${MYSQL_DATABASE}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - DEFAULT_AUTHENTICATION_PLUGIN=mysql_native_password
    volumes:
      - logme-db-data:/var/lib/mysql
      - ./db/backups:/backups
      - ./db/init:/docker-entrypoint-initdb.d:ro
    networks:
      - logme-network
    # Ne pas exposer le port MySQL à l'extérieur (sécurité)
    # ports:
    #   - "3306:3306"  # ❌ NE PAS FAIRE en production
    healthcheck:
      test:
        [
          'CMD',
          'mysqladmin',
          'ping',
          '-h',
          'localhost',
          '-u',
          'root',
          '-p${MYSQL_ROOT_PASSWORD}',
        ]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    image: votre-username/logme-backend:latest # Remplacez par votre image DockerHub
    container_name: logme-backend-prod
    restart: unless-stopped
    ports:
      - '3000:3000'
    env_file:
      - ./backend/.env
    depends_on:
      db:
        condition: service_healthy
    networks:
      - logme-network
    healthcheck:
      test:
        [
          'CMD',
          'wget',
          '--quiet',
          '--tries=1',
          '--spider',
          'http://localhost:3000/health',
        ]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: votre-username/logme-frontend:latest # Quand vous l'aurez créé
    container_name: logme-frontend-prod
    restart: unless-stopped
    ports:
      - '80:4173' # ou "443:4173" avec reverse proxy
    networks:
      - logme-network

volumes:
  logme-db-data:
    driver: local

networks:
  logme-network:
    driver: bridge
```

### 3. Fichier .env pour Docker Compose (MySQL)

Créez `/opt/logme/.env` (pour les variables MySQL partagées) :

```bash
# Variables MySQL
MYSQL_DATABASE=logme
MYSQL_USER=logme_app_user
MYSQL_PASSWORD=GENERER_UN_MOT_DE_PASSE_FORT_ICI
MYSQL_ROOT_PASSWORD=GENERER_UN_AUTRE_MOT_DE_PASSE_FORT_ICI
```

**⚠️ Important :**

- Ne commitez JAMAIS ce fichier dans Git
- Utilisez des mots de passe forts (minimum 32 caractères aléatoires)
- Générez-les avec : `openssl rand -base64 32`

### 4. Fichier .env pour le Backend

Créez `/opt/logme/backend/.env` :

```bash
# Port de l'application
PORT=3000
NODE_ENV=production

# Configuration MySQL
# ⚠️ Utilisez le nom du service Docker comme host
MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_USER=logme_app_user
MYSQL_PASSWORD=LE_MEME_MOT_DE_PASSE_QUE_DANS_DOCKER_COMPOSE
MYSQL_DATABASE=logme

# JWT Secrets (générez des secrets forts et uniques)
ACCESS_JWT_SECRET=GENERER_UN_SECRET_JWT_FORT_ICI
REFRESH_JWT_SECRET=GENERER_UN_AUTRE_SECRET_JWT_FORT_ICI

# Health Check Secret
HEALTH_DATA_SECRET=GENERER_UN_SECRET_POUR_HEALTH_CHECK
```

## 🔧 Script d'Initialisation

Créez `/opt/logme/init.sh` pour automatiser la création :

```bash
#!/bin/bash
set -e

echo "🚀 Initialisation de LogMe sur le VPS..."

# Créer les répertoires
mkdir -p /opt/logme/{db/{data,backups,init},backend,frontend}

# Générer les mots de passe
echo "🔐 Génération des mots de passe..."
MYSQL_PASSWORD=$(openssl rand -base64 32)
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
ACCESS_JWT_SECRET=$(openssl rand -base64 64)
REFRESH_JWT_SECRET=$(openssl rand -base64 64)
HEALTH_SECRET=$(openssl rand -base64 32)

# Créer le .env pour Docker Compose
cat > /opt/logme/.env <<EOF
MYSQL_DATABASE=logme
MYSQL_USER=logme_app_user
MYSQL_PASSWORD=${MYSQL_PASSWORD}
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
EOF

# Créer le .env pour le backend
cat > /opt/logme/backend/.env <<EOF
PORT=3000
NODE_ENV=production

MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_USER=logme_app_user
MYSQL_PASSWORD=${MYSQL_PASSWORD}
MYSQL_DATABASE=logme

ACCESS_JWT_SECRET=${ACCESS_JWT_SECRET}
REFRESH_JWT_SECRET=${REFRESH_JWT_SECRET}
HEALTH_DATA_SECRET=${HEALTH_SECRET}
EOF

# Définir les permissions
chmod 600 /opt/logme/.env
chmod 600 /opt/logme/backend/.env

echo "✅ Configuration créée !"
echo "📝 Les fichiers .env ont été créés avec des secrets générés automatiquement."
echo "⚠️  IMPORTANT : Sauvegardez ces secrets dans un gestionnaire de mots de passe !"
```

Rendez-le exécutable :

```bash
chmod +x /opt/logme/init.sh
```

## 🚀 Déploiement

### 1. Sur votre VPS

```bash
# Se connecter au VPS
ssh votre-user@votre-vps

# Aller dans le répertoire
cd /opt/logme

# Exécuter le script d'initialisation (première fois seulement)
./init.sh

# Copier le docker-compose.prod.yml
# (vous pouvez le créer manuellement ou le copier depuis votre repo)

# Démarrer les services
docker-compose -f docker-compose.prod.yml up -d

# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 2. Vérifications

```bash
# Vérifier que les conteneurs tournent
docker-compose -f docker-compose.prod.yml ps

# Vérifier les logs du backend
docker-compose -f docker-compose.prod.yml logs backend

# Vérifier la connexion MySQL
docker-compose -f docker-compose.prod.yml exec db mysql -u logme_app_user -p logme
```

## 🔒 Sécurité - Bonnes Pratiques

### 1. Permissions des fichiers .env

```bash
# Les fichiers .env doivent être lisibles uniquement par le propriétaire
chmod 600 /opt/logme/.env
chmod 600 /opt/logme/backend/.env
```

### 2. Firewall

```bash
# Ne pas exposer MySQL à l'extérieur
# Le port 3306 ne doit PAS être accessible depuis l'extérieur
# Seuls les conteneurs Docker peuvent communiquer entre eux via le réseau interne
```

### 3. Sauvegardes MySQL

Créez `/opt/logme/db/backup.sh` :

```bash
#!/bin/bash
BACKUP_DIR="/opt/logme/db/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/logme_backup_$DATE.sql"

docker-compose -f /opt/logme/docker-compose.prod.yml exec -T db \
  mysqldump -u root -p${MYSQL_ROOT_PASSWORD} logme > $BACKUP_FILE

# Compresser
gzip $BACKUP_FILE

# Garder seulement les 30 derniers backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "✅ Backup créé : $BACKUP_FILE.gz"
```

Ajoutez dans crontab pour automatiser :

```bash
# Sauvegarde quotidienne à 2h du matin
0 2 * * * /opt/logme/db/backup.sh
```

## 📝 Réponses à vos Questions

### Q: Container Docker ou installation native MySQL ?

**R: Container Docker** ✅

- Plus facile à gérer
- Isolation complète
- Facile à sauvegarder/restaurer
- Cohérent avec votre environnement de développement

### Q: Utilisateur SQL dédié à l'application ?

**R: OUI, absolument** ✅

- Créez un utilisateur `logme_app_user` (ou similaire)
- Donnez-lui uniquement les permissions sur la base `logme`
- Ne donnez PAS les privilèges root
- Utilisez un mot de passe fort et unique

### Q: Fichier .env sur le VPS - à créer manuellement ?

**R: Oui, mais avec un script d'initialisation** ✅

- Créez-le manuellement la première fois OU
- Utilisez le script `init.sh` fourni ci-dessus
- Le script génère automatiquement des secrets forts
- **Important** : Sauvegardez ces secrets dans un gestionnaire de mots de passe !

## 🎯 Checklist de Déploiement

- [ ] Créer les répertoires sur le VPS
- [ ] Générer les secrets (mots de passe, JWT secrets)
- [ ] Créer `/opt/logme/.env` (variables MySQL)
- [ ] Créer `/opt/logme/backend/.env` (variables backend)
- [ ] Créer `/opt/logme/docker-compose.prod.yml`
- [ ] Définir les permissions (chmod 600 sur les .env)
- [ ] Démarrer les conteneurs
- [ ] Vérifier les logs
- [ ] Tester la connexion à l'API
- [ ] Configurer les sauvegardes automatiques
- [ ] Configurer le firewall (ne pas exposer MySQL)

## 🔄 Mise à Jour de l'Application

```bash
# Sur le VPS
cd /opt/logme

# Récupérer la nouvelle image
docker-compose -f docker-compose.prod.yml pull backend

# Redémarrer le service
docker-compose -f docker-compose.prod.yml up -d backend

# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs -f backend
```


