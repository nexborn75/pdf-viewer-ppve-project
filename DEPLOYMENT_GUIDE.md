# 🚀 Guide de déploiement IONOS

## 📁 Structure de fichiers après build

Après avoir exécuté `npm run build`, vous devez uploader ces fichiers sur IONOS :

```
dist/
├── .htaccess              # Configuration serveur (OBLIGATOIRE)
├── index.html            # Page principale
├── assets/               # CSS, JS optimisés
│   ├── index-[hash].css
│   └── index-[hash].js
├── PPVE/                # Dossier PDFs (copier depuis public/)
│   ├── PA1-_Plan_de_situation.pdf
│   ├── PA2-_Notice_completee.pdf
│   └── ... (tous les PDFs)
├── test.html            # Page de test (optionnel)
└── robots.txt
```

## 🔧 Étapes de déploiement

### 1. Build local
```bash
npm run build
```

### 2. Copier les PDFs dans dist/
Les PDFs ne sont pas copiés automatiquement, vous devez :
```bash
cp -r public/PPVE dist/
cp public/*.pdf dist/
```

### 3. Permissions IONOS
Définir les bonnes permissions via FTP/SFTP :
- **Dossiers** : `755` (rwxr-xr-x)
- **Fichiers** : `644` (rw-r--r--)
- **Fichier .htaccess** : `644`

### 4. Upload via FTP/SFTP
- Connectez-vous à votre espace IONOS
- Uploadez TOUT le contenu du dossier `dist/` vers la racine web
- Vérifiez que le .htaccess est bien présent

### 5. Test de déploiement
1. Accédez à : `https://votre-domaine.com/test.html`
2. Vérifiez que tous les tests passent
3. Testez l'accès aux PDFs
4. Accédez à l'application : `https://votre-domaine.com`

## ⚠️ Problèmes courants IONOS

### Erreur 500
- Vérifiez les permissions des fichiers
- Le .htaccess peut être trop restrictif
- Essayez de simplifier le .htaccess

### PDFs non accessibles
- Vérifiez que le dossier PPVE est bien uploadé
- Permissions du dossier PPVE : 755
- Permissions des PDFs : 644

### Application ne charge pas
- Vérifiez que index.html est à la racine
- Contrôlez la console navigateur pour les erreurs
- Vérifiez les chemins des assets

## 🛠️ Configuration serveur IONOS

Le fichier .htaccess inclus est optimisé pour IONOS et évite :
- Les directives non supportées
- Les configurations trop agressives
- Les problèmes de routing React

## 📞 Support

Si problème persistant :
1. Testez d'abord avec test.html
2. Vérifiez les logs d'erreur IONOS
3. Contactez le support IONOS avec les détails techniques