// Utilitaire pour gérer les URLs des PDFs avec fallback
export const checkPdfAvailability = async (filename: string): Promise<string> => {
  // Essayer d'abord dans le nouveau dossier PDF
  const pdfUrl = `/PDF/${filename}.pdf`;
  
  try {
    const response = await fetch(pdfUrl, { method: 'HEAD' });
    if (response.ok) {
      return pdfUrl;
    }
  } catch (error) {
    console.log(`PDF non trouvé dans /PDF/, tentative dans /PPVE/`);
  }
  
  // Fallback vers l'ancien dossier PPVE
  const ppveUrl = `/PPVE/${filename}.pdf`;
  try {
    const response = await fetch(ppveUrl, { method: 'HEAD' });
    if (response.ok) {
      return ppveUrl;
    }
  } catch (error) {
    console.log(`PDF non trouvé dans /PPVE/ non plus`);
  }
  
  // Retourner l'URL PDF par défaut même si non trouvé
  return pdfUrl;
};

export const openPdfWithFallback = async (filename: string, title: string) => {
  const url = await checkPdfAvailability(filename);
  console.log(`Ouverture du PDF: ${url}`);
  window.open(url, '_blank');
};

export const downloadPdfWithFallback = async (filename: string, title: string) => {
  const url = await checkPdfAvailability(filename);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};