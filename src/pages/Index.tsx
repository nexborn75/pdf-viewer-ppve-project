import { PDFCard } from "@/components/PDFCard";
import { pdfDocuments, getPdfUrl } from "@/data/pdfs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, FolderOpen, ChevronDown, ChevronRight, Folder } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [isPPVEOpen, setIsPPVEOpen] = useState(false);
  const [isPermisOpen, setIsPermisOpen] = useState(false);
  
  const ppveDocuments = pdfDocuments.filter(doc => doc.category === 'ppve');
  const additionalDocuments = pdfDocuments.filter(doc => doc.category === 'additional');
  const permisDocuments = pdfDocuments.filter(doc => doc.category === 'permis-amenager');

  const handleViewPdf = (filename: string, title: string) => {
    const pdfUrl = getPdfUrl(filename);
    console.log('Tentative d\'ouverture du PDF:', pdfUrl);
    console.log('URL complète:', window.location.origin + pdfUrl);
    // Ouvre directement le PDF en plein écran dans un nouvel onglet
    window.open(pdfUrl, '_blank');
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
        {/* Section PPVE - Collapsible */}
        <div className="mb-12">
          <Collapsible open={isPPVEOpen} onOpenChange={setIsPPVEOpen}>
            <CollapsibleTrigger className="flex items-center gap-3 mb-6 w-full hover:bg-muted/50 p-4 rounded-lg transition-colors">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Folder className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  Documents PPVE
                </h2>
                <p className="text-muted-foreground">
                  Pièces Jointes aux Consultations des Parties Prenantes Externes
                </p>
              </div>
              <Badge variant="outline" className="mr-2">
                {ppveDocuments.length} documents
              </Badge>
              {isPPVEOpen ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            
            <CollapsibleContent className="animate-accordion-down">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pl-6">
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
            </CollapsibleContent>
          </Collapsible>
        </div>

        <Separator className="my-8" />

        {/* Section Demande de Permis d'aménager - Collapsible */}
        <div className="mb-12">
          <Collapsible open={isPermisOpen} onOpenChange={setIsPermisOpen}>
            <CollapsibleTrigger className="flex items-center gap-3 mb-6 w-full hover:bg-muted/50 p-4 rounded-lg transition-colors">
              <div className="p-2 bg-accent/50 rounded-lg">
                <Folder className="w-6 h-6 text-accent-foreground" />
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  Demande de Permis d'aménager
                </h2>
                <p className="text-muted-foreground">
                  Dossier administratif de demande de permis d'aménager
                </p>
              </div>
              <Badge variant="outline" className="mr-2">
                {permisDocuments.length} documents
              </Badge>
              {isPermisOpen ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            
            <CollapsibleContent className="animate-accordion-down">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-6">
                {permisDocuments.map((doc) => (
                  <PDFCard
                    key={doc.id}
                    title={doc.title}
                    filename={doc.filename}
                    onView={() => handleViewPdf(doc.filename, doc.title)}
                    onDownload={() => handleDownloadPdf(doc.filename, doc.title)}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
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
            Cliquez sur "Consulter" pour ouvrir le PDF en plein écran ou sur l'icône de téléchargement pour le sauvegarder
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
