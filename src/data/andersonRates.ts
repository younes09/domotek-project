export type DeliveryType = "home" | "desk"; // "home" = À Domicile, "desk" = Bureau / Stopdesk

export interface AndersonTariff {
  code: number;
  name: string;
  delay: string;
  homePrice: number;
  deskPrice: number | null; // null si non disponible en bureau
}

/**
 * Grille tarifaire officielle Anderson E-Commerce Logistics
 * Wilaya de départ : ALGER
 */
export const ANDERSON_DELIVERY_RATES: AndersonTariff[] = [
  { code: 1, name: "Adrar", delay: "J/J+5", homePrice: 1650, deskPrice: 850 },
  { code: 2, name: "Chlef", delay: "J/J+1", homePrice: 700, deskPrice: 450 },
  { code: 3, name: "Laghouat", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 4, name: "Oum El Bouaghi", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 5, name: "Batna", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 6, name: "Béjaïa", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 7, name: "Biskra", delay: "J/J+1", homePrice: 850, deskPrice: 650 },
  { code: 8, name: "Béchar", delay: "J/J+3", homePrice: 1200, deskPrice: 650 },
  { code: 9, name: "Blida", delay: "J/J+1", homePrice: 650, deskPrice: 400 },
  { code: 10, name: "Bouira", delay: "J/J+1", homePrice: 650, deskPrice: 450 },
  { code: 11, name: "Tamanrasset", delay: "J/J+5", homePrice: 1800, deskPrice: 1000 },
  { code: 12, name: "Tébessa", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 13, name: "Tlemcen", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 14, name: "Tiaret", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 15, name: "Tizi Ouzou", delay: "J/J+1", homePrice: 650, deskPrice: 450 },
  { code: 16, name: "Alger", delay: "J/J+1", homePrice: 450, deskPrice: 300 },
  { code: 17, name: "Djelfa", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 18, name: "Jijel", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 19, name: "Sétif", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 20, name: "Saïda", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 21, name: "Skikda", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 22, name: "Sidi Bel Abbès", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 23, name: "Annaba", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 24, name: "Guelma", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 25, name: "Constantine", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 26, name: "Médéa", delay: "J/J+1", homePrice: 650, deskPrice: 450 },
  { code: 27, name: "Mostaganem", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 28, name: "M'Sila", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 29, name: "Mascara", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 30, name: "Ouargla", delay: "J/J+2", homePrice: 1000, deskPrice: 500 },
  { code: 31, name: "Oran", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 32, name: "El Bayadh", delay: "J/J+2", homePrice: 850, deskPrice: 450 },
  { code: 33, name: "Illizi", delay: "J/J+9", homePrice: 1700, deskPrice: 850 },
  { code: 34, name: "Bordj Bou Arréridj", delay: "J/J+1", homePrice: 650, deskPrice: 450 },
  { code: 35, name: "Boumerdès", delay: "J/J+1", homePrice: 650, deskPrice: 400 },
  { code: 36, name: "El Tarf", delay: "J/J+1", homePrice: 850, deskPrice: 550 },
  { code: 37, name: "Tindouf", delay: "J/J+5", homePrice: 1650, deskPrice: null },
  { code: 38, name: "Tissemsilt", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 39, name: "El Oued", delay: "J/J+2", homePrice: 950, deskPrice: 600 },
  { code: 40, name: "Khenchela", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 41, name: "Souk Ahras", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 42, name: "Tipaza", delay: "J/J+1", homePrice: 650, deskPrice: 450 },
  { code: 43, name: "Mila", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 44, name: "Aïn Defla", delay: "J/J+1", homePrice: 650, deskPrice: 450 },
  { code: 45, name: "Naâma", delay: "J/J+1", homePrice: 950, deskPrice: 500 },
  { code: 46, name: "Aïn Témouchent", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 47, name: "Ghardaïa", delay: "J/J+2", homePrice: 950, deskPrice: 650 },
  { code: 48, name: "Relizane", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 49, name: "Timimoun", delay: "J/J+5", homePrice: 1650, deskPrice: null },
  { code: 50, name: "Bordj Badji Mokhtar", delay: "J/J+10", homePrice: 2000, deskPrice: null },
  { code: 51, name: "Ouled Djellal", delay: "J/J+1", homePrice: 950, deskPrice: 450 },
  { code: 52, name: "Béni Abbès", delay: "J/J+3", homePrice: 1300, deskPrice: null },
  { code: 53, name: "In Salah", delay: "J/J+5", homePrice: 1650, deskPrice: 850 },
  { code: 54, name: "In Guezzam", delay: "J/J+5", homePrice: 2000, deskPrice: null },
  { code: 55, name: "Touggourt", delay: "J/J+2", homePrice: 950, deskPrice: 500 },
  { code: 56, name: "Djanet", delay: "J/J+9", homePrice: 2000, deskPrice: 1000 },
  { code: 57, name: "El M'Ghair", delay: "J/J+5", homePrice: 950, deskPrice: 500 },
  { code: 58, name: "El Menia", delay: "J/J+5", homePrice: 950, deskPrice: null },
  // Nouvelles wilayas rattachées
  { code: 59, name: "Aflou", delay: "J/J+2", homePrice: 850, deskPrice: 450 },
  { code: 60, name: "El Abiodh Sidi Cheikh", delay: "J/J+2", homePrice: 850, deskPrice: 450 },
  { code: 61, name: "El Aricha", delay: "J/J+2", homePrice: 850, deskPrice: 450 },
  { code: 62, name: "El Kantara", delay: "J/J+2", homePrice: 850, deskPrice: 650 },
  { code: 63, name: "Barika", delay: "J/J+2", homePrice: 850, deskPrice: 450 },
  { code: 64, name: "Bousaâda", delay: "J/J+2", homePrice: 850, deskPrice: 450 },
  { code: 65, name: "Bir El Ater", delay: "J/J+2", homePrice: 850, deskPrice: 450 },
  { code: 66, name: "Ksar El Boukhari", delay: "J/J+1", homePrice: 650, deskPrice: 450 },
  { code: 67, name: "Ksar Chellala", delay: "J/J+2", homePrice: 850, deskPrice: 450 },
  { code: 68, name: "Aïn Oussera", delay: "J/J+1", homePrice: 850, deskPrice: 450 },
  { code: 69, name: "Messaad", delay: "J/J+2", homePrice: 850, deskPrice: 450 },
];

