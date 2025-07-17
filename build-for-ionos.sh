#!/bin/bash

# Script de build optimisé pour déploiement IONOS
echo "🚀 Build pour déploiement IONOS..."

# Build avec la config de déploiement
echo "📦 Build de l'application..."
npm run build

# Créer le dossier PPVE dans dist et copier les PDFs
echo "📄 Copie des fichiers PDF..."
mkdir -p dist/PPVE
cp -r public/PPVE/* dist/PPVE/
cp public/*.pdf dist/PPVE/ 2>/dev/null || true

# Copier le fichier .htaccess
echo "⚙️ Configuration serveur..."
cp public/.htaccess dist/

# Copier la page de test
cp public/test.html dist/

# Afficher la structure finale
echo "📁 Structure du déploiement :"
ls -la dist/
echo ""
echo "📁 Dossier PPVE :"
ls -la dist/PPVE/ | head -10

echo ""
echo "✅ Build terminé !"
echo "📂 Fichiers prêts dans le dossier 'dist/'"
echo "🌐 Uploadez tout le contenu de 'dist/' sur votre serveur IONOS"
echo "🧪 Testez d'abord avec : votre-domaine.com/test.html"