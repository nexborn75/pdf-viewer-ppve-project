import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, ExternalLink } from "lucide-react";

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

export const PDFViewer = ({ isOpen, onClose, pdfUrl, title }: PDFViewerProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenExternal = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-4 pb-2 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-foreground">
              {title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenExternal}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Ouvrir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 p-4">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full border border-border rounded-lg bg-muted"
            title={title}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};