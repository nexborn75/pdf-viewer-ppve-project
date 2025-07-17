import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Maximize2,
  Menu,
  X
} from "lucide-react";
import { getPdfUrl } from "@/data/pdfs";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configuration PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  filename: string;
  title: string;
}

export const PDFViewer = ({ isOpen, onClose, filename, title }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const pdfUrl = getPdfUrl(filename);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('Erreur de chargement du PDF:', error);
    setIsLoading(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 gap-0">
        {/* En-tête */}
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
              <Badge variant="outline">{filename}.pdf</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

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

          {/* Zone de visualisation */}
          <div className="flex-1 flex flex-col">
            {/* Barre d'outils */}
            <div className="flex items-center justify-between p-4 border-b bg-background">
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

            {/* Zone PDF */}
            <ScrollArea className="flex-1">
              <div className="flex justify-center items-start p-6 min-h-full bg-muted/20">
                {isLoading && (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Chargement du document...</p>
                    </div>
                  </div>
                )}
                
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { PDFViewer as ModernPDFViewer };