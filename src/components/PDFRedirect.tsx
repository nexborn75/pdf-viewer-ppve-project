import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  Download, 
  ExternalLink, 
  ArrowLeft, 
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { getPdfUrl, pdfDocuments } from "@/data/pdfs";

const PDFRedirect = () => {
  const { filename } = useParams<{ filename: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const pdfDoc = pdfDocuments.find(doc => doc.filename === filename);
  const title = pdfDoc?.title || filename || 'Document PDF';
  const pdfUrl = filename ? getPdfUrl(filename) : '';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(pdfUrl);
      setCopied(true);
      toast({
        title: "URL copiée !",
        description: "Collez cette URL dans un nouvel onglet pour accéder au PDF",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erreur de copie",
        description: "Impossible de copier l'URL automatiquement",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!filename) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Fichier non trouvé</h2>
          <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Accès PDF Bloqué</h1>
          <p className="text-muted-foreground">
            L'environnement de développement bloque l'affichage direct des PDFs
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge variant="outline" className="mb-4">{filename}.pdf</Badge>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">URL directe du PDF :</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-background p-2 rounded text-xs break-all">
                  {pdfUrl}
                </code>
                <Button
                  onClick={handleCopyUrl}
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button onClick={handleCopyUrl} className="gap-2" variant="default">
                <Copy className="h-4 w-4" />
                Copier l'URL
              </Button>
              
              <Button onClick={handleDownload} className="gap-2" variant="outline">
                <Download className="h-4 w-4" />
                Télécharger
              </Button>
              
              <Button onClick={() => navigate('/')} className="gap-2" variant="ghost">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📋 Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <span>Cliquez sur <strong>"Copier l'URL"</strong> ci-dessus</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <span>Ouvrez un <strong>nouvel onglet</strong> dans votre navigateur</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <span><strong>Collez l'URL</strong> dans la barre d'adresse et appuyez sur Entrée</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                <span>Le PDF s'ouvrira avec tous les contrôles natifs du navigateur</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PDFRedirect;