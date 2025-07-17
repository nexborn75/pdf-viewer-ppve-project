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

  // Utiliser l'URL directe du PDF avec des paramètres d'affichage
  const directPdfUrl = `${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`;

  useEffect(() => {
    // Test de connectivité et initialisation
    const testPdf = async () => {
      try {
        const response = await fetch(pdfUrl, { method: 'HEAD' });
        if (response.ok) {
          setIsLoading(false);
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Erreur PDF:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    if (pdfUrl) {
      testPdf();
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

  const handleNewTab = () => {
    window.open(directPdfUrl, '_blank');
  };

  const handleEmbed = () => {
    window.open(directPdfUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
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
              onClick={handleNewTab}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Nouvelle fenêtre
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEmbed}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Popup
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
              <p className="text-muted-foreground mb-4">Initialisation du viewer PDF...</p>
              <p className="text-sm text-muted-foreground">PDF.js • {filename}.pdf</p>
            </div>
          </div>
        )}

        {/* Erreur de chargement */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10 p-4">
            <div className="text-center max-w-2xl">
              <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
              <p className="text-muted-foreground mb-6">
                Impossible de charger le viewer PDF
              </p>
              
              <div className="flex gap-2 justify-center flex-wrap">
                <Button 
                  onClick={handleNewTab}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ouvrir en nouvelle fenêtre
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleEmbed}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ouvrir en popup
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleDownload}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Télécharger le PDF
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Retour accueil
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Affichage PDF direct avec embed/object */}
        {!hasError && !isLoading && (
          <div className="w-full h-full" style={{ minHeight: 'calc(100vh - 80px)' }}>
            <object
              data={directPdfUrl}
              type="application/pdf"
              className="w-full h-full"
              onError={handleError}
            >
              <embed
                src={directPdfUrl}
                type="application/pdf"
                className="w-full h-full"
                onError={handleError}
              />
            </object>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplePDFViewer;