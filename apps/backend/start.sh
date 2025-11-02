#!/bin/sh
set -e

echo "🔄 Exécution des migrations..."
yarn migrate

echo "🌱 Exécution des seeds..."
# yarn seed

echo "▶️  Démarrage de l'application..."
yarn start

