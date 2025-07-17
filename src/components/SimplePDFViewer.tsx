
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
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { getPdfUrl, pdfDocuments } from "@/data/pdfs";

const SimplePDFViewer = () => {
  const { filename } = useParams<{ filename: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Trouver le document correspondant
  const pdfDoc = pdfDocuments.find(doc => doc.filename === filename);
  const title = pdfDoc?.title || filename || 'Document PDF';
  const pdfUrl = filename ? getPdfUrl(filename) : '';

  // Diagnostic complet au chargement
  useEffect(() => {
    const runDiagnostic = async () => {
      console.log('=== DIAGNOSTIC PDF VIEWER ===');
      console.log('Filename:', filename);
      console.log('PDF Document:', pdfDoc);
      console.log('Generated URL:', pdfUrl);
      console.log('User Agent:', navigator.userAgent);
      console.log('Location:', window.location.href);
      
      const debug = {
        filename,
        pdfDoc,
        pdfUrl,
        userAgent: navigator.userAgent,
        location: window.location.href,
        timestamp: new Date().toISOString()
      };
      
      setDebugInfo(debug);
      
      // Test de connectivité vers le PDF
      if (pdfUrl) {
        try {
          console.log('Test de connectivité vers:', pdfUrl);
          const response = await fetch(pdfUrl, { method: 'HEAD' });
          console.log('Réponse fetch:', response.status, response.statusText);
          debug.fetchTest = {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
          };
        } catch (error) {
          console.error('Erreur fetch:', error);
          debug.fetchError = error.message;
          setErrorDetails(`Erreur de connectivité: ${error.message}`);
          setHasError(true);
        }
      }
      
      setDebugInfo({...debug});
    };
    
    runDiagnostic();
  }, [filename, pdfUrl, pdfDoc]);

  const handleDownload = () => {
    if (!filename) return;
    console.log('Tentative de téléchargement:', pdfUrl);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoad = () => {
    console.log('PDF chargé avec succès');
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = (event: any) => {
    console.error('Erreur iframe:', event);
    setIsLoading(false);
    setHasError(true);
    setErrorDetails('Impossible de charger le PDF dans l\'iframe');
  };

  const testDirectAccess = () => {
    console.log('Test d\'accès direct:', pdfUrl);
    window.open(pdfUrl, '_blank');
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
              Test direct
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
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="text-center max-w-2xl p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground mb-4">Chargement du document...</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>URL:</strong> {pdfUrl}</p>
                <p><strong>Navigateur:</strong> {navigator.userAgent.split(')')[0]})</p>
              </div>
            </div>
          </div>
        )}

        {/* Erreur de chargement avec diagnostic complet */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10 p-4">
            <div className="text-center max-w-4xl">
              <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Problème de chargement du PDF</h3>
              <p className="text-muted-foreground mb-4">
                {errorDetails || "Le document ne peut pas être affiché dans le navigateur."}
              </p>
              
              {/* Informations de diagnostic */}
              <div className="bg-muted p-4 rounded-lg text-left text-sm mb-4 max-h-64 overflow-auto">
                <h4 className="font-semibold mb-2">Diagnostic technique:</h4>
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
              
              <div className="flex gap-2 justify-center flex-wrap">
                <Button 
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                    window.location.reload();
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
                  Accès direct
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
                  Retour accueil
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Visionneuse PDF avec iframe */}
        {!hasError && (
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title={title}
            onLoad={handleLoad}
            onError={handleError}
            style={{ minHeight: 'calc(100vh - 80px)' }}
            sandbox="allow-same-origin allow-scripts"
          />
        )}
      </div>
    </div>
  );
};

export default SimplePDFViewer;
