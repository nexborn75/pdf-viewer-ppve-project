import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, ExternalLink, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SimplePDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

export const SimplePDFViewer = ({ isOpen, onClose, pdfUrl, title }: SimplePDFViewerProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground pr-8">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Choisissez votre méthode préférée pour consulter ce document PDF.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button
              onClick={handleOpenNewTab}
              className="w-full gap-3 h-12 text-base"
              size="lg"
            >
              <ExternalLink className="w-5 h-5" />
              Ouvrir dans un nouvel onglet
            </Button>
            
            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full gap-3 h-12 text-base"
              size="lg"
            >
              <Download className="w-5 h-5" />
              Télécharger le PDF
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-muted-foreground"
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};