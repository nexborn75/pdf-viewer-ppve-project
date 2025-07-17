import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Menu,
  X,
  ArrowLeft,
  Home
} from "lucide-react";
import { getPdfUrl, pdfDocuments } from "@/data/pdfs";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configuration PDF.js optimisée pour Lovable
if (!pdfjs.GlobalWorkerOptions.workerSrc) {
  // Essayer plusieurs CDN pour maximiser la compatibilité
  const workerSources = [
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`,
    `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`,
    '/pdfjs/pdf.worker.min.js' // fallback local si disponible
  ];
  
  pdfjs.GlobalWorkerOptions.workerSrc = workerSources[0];
  console.log('Configuration PDF.js worker:', pdfjs.GlobalWorkerOptions.workerSrc);
}

const PDFViewerPage = () => {
  const { filename } = useParams<{ filename: string }>();
  const navigate = useNavigate();
  
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>('');

  // Trouver le document correspondant
  const pdfDoc = pdfDocuments.find(doc => doc.filename === filename);
  const title = pdfDoc?.title || filename || 'Document PDF';
  const pdfUrl = filename ? getPdfUrl(filename) : '';

  console.log('PDF Viewer - Filename:', filename);
  console.log('PDF Viewer - URL:', pdfUrl);
  console.log('PDF Viewer - Document trouvé:', pdfDoc);

  useEffect(() => {
    if (!filename) {
      navigate('/');
    }
  }, [filename, navigate]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setLoadError('');
    console.log('PDF chargé avec succès - Pages:', numPages);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('Erreur de chargement du PDF:', error);
    setIsLoading(false);
    
    // Message d'erreur plus descriptif
    let errorMsg = error.message;
    if (error.message.includes('worker')) {
      errorMsg = 'Erreur de configuration PDF.js. Vérifiez votre connexion internet.';
    } else if (error.message.includes('fetch')) {
      errorMsg = 'Fichier PDF introuvable. Vérifiez que le fichier existe.';
    }
    
    setLoadError(errorMsg);
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
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goToPage = (page: number) => {
    setPageNumber(page);
    setShowSidebar(false);
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

        {/* Barre d'outils */}
        <div className="flex items-center justify-between p-4 pt-0">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu className="h-4 w-4 mr-2" />
              Sommaire
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
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar avec sommaire */}
        {showSidebar && (
          <div className="w-80 border-r bg-muted/30">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Sommaire</h3>
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

        {/* Zone PDF */}
        <ScrollArea className="flex-1">
          <div className="flex justify-center items-start p-6 min-h-full bg-muted/20">
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Chargement du document...</p>
                  <p className="text-sm text-muted-foreground mt-2">URL: {pdfUrl}</p>
                </div>
              </div>
            )}

            {loadError && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center max-w-md">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
                  <p className="text-muted-foreground mb-4">{loadError}</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>URL tentée: {pdfUrl}</p>
                    <p>Worker PDF.js: {pdfjs.GlobalWorkerOptions.workerSrc}</p>
                  </div>
                  <div className="flex gap-2 mt-4 justify-center">
                    <Button 
                      onClick={() => {
                        setLoadError('');
                        setIsLoading(true);
                        // Forcer le rechargement
                        window.location.reload();
                      }} 
                      size="sm"
                    >
                      Réessayer
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(pdfUrl, '_blank')}
                    >
                      Ouvrir directement
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {!loadError && (
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
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PDFViewerPage;