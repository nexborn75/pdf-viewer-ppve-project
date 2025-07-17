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

  useEffect(() => {
    // Redirection automatique vers le PDF en plein écran
    if (pdfUrl) {
      window.location.href = pdfUrl;
    }
  }, [pdfUrl]);

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
        <div className="mb-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <Badge variant="outline" className="mb-4">{filename}.pdf</Badge>
          <p className="text-muted-foreground mb-6">
            Redirection vers l'affichage PDF en cours...
          </p>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <Button onClick={handleDirectView} size="lg" className="gap-2">
            <ExternalLink className="h-5 w-5" />
            Ouvrir le PDF
          </Button>
          <Button onClick={handleDownload} variant="outline" size="lg" className="gap-2">
            <Download className="h-5 w-5" />
            Télécharger
          </Button>
          <Button onClick={() => navigate('/')} variant="outline" size="lg" className="gap-2">
            <ArrowLeft className="h-5 w-5" />
            Retour accueil
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>Le PDF s'ouvre automatiquement dans votre navigateur.</p>
          <p>Si cela ne fonctionne pas, cliquez sur "Ouvrir le PDF" ci-dessus.</p>
        </div>
      </div>
    </div>
  );
};

export default SimplePDFViewer;