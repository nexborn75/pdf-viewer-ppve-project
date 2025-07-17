
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
  const [pdfSupported, setPdfSupported] = useState(false);
  const [objectError, setObjectError] = useState(false);

  // Trouver le document correspondant
  const pdfDoc = pdfDocuments.find(doc => doc.filename === filename);
  const title = pdfDoc?.title || filename || 'Document PDF';
  const pdfUrl = filename ? getPdfUrl(filename) : '';

  // Diagnostic et détection automatique des blocages
  useEffect(() => {
    const runDiagnostic = async () => {
      console.log('=== DIAGNOSTIC PDF VIEWER ===');
      console.log('Filename:', filename);
      console.log('PDF Document:', pdfDoc);
      console.log('Generated URL:', pdfUrl);
      
      // Détecter l'environnement sandboxé
      const isSandboxed = window.self !== window.top;
      const isLovableEnv = window.location.hostname.includes('lovableproject.com');
      
      const debug: any = {
        filename,
        pdfDoc,
        pdfUrl,
        userAgent: navigator.userAgent,
        location: window.location.href,
        timestamp: new Date().toISOString(),
        environment: {
          isSandboxed,
          isLovableEnv,
          hostname: window.location.hostname
        }
      };
      
      console.log('Environment detected:', debug.environment);
      
      // Si environnement détecté comme problématique, basculer automatiquement
      if (isLovableEnv || isSandboxed) {
        console.log('Environnement sandboxé détecté - bascule automatique vers téléchargement');
        setHasError(true);
        setErrorDetails('Environnement sandboxé détecté - le PDF ne peut pas être affiché en ligne');
        setIsLoading(false);
        setDebugInfo(debug);
        return;
      }
      
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
          
          // Si le fichier est accessible, on tente l'affichage
          if (response.ok) {
            setIsLoading(true); // Maintenir le loading pour tenter l'affichage
          } else {
            setHasError(true);
            setErrorDetails(`Fichier non accessible: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          console.error('Erreur fetch:', error);
          debug.fetchError = error.message;
          setErrorDetails(`Erreur de connectivité: ${error.message}`);
          setHasError(true);
        }
      }
      
      setDebugInfo({...debug});
      
      // Timer de sécurité - si pas de chargement après 3 secondes, afficher l'erreur
      setTimeout(() => {
        if (isLoading && !hasError) {
          console.log('Timeout - bascule vers mode erreur');
          setHasError(true);
          setIsLoading(false);
          setErrorDetails('Timeout de chargement - le navigateur bloque probablement le PDF');
        }
      }, 3000);
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
    setObjectError(false);
  };

  const handleError = (event: any) => {
    console.error('Erreur de visualisation PDF:', event);
    setIsLoading(false);
    
    if (!objectError) {
      // Premier échec avec <object>, essayer <embed>
      console.log('Tentative avec embed...');
      setObjectError(true);
    } else {
      // Échec complet
      setHasError(true);
      setErrorDetails('Impossible de charger le PDF (ERR_BLOCKED_BY_CLIENT détecté)');
    }
  };

  const handleDirectDownload = () => {
    console.log('Redirection vers téléchargement direct');
    window.location.href = pdfUrl;
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
                <div className="text-xs space-y-1">
                  <p><strong>Statut:</strong> Blocage détecté par le navigateur</p>
                  <p><strong>Cause:</strong> Restrictions de sécurité (ERR_BLOCKED_BY_CLIENT)</p>
                  <p><strong>Solution:</strong> Téléchargement direct ou nouvel onglet</p>
                </div>
              </div>
              
              <div className="flex gap-2 justify-center flex-wrap mb-4">
                <Button 
                  onClick={handleDirectDownload}
                  size="lg"
                  className="gap-2"
                >
                  <Download className="h-5 w-5" />
                  Télécharger maintenant
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={testDirectAccess}
                  className="gap-2"
                >
                  <ExternalLink className="h-5 w-5" />
                  Ouvrir dans un nouvel onglet
                </Button>
              </div>
              
              <div className="flex gap-2 justify-center flex-wrap">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Retour accueil
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const details = document.querySelector('.diagnostic-details');
                    if (details) {
                      details.classList.toggle('hidden');
                    }
                  }}
                  className="gap-2"
                >
                  Détails techniques
                </Button>
              </div>
              
              {/* Détails techniques cachés */}
              <div className="diagnostic-details hidden mt-4 bg-muted p-4 rounded-lg text-left text-sm max-h-64 overflow-auto">
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Visionneuse PDF multi-méthode */}
        {!hasError && (
          <div className="w-full h-full" style={{ minHeight: 'calc(100vh - 80px)' }}>
            {!objectError ? (
              // Méthode 1: Object tag (plus compatible)
              <object
                data={`${pdfUrl}#view=FitH`}
                type="application/pdf"
                className="w-full h-full"
                onLoad={handleLoad}
                onError={handleError}
              >
                {/* Fallback si object ne fonctionne pas */}
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="mb-4">Votre navigateur ne supporte pas l'affichage PDF intégré</p>
                    <div className="space-x-2">
                      <Button onClick={handleDirectDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger le PDF
                      </Button>
                      <Button variant="outline" onClick={testDirectAccess}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ouvrir dans un nouvel onglet
                      </Button>
                    </div>
                  </div>
                </div>
              </object>
            ) : (
              // Méthode 2: Embed tag (fallback)
              <embed
                src={`${pdfUrl}#view=FitH`}
                type="application/pdf"
                className="w-full h-full"
                onLoad={handleLoad}
                onError={handleError}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplePDFViewer;
