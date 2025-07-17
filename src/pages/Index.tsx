import { PDFCard } from "@/components/PDFCard";
import { PDFDiagnostic } from "@/components/PDFDiagnostic";
import { pdfDocuments, getPdfUrl } from "@/data/pdfs";
import { openPdfWithFallback, downloadPdfWithFallback } from "@/utils/pdfUtils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, FolderOpen, ChevronDown, ChevronRight, Folder, Settings } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [isPPVEOpen, setIsPPVEOpen] = useState(false);
  const [isPermisOpen, setIsPermisOpen] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  
  const ppveDocuments = pdfDocuments.filter(doc => doc.category === 'ppve');
  const additionalDocuments = pdfDocuments.filter(doc => doc.category === 'additional');
  const permisDocuments = pdfDocuments.filter(doc => doc.category === 'permis-amenager');

  const handleViewPdf = async (filename: string, title: string) => {
    console.log('Tentative d\'ouverture du PDF:', filename);
    await openPdfWithFallback(filename, title);
  };

  const handleDownloadPdf = async (filename: string, title: string) => {
    console.log('Tentative de téléchargement du PDF:', filename);
    await downloadPdfWithFallback(filename, title);
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDiagnostic(!showDiagnostic)}
              className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20"
            >
              <Settings className="w-4 h-4 mr-2" />
              {showDiagnostic ? 'Masquer diagnostic' : 'Diagnostic PDFs'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Diagnostic des PDFs */}
        {showDiagnostic && (
          <div className="mb-8">
            <PDFDiagnostic />
            <Separator className="mt-8" />
          </div>
        )}

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
