
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, 
  ArrowLeft,
  Home,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Menu,
  X
} from "lucide-react";
import { getPdfUrl, pdfDocuments } from "@/data/pdfs";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configuration PDF.js - Désactiver le worker pour éviter les erreurs CORS
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = '';
}

const SimplePDFViewer = () => {
  const { filename } = useParams<{ filename: string }>();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  // Trouver le document correspondant
  const pdfDoc = pdfDocuments.find(doc => doc.filename === filename);
  const title = pdfDoc?.title || filename || 'Document PDF';
  const pdfUrl = filename ? getPdfUrl(filename) : '';


  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setHasError(false);
    console.log('PDF chargé avec succès:', numPages, 'pages');
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('Erreur de chargement du PDF:', error);
    setIsLoading(false);
    setHasError(true);
    setErrorDetails(`Erreur de chargement: ${error.message}`);
  }, []);

  const goToPrevPage = () => {
    setPageNumber(page => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setPageNumber(page => Math.min(numPages, page + 1));
  };

  const zoomIn = () => {
    setScale(scale => Math.min(3.0, scale + 0.2));
  };

  const zoomOut = () => {
    setScale(scale => Math.max(0.5, scale - 0.2));
  };

  const rotate = () => {
    setRotation(rotation => (rotation + 90) % 360);
  };

  const handleDownload = () => {
    if (!filename) return;
    console.log('Téléchargement:', pdfUrl);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const testDirectAccess = () => {
    console.log('Accès direct:', pdfUrl);
    window.open(pdfUrl, '_blank');
  };

  const goToPage = (page: number) => {
    setPageNumber(page);
    setShowSidebar(false);
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
              onClick={testDirectAccess}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Nouvel onglet
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
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar avec navigation des pages */}
        {showSidebar && numPages > 0 && (
          <div className="w-80 border-r bg-muted/30">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Navigation</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSidebar(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === pageNumber ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => goToPage(page)}
                  >
                    Page {page}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Zone principale */}
        <div className="flex-1 flex flex-col">
          {/* Barre d'outils */}
          {!hasError && numPages > 0 && (
            <div className="flex items-center justify-between p-4 border-b bg-background">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <Menu className="h-4 w-4 mr-2" />
                  Pages
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2 px-3">
                    <span className="text-sm font-medium">{pageNumber}</span>
                    <span className="text-sm text-muted-foreground">/ {numPages}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={goToNextPage} disabled={pageNumber >= numPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-16 text-center">
                  {Math.round(scale * 100)}%
                </span>
                <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3.0}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="outline" size="sm" onClick={rotate}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Contenu principal */}
          <div className="flex-1 relative">
            {/* Indicateur de chargement */}
            {isLoading && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground mb-4">Chargement du document...</p>
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
                    {errorDetails || "Impossible de charger le document PDF"}
                  </p>
                  
                  <div className="flex gap-2 justify-center flex-wrap">
                    <Button 
                      onClick={() => {
                        setHasError(false);
                        setIsLoading(true);
                        setPageNumber(1);
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
                      onClick={testDirectAccess}
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Nouvel onglet
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

            {/* Visionneuse PDF avec PDF.js */}
            {!hasError && (
              <ScrollArea className="h-full">
                <div className="flex justify-center items-start p-6 min-h-full bg-muted/20">
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading=""
                    className="pdf-document"
                  >
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                      <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        rotate={rotation}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="pdf-page"
                      />
                    </div>
                  </Document>
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePDFViewer;
