import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPdfUrl } from "@/data/pdfs";

const PDFRedirect = () => {
  const { filename } = useParams<{ filename: string }>();

  useEffect(() => {
    if (filename) {
      const pdfUrl = getPdfUrl(filename);
      // Redirection immédiate sans interface React
      window.location.replace(pdfUrl);
    }
  }, [filename]);

  // Page de fallback au cas où la redirection échoue
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirection vers le PDF...</p>
        {filename && (
          <p className="text-sm text-muted-foreground mt-2">
            Si la redirection ne fonctionne pas, 
            <a 
              href={getPdfUrl(filename)} 
              className="text-primary hover:underline ml-1"
              target="_blank" 
              rel="noopener noreferrer"
            >
              cliquez ici
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default PDFRedirect;