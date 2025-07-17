import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  ArrowLeft,
  Home,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { getPdfUrl, pdfDocuments } from "@/data/pdfs";

const SimplePDFViewer = () => {
  const { filename } = useParams<{ filename: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Trouver le document correspondant
  const pdfDoc = pdfDocuments.find(doc => doc.filename === filename);
  const title = pdfDoc?.title || filename || 'Document PDF';
  const pdfUrl = filename ? getPdfUrl(filename) : '';

  // Pas de redirection automatique pour éviter les blocages

  const handleDownload = () => {
    if (!filename) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDirectView = () => {
    window.open(pdfUrl, '_blank');
  };

  const handleDirectAccess = () => {
    window.location.href = pdfUrl;
  };

  if (!filename) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nom de fichier manquant</h2>
          <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-2xl p-8">
        <div className="mb-8">
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">{title}</h1>
          <Badge variant="outline" className="mb-6 text-lg px-4 py-2">{filename}.pdf</Badge>
          <p className="text-muted-foreground text-lg mb-8">
            Cliquez ci-dessous pour accéder au document PDF
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button 
            onClick={handleDirectAccess} 
            size="lg" 
            className="gap-3 h-16 text-lg font-semibold"
          >
            <ExternalLink className="h-6 w-6" />
            Ouvrir le PDF
            <span className="text-xs opacity-80">(Même onglet)</span>
          </Button>
          
          <Button 
            onClick={handleDirectView} 
            variant="outline" 
            size="lg" 
            className="gap-3 h-16 text-lg font-semibold"
          >
            <ExternalLink className="h-6 w-6" />
            Nouvel onglet
            <span className="text-xs opacity-80">(Nouvelle fenêtre)</span>
          </Button>
          
          <Button 
            onClick={handleDownload} 
            variant="outline" 
            size="lg" 
            className="gap-3 h-16 text-lg font-semibold"
          >
            <Download className="h-6 w-6" />
            Télécharger
            <span className="text-xs opacity-80">(Sauvegarde locale)</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            size="lg" 
            className="gap-3 h-16 text-lg font-semibold"
          >
            <ArrowLeft className="h-6 w-6" />
            Retour accueil
            <span className="text-xs opacity-80">(Page principale)</span>
          </Button>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 text-sm text-muted-foreground">
          <h3 className="font-semibold mb-2">💡 Conseils d'utilisation :</h3>
          <ul className="space-y-1 text-left">
            <li>• <strong>Ouvrir le PDF</strong> : Accès direct dans cet onglet</li>
            <li>• <strong>Nouvel onglet</strong> : Garde cette page ouverte</li>
            <li>• <strong>Télécharger</strong> : Sauvegarde sur votre appareil</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimplePDFViewer;