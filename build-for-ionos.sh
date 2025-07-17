#!/bin/bash

# Script de build optimisé pour déploiement IONOS
echo "🚀 Build pour déploiement IONOS..."

# Build avec la config de déploiement
echo "📦 Build de l'application..."
npm run build

# Créer le dossier PDF dans dist et copier TOUS les PDFs
echo "📄 Copie des fichiers PDF..."
mkdir -p dist/PDF

# Copier tous les PDFs du nouveau dossier PDF unifié
if [ -d "public/PDF" ]; then
  cp public/PDF/*.pdf dist/PDF/ 2>/dev/null || true
  echo "✓ PDFs copiés de public/PDF vers dist/PDF"
else
  echo "⚠️ Dossier public/PDF non trouvé, utilisation de PPVE..."
  # Fallback vers PPVE si PDF n'existe pas encore
  if [ -d "public/PPVE" ]; then
    cp public/PPVE/*.pdf dist/PDF/ 2>/dev/null || true
    echo "✓ PDFs copiés de public/PPVE vers dist/PDF (fallback)"
  fi
  
  # Copier les PDFs de la racine vers PDF (s'il y en a)
  if ls public/*.pdf 1> /dev/null 2>&1; then
    cp public/*.pdf dist/PDF/ 2>/dev/null || true
    echo "✓ PDFs de la racine copiés vers dist/PDF"
  fi
fi

# Copier le fichier .htaccess
echo "⚙️ Configuration serveur..."
cp public/.htaccess dist/

# Copier la page de test
cp public/test.html dist/

# Afficher la structure finale
echo "📁 Structure du déploiement :"
ls -la dist/
echo ""
echo "📁 Dossier PDF :"
ls -la dist/PDF/ | head -10

echo ""
echo "✅ Build terminé !"
echo "📂 Fichiers prêts dans le dossier 'dist/'"
echo "🌐 Uploadez tout le contenu de 'dist/' sur votre serveur IONOS"
echo "🧪 Testez d'abord avec : votre-domaine.com/test.html"