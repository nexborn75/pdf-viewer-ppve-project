
export interface PDFDocument {
  id: string;
  title: string;
  filename: string;
  category: 'ppve' | 'additional';
}

export const pdfDocuments: PDFDocument[] = [
  // Documents PPVE
  {
    id: 'cdea-services',
    title: 'CDEA Services techniques',
    filename: 'CDEA_Services_techniques',
    category: 'ppve'
  },
  {
    id: 'conseil-essonne',
    title: 'Conseil départemental Essonne',
    filename: 'Conseil_departemental_de_Essonne',
    category: 'ppve'
  },
  {
    id: 'dgac',
    title: 'DGAC',
    filename: 'DGAC',
    category: 'ppve'
  },
  {
    id: 'drac-idf',
    title: 'DRAC Ile de France',
    filename: 'DRAC_Ile_de_France',
    category: 'ppve'
  },
  {
    id: 'eau-coeur-plan',
    title: 'Eau Coeur Essonne - Plan',
    filename: 'Eau_Coeur_Essonne_Plan',
    category: 'ppve'
  },
  {
    id: 'eau-coeur',
    title: 'Eau Coeur Essonne',
    filename: 'Eau_Coeur_Essonne',
    category: 'ppve'
  },
  {
    id: 'enedis',
    title: 'ENEDIS',
    filename: 'ENEDIS',
    category: 'ppve'
  },
  {
    id: 'rte1',
    title: 'RTE 1',
    filename: 'RTE1',
    category: 'ppve'
  },
  {
    id: 'rte2',
    title: 'RTE 2',
    filename: 'RTE2',
    category: 'ppve'
  },
  {
    id: 'rte-plan1',
    title: 'RTE plan 1',
    filename: 'RTE_plan1',
    category: 'ppve'
  },
  {
    id: 'rte-plan2',
    title: 'RTE plan 2',
    filename: 'RTE_plan2',
    category: 'ppve'
  },
  {
    id: 'sdis91',
    title: 'SDIS 91',
    filename: 'SDIS91',
    category: 'ppve'
  },
  {
    id: 'syndicat-orge',
    title: 'Syndicat de l\'Orge',
    filename: 'Syndicat_de_Orge',
    category: 'ppve'
  },
  {
    id: 'total-energie',
    title: 'TOTALEnergie',
    filename: 'TOTALEnergie',
    category: 'ppve'
  },
  // Documents supplémentaires
  {
    id: 'dossier-permis',
    title: 'Dossier permis d\'aménager',
    filename: 'Dossier_permis_amenager_etude_impact',
    category: 'additional'
  },
  {
    id: 'avis-mrae',
    title: 'Avis autorité environnementale',
    filename: 'Avis_autorite_environnementale_MRAE',
    category: 'additional'
  },
  {
    id: 'reponse-mrae',
    title: 'Réponse autorité environnementale',
    filename: 'Reponse_autorite_environnementale_MRAE',
    category: 'additional'
  }
];

export const getPdfUrl = (filename: string): string => {
  // Les fichiers PDF sont dans le dossier public/PPVE/
  return `/PPVE/${filename}.pdf`;
};
