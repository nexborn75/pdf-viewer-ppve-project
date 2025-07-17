#!/bin/bash

# Script pour créer la structure PDF unifiée
echo "🔄 Création de la structure PDF unifiée..."

# Créer le dossier PDF s'il n'existe pas
mkdir -p public/PDF

# Copier tous les PDFs du dossier PPVE vers PDF
if [ -d "public/PPVE" ]; then
    echo "📄 Copie des PDFs de PPVE vers PDF..."
    cp public/PPVE/*.pdf public/PDF/ 2>/dev/null || true
    echo "✓ PDFs copiés de PPVE vers PDF"
fi

# Copier les PDFs de la racine vers PDF (s'il y en a)
if ls public/*.pdf 1> /dev/null 2>&1; then
    echo "📄 Copie des PDFs de la racine vers PDF..."
    cp public/*.pdf public/PDF/ 2>/dev/null || true
    echo "✓ PDFs copiés de la racine vers PDF"
fi

# Afficher le contenu du dossier PDF
echo ""
echo "📁 Contenu du dossier public/PDF :"
ls -la public/PDF/ 2>/dev/null || echo "Aucun fichier trouvé"

echo ""
echo "✅ Structure unifiée créée !"
echo "📂 Tous les PDFs sont maintenant dans public/PDF/"