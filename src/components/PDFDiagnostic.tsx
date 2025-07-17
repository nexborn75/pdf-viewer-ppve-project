import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { pdfDocuments, getPdfUrl } from "@/data/pdfs";

interface DiagnosticResult {
  filename: string;
  status: 'success' | 'error' | 'pending';
  statusCode?: number;
  url: string;
}

export const PDFDiagnostic = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults([]);
    
    const testResults: DiagnosticResult[] = [];
    
    for (const pdf of pdfDocuments) {
      const url = getPdfUrl(pdf.filename);
      const result: DiagnosticResult = {
        filename: pdf.filename,
        status: 'pending',
        url
      };
      
      try {
        const response = await fetch(url, { method: 'HEAD' });
        result.status = response.ok ? 'success' : 'error';
        result.statusCode = response.status;
      } catch (error) {
        result.status = 'error';
        result.statusCode = 0;
      }
      
      testResults.push(result);
      setResults([...testResults]);
      
      // Petit délai pour éviter de surcharger le serveur
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (result: DiagnosticResult) => {
    if (result.status === 'success') {
      return <Badge variant="default" className="bg-green-100 text-green-800">✓ Accessible</Badge>;
    }
    if (result.status === 'error') {
      return <Badge variant="destructive">✗ Erreur {result.statusCode}</Badge>;
    }
    return <Badge variant="secondary">En cours...</Badge>;
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Diagnostic d'accessibilité des PDFs
        </CardTitle>
        <div className="flex gap-4 text-sm">
          <span className="text-green-600">✓ Accessibles: {successCount}</span>
          <span className="text-red-600">✗ Erreurs: {errorCount}</span>
          <span className="text-gray-600">Total: {pdfDocuments.length} fichiers</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostic} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Test en cours... ({results.length}/{pdfDocuments.length})
            </>
          ) : (
            'Lancer le diagnostic'
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="font-medium text-sm">{result.filename}.pdf</div>
                    <div className="text-xs text-muted-foreground">{result.url}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(result)}
                  {result.status === 'success' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(result.url, '_blank')}
                    >
                      Ouvrir
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length === pdfDocuments.length && !isRunning && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Recommandations :</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              {errorCount > 0 && (
                <>
                  <li>• Vérifiez que tous les PDFs sont bien uploadés dans le dossier PPVE sur IONOS</li>
                  <li>• Vérifiez les permissions des fichiers (644 ou 755)</li>
                  <li>• Assurez-vous que les noms de fichiers correspondent exactement</li>
                </>
              )}
              {successCount === pdfDocuments.length && (
                <li>• ✅ Tous les PDFs sont accessibles ! Le problème est résolu.</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};