/**
 * Trouve le tarif Anderson pour une wilaya donnée (chaîne comme "16 - Alger" ou "Alger")
 */
export function getAndersonTariff(wilayaInput: string): AndersonTariff | null {
  if (!wilayaInput) return null;

  // Extraction du code numérique si format "16 - Alger"
  const matchCode = wilayaInput.match(/^(\d{1,2})/);
  if (matchCode) {
    const code = parseInt(matchCode[1], 10);
    const found = ANDERSON_DELIVERY_RATES.find((r) => r.code === code);
    if (found) return found;
  }

  // Recherche par nom normalisé
  const clean = wilayaInput
    .replace(/^\d+\s*[-–]\s*/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  return (
    ANDERSON_DELIVERY_RATES.find((r) => {
      const nameClean = r.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
      return nameClean === clean || clean.includes(nameClean) || nameClean.includes(clean);
    }) || null
  );
}

/** Informations de l'entreprise de livraison */
export const ANDERSON_COMPANY_INFO = {
  name: "Anderson E-Commerce Logistics",
  shortName: "Anderson Logistics",
  departureWilaya: "16 - Alger",
  headquarters: "Oued Smar - Alger",
  legalForm: "SPA au capital de 110 000 000 DA",
  badge: "Transporteur Officiel",
};
