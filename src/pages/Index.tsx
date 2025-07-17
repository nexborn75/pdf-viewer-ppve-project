import { useState } from "react";
import { PDFCard } from "@/components/PDFCard";
import { PDFViewer } from "@/components/PDFViewer";
import { pdfDocuments, getPdfUrl } from "@/data/pdfs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText, FolderOpen } from "lucide-react";

const Index = () => {
  const [selectedPdf, setSelectedPdf] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const ppveDocuments = pdfDocuments.filter(doc => doc.category === 'ppve');
  const additionalDocuments = pdfDocuments.filter(doc => doc.category === 'additional');

  const handleViewPdf = (filename: string, title: string) => {
    setSelectedPdf({
      url: getPdfUrl(filename),
      title
    });
  };

  const closePdfViewer = () => {
    setSelectedPdf(null);
  };

  const handleDownloadPdf = (filename: string, title: string) => {
    const link = document.createElement('a');
    link.href = getPdfUrl(filename);
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-document-hover text-primary-foreground">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary-foreground/20 rounded-lg">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Bibliothèque de Documents</h1>
              <p className="text-primary-foreground/80 text-lg">
                Consultation des documents administratifs et techniques
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-primary-foreground/70">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
              {pdfDocuments.length} documents disponibles
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Section PPVE */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FolderOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                Documents PPVE
              </h2>
              <p className="text-muted-foreground">
                Pièces Jointes aux Consultations des Parties Prenantes Externes
              </p>
            </div>
            <Badge variant="outline" className="ml-auto">
              {ppveDocuments.length} documents
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ppveDocuments.map((doc) => (
              <PDFCard
                key={doc.id}
                title={doc.title}
                filename={doc.filename}
                onView={() => handleViewPdf(doc.filename, doc.title)}
                onDownload={() => handleDownloadPdf(doc.filename, doc.title)}
              />
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Section Documents supplémentaires */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-secondary/50 rounded-lg">
              <FileText className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                Documents Complémentaires
              </h2>
              <p className="text-muted-foreground">
                Dossiers administratifs et études environnementales
              </p>
            </div>
            <Badge variant="outline" className="ml-auto">
              {additionalDocuments.length} documents
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalDocuments.map((doc) => (
              <PDFCard
                key={doc.id}
                title={doc.title}
                filename={doc.filename}
                onView={() => handleViewPdf(doc.filename, doc.title)}
                onDownload={() => handleDownloadPdf(doc.filename, doc.title)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-muted-foreground text-sm">
          <p>
            Cliquez sur "Consulter" pour ouvrir un document ou sur l'icône de téléchargement pour le sauvegarder
          </p>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <PDFViewer
          isOpen={!!selectedPdf}
          onClose={closePdfViewer}
          pdfUrl={selectedPdf.url}
          title={selectedPdf.title}
        />
      )}
    </div>
  );
};

export default Index;
