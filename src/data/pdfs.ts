
export interface PDFDocument {
  id: string;
  title: string;
  filename: string;
  category: 'ppve' | 'additional' | 'permis-amenager';
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
  },
  
  // Demande de Permis d'aménager
  {
    id: 'cerfa-fleury',
    title: 'CERFA Formulaire Fleury Mérogis',
    filename: '00-_CERFA_Formulaire_Fleury_Merogis',
    category: 'permis-amenager'
  },
  {
    id: 'cerfa-plessis',
    title: 'CERFA Formulaire Le Plessis pate',
    filename: '00-_CERFA_Formulaire_Le_Plessis_pate',
    category: 'permis-amenager'
  },
  {
    id: 'cerfa-formulaire',
    title: 'CERFA Formulaire',
    filename: '00-_CERFA_Formulaire',
    category: 'permis-amenager'
  },
  {
    id: 'cerfa-recepisse',
    title: 'CERFA Récépissé de dépôt',
    filename: '00-_CERFA_Recepisse_de_depot',
    category: 'permis-amenager'
  },
  {
    id: 'pouvoir-depot',
    title: 'Pouvoir de dépôt',
    filename: '00-_Pouvoir_de_depot',
    category: 'permis-amenager'
  },
  {
    id: 'pa1-plan-situation',
    title: 'PA1- Plan de situation',
    filename: 'PA1-_Plan_de_situation',
    category: 'permis-amenager'
  },
  {
    id: 'pa2-notice-completee',
    title: 'PA2- Notice complétée',
    filename: 'PA2-_Notice_completee',
    category: 'permis-amenager'
  },
  {
    id: 'pa2-notice-terrain',
    title: 'PA2- Notice décrivant le terrain et le projet d\'aménagement',
    filename: 'PA2-_Notice_decrivant_le_terrain_et_le_projet_amenagement',
    category: 'permis-amenager'
  },
  {
    id: 'pa3-plan-actuel',
    title: 'PA3- Plan état actuel',
    filename: 'PA3-_Plan_etat_actuel',
    category: 'permis-amenager'
  },
  {
    id: 'pa4-01-plan-general',
    title: 'PA4- 01- Plan Général',
    filename: 'PA4-_01-_Plan_General',
    category: 'permis-amenager'
  },
  {
    id: 'pa4-01-plan-projet',
    title: 'PA4- 01- Plan Projet',
    filename: 'PA4-_01-_Plan_Projet',
    category: 'permis-amenager'
  },
  {
    id: 'pa4-02-coupes-projet',
    title: 'PA4- 02- Coupes Projet',
    filename: 'PA4-_02-_Coupes_Projet',
    category: 'permis-amenager'
  },
  {
    id: 'pa4-02-coupes',
    title: 'PA4- 02- Coupes',
    filename: 'PA4-_02-_Coupes',
    category: 'permis-amenager'
  },
  {
    id: 'pa4-03-nivellement',
    title: 'PA4- 03- Nivellement',
    filename: 'PA4-_03-_Nivellement',
    category: 'permis-amenager'
  },
  {
    id: 'pa4-03-plan-voirie',
    title: 'PA4- 03- Plan de voirie et de nivellement',
    filename: 'PA4-_03-_Plan_de_voirie_et_de_nivellement',
    category: 'permis-amenager'
  },
  {
    id: 'pa4-04-assainissement',
    title: 'PA4- 04- Assainissement',
    filename: 'PA4-_04-_Assainissement',
    category: 'permis-amenager'
  },
  {
    id: 'pa4-04-plan-assainissement',
    title: 'PA4- 04- Plan d\'assainissement',
    filename: 'PA4-_04-_Plan_assainissement',
    category: 'permis-amenager'
  },
  {
    id: 'pa4-05-detail-parcelles',
    title: 'PA4- 05- Détail des parcelles FLEURY MEROGIS',
    filename: 'PA4-_05-_Detail_des_parcelles_FLEURY_MEROGIS',
    category: 'permis-amenager'
  },
  {
    id: 'pa4-06-notice-hydraulique',
    title: 'PA4- 06- Notice hydraulique des noues',
    filename: 'PA4-_06-_Notice_hydraulique_des_noues',
    category: 'permis-amenager'
  },
  {
    id: 'pa14-etude-impact',
    title: 'PA14- Etude d\'impact',
    filename: 'PA14-_Etude_impact',
    category: 'permis-amenager'
  },
  {
    id: 'pa42-01-ccct-arrete',
    title: 'PA42- 01- CCCT - Arrêté approbation CCCT',
    filename: 'PA42-_01-_CCCT_-_Arrete_approbation_CCCT',
    category: 'permis-amenager'
  },
  {
    id: 'pa42-01-ccct-signe',
    title: 'PA42- 01- CCCT signé',
    filename: 'PA42-_01-_CCCT_signe',
    category: 'permis-amenager'
  },
  {
    id: 'pa42-02-annexe-cahier',
    title: 'PA42- 02- Annexe 1 Cahier des charges Parc energetique',
    filename: 'PA42-_02-_Annexe_1_Cahier_des_charges_Parc_energetique',
    category: 'permis-amenager'
  },
  {
    id: 'pa42-03-autorisation',
    title: 'PA42- 03- Autorisation aménageur',
    filename: 'PA42-_03-_Autorisation_amenageur',
    category: 'permis-amenager'
  }
];

export const getPdfUrl = (filename: string): string => {
  // Logique pour déterminer le bon dossier basé sur le filename
  const pdfDoc = pdfDocuments.find(doc => doc.filename === filename);
  
  if (pdfDoc?.category === 'ppve') {
    return `/PPVE/${filename}.pdf`;
  }
  
  // Par défaut, chercher dans PDF
  return `/PDF/${filename}.pdf`;
};
