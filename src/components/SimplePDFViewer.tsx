import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  ArrowLeft,
  Home,
  ExternalLink,
  RefreshCw
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

  console.log('Simple PDF Viewer - Filename:', filename);
  console.log('Simple PDF Viewer - URL:', pdfUrl);

  const handleDownload = () => {
    if (!filename) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (!filename) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* En-tête fixe */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold truncate max-w-md">{title}</h1>
              <Badge variant="outline">{filename}.pdf</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(pdfUrl, '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Nouvel onglet
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Accueil
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="flex-1 relative">
        {/* Indicateur de chargement */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement du document...</p>
            </div>
          </div>
        )}

        {/* Erreur de chargement */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="text-center max-w-md p-6">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">Impossible de charger le PDF</h3>
              <p className="text-muted-foreground mb-4">
                Le document ne peut pas être affiché dans le navigateur.
              </p>
              <div className="text-sm text-muted-foreground mb-4">
                URL: {pdfUrl}
              </div>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                    window.location.reload();
                  }}
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Réessayer
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(pdfUrl, '_blank')}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ouvrir dans un nouvel onglet
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Télécharger
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Visionneuse PDF avec iframe */}
        <iframe
          src={pdfUrl}
          className="w-full h-full border-0"
          title={title}
          onLoad={handleLoad}
          onError={handleError}
          style={{ minHeight: 'calc(100vh - 80px)' }}
        />
      </div>
    </div>
  );
};

export default SimplePDFViewer;