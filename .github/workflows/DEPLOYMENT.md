# Guide de Configuration du Pipeline CI/CD

Ce document explique comment configurer le pipeline CI/CD pour déployer l'application LogMe sur un VPS.

## 📋 Prérequis

- Un VPS avec Docker et Docker Compose installés
- Accès SSH au VPS
- Compte GitHub avec accès aux secrets du repository

## 🔐 Configuration des Secrets GitHub

Allez dans **Settings > Secrets and variables > Actions** de votre repository GitHub et ajoutez les secrets suivants :

### Secrets Requis

| Secret | Description | Exemple |
|--------|-------------|---------|
| `VPS_HOST` | Adresse IP ou hostname du VPS | `123.456.789.0` ou `vps.example.com` |
| `VPS_USER` | Utilisateur SSH pour se connecter au VPS | `deploy` ou `root` |
| `VPS_SSH_PRIVATE_KEY` | Clé privée SSH pour l'accès au VPS | Contenu de `~/.ssh/id_rsa` ou `id_ed25519` |
| `VPS_URL` | URL publique de l'application (pour les notifications) | `https://logme.example.com` |
| `DB_ROOT_PASSWORD` | Mot de passe root MySQL (pour les backups) | `votre_mot_de_passe` |

### Génération d'une Clé SSH

Si vous n'avez pas encore de clé SSH pour le déploiement :

```bash
# Générer une nouvelle clé SSH
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Copier la clé publique sur le VPS
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@your-vps

# Afficher la clé privée (à copier dans GitHub Secrets)
cat ~/.ssh/github_actions_deploy
```

⚠️ **Important** : Ne partagez jamais votre clé privée publiquement !

## 🖥️ Configuration du VPS

### 1. Installation de Docker et Docker Compose

```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Installer Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Structure des Répertoires

Créez la structure suivante sur votre VPS :

```bash
sudo mkdir -p /opt/logme
sudo mkdir -p /backups/logme
sudo chown -R $USER:$USER /opt/logme /backups/logme
```

### 3. Configuration Docker Compose de Production

Créez un fichier `docker-compose.prod.yml` sur votre VPS dans `/opt/logme` :

```yaml
services:
  db:
    image: mysql:8.2
    container_name: logme-mysql
    restart: unless-stopped
    volumes:
      - logme-db:/var/lib/mysql
      - ./scripts/db/:/docker-entrypoint-initdb.d/:ro
    environment:
      - TZ=Europe/Paris
      - MYSQL_DATABASE=logme
      - MYSQL_USER=logme-user
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - DEFAULT_AUTHENTICATION_PLUGIN=mysql_native_password
    networks:
      - logme_default

  back:
    image: logme-backend:latest
    container_name: logme-back
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - ./apps/backend/.env
    depends_on:
      - db
    networks:
      - logme_default

  frontend:
    image: logme-frontend:latest
    container_name: logme-front
    restart: unless-stopped
    ports:
      - "4173:4173"
    networks:
      - logme_default

volumes:
  logme-db:

networks:
  logme_default:
    driver: bridge
```

### 4. Variables d'Environnement

Créez le fichier `.env` pour le backend dans `/opt/logme/apps/backend/.env` :

```env
PORT=3000
DB_HOST=db
DB_PORT=3306
DB_USERNAME=logme-user
DB_PASSWORD=votre_mot_de_passe
DB_DATABASE=logme
JWT_SECRET=votre_jwt_secret
# ... autres variables
```

### 5. Permissions SSH

Assurez-vous que l'utilisateur de déploiement peut exécuter Docker sans sudo :

```bash
# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER

# Redémarrer la session SSH
exit
# Se reconnecter
```

## 🔄 Workflow de Déploiement

### Déploiement Automatique

Le déploiement se déclenche automatiquement lors d'un push sur la branche `main`.

### Déploiement Manuel

1. Allez dans l'onglet **Actions** de votre repository GitHub
2. Sélectionnez le workflow **Deploy**
3. Cliquez sur **Run workflow**
4. Choisissez l'environnement (production ou staging)
5. Cliquez sur **Run workflow**

## 🚀 Processus de Déploiement

Le pipeline effectue les étapes suivantes :

1. **Build** : Construction des images Docker backend et frontend
2. **Backup** : Sauvegarde automatique de la base de données
3. **Migration** : Exécution des migrations de base de données
4. **Déploiement Backend** : Arrêt de l'ancien container et démarrage du nouveau
5. **Déploiement Frontend** : Arrêt de l'ancien container et démarrage du nouveau
6. **Health Check** : Vérification que les services répondent correctement
7. **Nettoyage** : Suppression des anciennes images Docker

## 🔍 Vérification Post-Déploiement

Après le déploiement, vérifiez que tout fonctionne :

```bash
# Vérifier les containers
ssh user@your-vps "docker ps"

# Vérifier les logs backend
ssh user@your-vps "docker logs logme-back"

# Vérifier les logs frontend
ssh user@your-vps "docker logs logme-front"

# Tester l'endpoint health
curl http://your-vps:3000/api/v1/health
```

## 🛠️ Dépannage

### Le déploiement échoue lors du health check

- Vérifiez que le port 3000 est accessible
- Consultez les logs : `docker logs logme-back`
- Vérifiez la configuration réseau Docker

### Les migrations échouent

- Vérifiez que la base de données est accessible
- Consultez les logs : `docker logs logme-mysql`
- Vérifiez les permissions de la base de données

### Problèmes de connexion SSH

- Vérifiez que la clé SSH est correctement configurée
- Testez la connexion manuellement : `ssh user@your-vps`
- Vérifiez que le VPS autorise les connexions SSH

## 📝 Notes Importantes

- Les backups sont stockés dans `/backups/logme` et conservés pendant 7 jours
- Les anciennes images Docker sont automatiquement supprimées (sauf les 3 dernières)
- Le déploiement nécessite que les jobs CI réussissent
- Les health checks ont un timeout de 60 secondes pour le backend et 40 secondes pour le frontend

## 🔐 Sécurité

- Utilisez un utilisateur dédié pour le déploiement (pas root si possible)
- Limitez les permissions SSH au minimum nécessaire
- Utilisez des mots de passe forts pour la base de données
- Activez le firewall sur votre VPS
- Considérez l'utilisation d'un reverse proxy (Nginx/Traefik) avec SSL/TLS





