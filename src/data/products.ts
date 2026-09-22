import { ToggleLeft, Bell, Plug, RadioTower, ShieldCheck, Zap, Lightbulb, Video, Cpu } from "lucide-react";
import type { Product } from "../types";

/**
 * CATALOGUE OFFICIEL DOMOTEK
 * Contient les 12 équipements domotiques avec leurs 6 sections complètes :
 * - Description (longDesc)
 * - Caractéristiques (specs & characteristics)
 * - Compatibilité (compatibility)
 * - Installation (installation)
 * - Utilisation (usage)
 * - Questions fréquentes (faq)
 */
export const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "interrupteur-wifi-1-voie",
    name: "Interrupteur WiFi intelligent 1 voie",
    category: "interrupteurs",
    icon: ToggleLeft,
    sku: "DK-SW-WIFI1",
    shortDesc: "Contrôlez votre éclairage à distance depuis votre smartphone.",
    longDesc: "Remplacez votre interrupteur mural classique par ce modèle tactile connecté. Il s'intègre discrètement dans vos boîtes d'encastrement standard et vous offre un contrôle complet de l'éclairage localement au toucher ou à distance via l'application Smart Life / Tuya.",
    price: 2800,
    oldPrice: null,
    costPrice: 1500,
    quantity: 35,
    lowStockThreshold: 5,
    stock: "in",
    isNew: true,
    isBestSeller: false,
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"
    ],
    characteristics: "Interrupteur tactile en verre trempé anti-rayures, rétroéclairage LED doux personnalisable, mémoire d'état après coupure de courant et protection anti-surtension intégrée.",
    specs: [
      { name: "Tension nominale", value: "110-240V AC 50/60Hz" },
      { name: "Charge maximale", value: "600W (LED / Incandescente)" },
      { name: "Connectivité", value: "Wi-Fi 2.4 GHz (IEEE 802.11 b/g/n)" },
      { name: "Application", value: "Smart Life / Tuya Smart (Android & iOS)" },
      { name: "Matériau façade", value: "Verre trempé cristal résistant aux rayures" },
      { name: "Dimensions", value: "86 x 86 x 35 mm (standard mural)" },
      { name: "Garantie", value: "12 Mois avec échange à neuf" },
    ],
    compatibility: "• Compatible avec toutes les boîtes d'encastrement standard 60mm (rondes ou carrées).\n• Compatible avec ou sans fil neutre (condensateur inclus dans l'emballage pour installation sans neutre).\n• Compatible avec les commandes vocales Amazon Alexa et Google Assistant.\n• Compatible avec les automatisations Tuya et scénarios IFTTT.",
    installation: "1. Coupez impérativement le disjoncteur général avant toute manipulation électrique.\n2. Démontez votre ancien interrupteur mural.\n3. Raccordez le fil de Phase (L) sur la borne L et le retour de lampe sur la borne L1.\n4. Si votre boîte dispose d'un Neutre, branchez-le sur la borne N. Si vous n'avez pas de neutre, installez le condensateur fourni en parallèle aux bornes de l'ampoule.\n5. Vissez le mécanisme dans la boîte d'encastrement et clipsez la plaque de verre trempé.\n6. Rétablissez le courant au disjoncteur.",
    usage: "1. Téléchargez l'application 'Smart Life' sur l'App Store ou Google Play.\n2. Créez un compte et activez le Bluetooth de votre smartphone.\n3. Appuyez longuement sur la touche de l'interrupteur (environ 5 secondes) jusqu'à ce que le voyant clignote rapidement en bleu.\n4. Cliquez sur '+' dans l'application : l'appareil est détecté automatiquement.\n5. Saisissez le mot de passe de votre réseau WiFi 2.4 GHz.\n6. Vous pouvez désormais créer des plannings horaires, des comptes à rebours ou lier l'interrupteur à vos assistants vocaux.",
    faq: [
      {
        question: "Cet interrupteur fonctionne-t-il si je n'ai pas de fil Neutre dans mon mur ?",
        answer: "Oui tout à fait. Ce modèle est polyvalent : il peut être branché avec un fil neutre classique, ou sans fil neutre grâce au condensateur anti-scintillement fourni qui se branche directement au niveau de votre plafonnier."
      },
      {
        question: "L'interrupteur continue-t-il à fonctionner si Internet est coupé ?",
        answer: "Oui, la fonction tactile physique continue de fonctionner normalement pour allumer et éteindre la lumière, même sans connexion Internet ou WiFi."
      },
      {
        question: "Est-il compatible avec les ampoules LED basse consommation ?",
        answer: "Oui, il prend en charge toutes les ampoules LED courantes (à partir de 3W). Le condensateur prévient tout clignotement résiduel à l'extinction."
      }
    ]
  },
  {
    id: 2,
    slug: "interrupteur-wifi-2-voies",
    name: "Interrupteur WiFi intelligent 2 voies",
    category: "interrupteurs",
    icon: ToggleLeft,
    sku: "DK-SW-WIFI2",
    shortDesc: "Pilotez deux circuits indépendants depuis une seule application.",
    longDesc: "Idéal pour une pièce à deux points lumineux (ex: salon avec spots et lustre), cet interrupteur tactile double vous permet de commander chaque circuit de manière autonome, manuellement au mur ou à distance sur smartphone.",
    price: 3600,
    oldPrice: 4200,
    costPrice: 1950,
    quantity: 28,
    lowStockThreshold: 5,
    stock: "in",
    isNew: false,
    isBestSeller: true,
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80"
    ],
    characteristics: "Double commande indépendante, façade luxueuse en verre trempé, voyants discrets de repérage nocturne, programmation indépendante par circuit.",
    specs: [
      { name: "Tension d'entrée", value: "110-240V AC 50/60Hz" },
      { name: "Puissance max.", value: "600W par voie (1200W total)" },
      { name: "Nombre de voies", value: "2 circuits séparés" },
      { name: "Connectivité", value: "Wi-Fi 2.4 GHz (b/g/n)" },
      { name: "Application", value: "Smart Life / Tuya Smart" },
      { name: "Dimensions", value: "86 x 86 x 35 mm" },
      { name: "Garantie", value: "12 Mois DomoTek" }
    ],
    compatibility: "• Compatible avec toutes les boîtes murales standard entraxe 60mm.\n• Compatible avec les ampoules LED, halogènes et fluocompactes.\n• Compatible Amazon Alexa, Google Assistant et raccourcis Siri.\n• Prise en charge des scénarios domotiques croisés.",
    installation: "1. Coupez le disjoncteur général d'éclairage.\n2. Retirez l'ancien interrupteur double.\n3. Raccordez la Phase sur la borne L, le premier circuit sur L1 et le deuxième circuit sur L2.\n4. Raccordez le neutre (si disponible) ou installez le condensateur sur le circuit L1.\n5. Fixez le boîtier et enclenchez la façade vitrée.\n6. Remettez le courant.",
    usage: "1. Lancez l'application Smart Life.\n2. Passez en mode appairage en maintenant le bouton 1 enfoncé pendant 6 secondes.\n3. Confirmez l'ajout dans l'application.\n4. Vous pouvez nommer chaque circuit séparément (ex: 'Plafonnier' et 'Appliques') pour les commander distinctement à la voix.",
    faq: [
      {
        question: "Puis-je commander chaque voie séparément avec Google ou Alexa ?",
        answer: "Oui, chaque voie apparaît comme un interrupteur distinct dans Google Home et Amazon Alexa. Vous pouvez par exemple dire 'Allume le lustre' sans allumer les spots."
      },
      {
        question: "Peut-on désactiver le voyant bleu la nuit pour une chambre ?",
        answer: "Oui, dans les paramètres de l'application Smart Life, vous pouvez régler ou éteindre complètement le voyant lumineux de veille."
      }
    ]
  },
  {
    id: 3,
    slug: "detecteur-ouverture-porte-fenetre",
    name: "Détecteur d'ouverture Porte/Fenêtre",
    category: "capteurs",
    icon: Bell,
    sku: "DK-SEN-DOOR",
    shortDesc: "Recevez une alerte dès qu'une porte ou une fenêtre s'ouvre.",
    longDesc: "Ce capteur magnétique ultra-compact surveille l'ouverture et la fermeture de vos portes, fenêtres, tiroirs ou portails. Il vous alerte instantanément sur votre smartphone en cas d'intrusion ou d'oubli.",
    price: 2200,
    oldPrice: null,
    costPrice: 1100,
    quantity: 45,
    lowStockThreshold: 8,
    stock: "in",
    isNew: false,
    isBestSeller: true,
    characteristics: "Conception miniature et discrète, autonomie jusqu'à 2 ans sur pile standard, notification push instantanée en moins de 2 secondes, historique des ouvertures consigné.",
    specs: [
      { name: "Alimentation", value: "Pile bouton CR2032 (fournie)" },
      { name: "Autonomie estimée", value: "18 à 24 mois (selon usage)" },
      { name: "Distance de détection", value: "Écartement max. 15 mm" },
      { name: "Protocole", value: "Wi-Fi 2.4 GHz autonome (sans hub requis)" },
      { name: "Température de service", value: "-10°C à +50°C" },
      { name: "Fixation", value: "Adhésif haute adhérence 3M inclus" },
      { name: "Garantie", value: "12 Mois" }
    ],
    compatibility: "• Compatible avec tout type de porte (bois, PVC, aluminium, blindée).\n• Compatible avec fenêtres battantes, coulissantes et velux.\n• Compatible Smart Life / Tuya Smart.\n• Peut déclencher une sirène connectée ou allumer automatiquement un éclairage à l'ouverture.",
    installation: "1. Nettoyez soigneusement la surface avec un chiffon propre et sec.\n2. Décollez la protection adhésive 3M.\n3. Collez la partie principale sur le cadre fixe (dormant) et la partie magnétique sur la partie mobile (battant).\n4. Veillez à ce que l'espacement entre les deux éléments soit inférieur à 15 mm lorsque la porte est fermée.",
    usage: "1. Retirez la languette isolante de la pile.\n2. Maintenez le bouton reset à l'aide de l'épingle fournie jusqu'au clignotement rapide du voyant.\n3. Ajoutez le capteur dans l'application Smart Life.\n4. Activez les notifications push et configurez vos automatisations de sécurité.",
    faq: [
      {
        question: "Nécessite-t-il une passerelle ou une box domotique supplémentaire ?",
        answer: "Non, ce modèle se connecte directement à votre réseau WiFi domestique sans nécessiter de passerelle ni de pont supplémentaire."
      },
      {
        question: "Suis-je alerté si la pile devient faible ?",
        answer: "Oui, l'application surveille le niveau de batterie et vous envoie une alerte automatique dès que le niveau passe en dessous de 20%."
      }
    ]
  },
  {
    id: 4,
    slug: "prise-connectee-16a",
    name: "Prise connectée WiFi 16A",
    category: "prises",
    icon: Plug,
    sku: "DK-PLUG-16A",
    shortDesc: "Allumez et éteignez vos appareils depuis votre smartphone.",
    longDesc: "Transformez n'importe quel appareil électrique en équipement intelligent. Idéale pour surveiller votre consommation, programmer un chauffe-eau, climatiseur, chauffage d'appoint ou machine à café en toute simplicité.",
    price: 2500,
    oldPrice: null,
    costPrice: 1250,
    quantity: 40,
    lowStockThreshold: 6,
    stock: "in",
    isNew: true,
    isBestSeller: false,
    characteristics: "Mesure de puissance et consommation d'électricité (kWh) en temps réel, minuterie et calendrier programmables, mémoire de coupure et volets de sécurité pour enfants.",
    specs: [
      { name: "Tension de service", value: "100-240V AC 50/60Hz" },
      { name: "Courant maximum", value: "16A (jusqu'à 3680W)" },
      { name: "Suivi énergie", value: "Tension (V), Courant (mA), Puissance (W), Cumul (kWh)" },
      { name: "Format prise", value: "Standard européen / français (Type E/F avec terre)" },
      { name: "Sécurité", value: "Protection contre les surcharges et surtensions" },
      { name: "Garantie", value: "12 Mois DomoTek" }
    ],
    compatibility: "• S'adapte sur toutes les prises murales 220V avec broche de terre.\n• Compatible avec appareils électroménagers jusqu'à 3680W.\n• Compatible Tuya Smart, Google Home, Amazon Alexa.",
    installation: "1. Branchez la prise connectée directement dans votre prise murale existante.\n2. Aucune modification électrique ni outil nécessaire.\n3. Branchez l'appareil de votre choix sur la prise connectée.",
    usage: "1. Branchez la prise, le bouton clignote.\n2. Ouvrez l'application Smart Life et acceptez l'ajout de la prise détectée en Bluetooth.\n3. Contrôlez l'alimentation d'un geste, créez des plannings ou consultez les graphiques de consommation journaliers et mensuels.",
    faq: [
      {
        question: "Puis-je brancher un gros appareil comme un radiateur ou climatiseur ?",
        answer: "Oui, la prise est calibrée pour 16A (3680W max), ce qui convient parfaitement aux climatiseurs, chauffages d'appoint, chauffe-eaux et fers à repasser."
      },
      {
        question: "La prise garde-t-elle la programmation en cas de coupure de courant ?",
        answer: "Oui, tous les réglages et plannings sont conservés dans le cloud. De plus, vous pouvez choisir si la prise doit redémarrer éteinte, allumée ou dans son état antérieur."
      }
    ]
  },
  {
    id: 5,
    slug: "telecommande-rf-4-canaux",
    name: "Télécommande RF universelle 4 canaux",
    category: "telecommandes",
    icon: RadioTower,
    sku: "DK-RC-RF4",
    shortDesc: "Centralisez le pilotage de plusieurs appareils sur une télécommande.",
    longDesc: "Pilotez vos interrupteurs, volets et modules radiofréquence 433 MHz d'une simple pression sans avoir besoin de sortir votre smartphone. Idéale pour les enfants, personnes âgées ou sur une table de chevet.",
    price: 1800,
    oldPrice: null,
    costPrice: 850,
    quantity: 12,
    lowStockThreshold: 4,
    stock: "low",
    isNew: false,
    isBestSeller: false,
    characteristics: "4 boutons programmables indépendants, portée longue distance à travers les murs, boîtier métallique robuste avec cache coulissant de protection.",
    specs: [
      { name: "Fréquence radio", value: "433.92 MHz" },
      { name: "Portée", value: "Jusqu'à 50 mètres en champ libre (25m en intérieur)" },
      { name: "Alimentation", value: "Pile 12V 27A (incluse)" },
      { name: "Canaux", value: "4 canaux indépendants (A, B, C, D)" },
      { name: "Dimensions", value: "55 x 30 x 14 mm" },
      { name: "Garantie", value: "12 Mois" }
    ],
    compatibility: "• Compatible avec les interrupteurs et récepteurs RF 433 MHz DomoTek et Sonoff.\n• Compatible avec les modules de volets roulants et portails compatibles code fixe EV1527.",
    installation: "1. La télécommande est prête à l'emploi avec pile préinstallée.\n2. Mettez votre récepteur ou interrupteur récepteur en mode apprentissage RF.\n3. Appuyez sur la touche souhaitée (A, B, C ou D) de la télécommande pour mémoriser le signal.",
    usage: "1. Appuyez brièvement sur la touche associée pour allumer ou éteindre l'équipement.\n2. Glissez le cache de protection pour éviter les appuis involontaires dans la poche.",
    faq: [
      {
        question: "Fonctionne-t-elle à travers les murs et dalles de béton ?",
        answer: "Oui, les ondes radio 433 MHz traversent les cloisons standards et les portes sans nécessiter de viser directement l'appareil."
      }
    ]
  },
  {
    id: 6,
    slug: "capteur-mouvement-pir",
    name: "Capteur de mouvement PIR WiFi",
    category: "capteurs",
    icon: ShieldCheck,
    sku: "DK-SEN-PIR",
    shortDesc: "Détectez les mouvements dans une pièce et recevez une notification.",
    longDesc: "Surveillez les allées et venues dans vos couloirs, entrées, bureaux ou commerces. Ce détecteur infrarouge passif identifie la chaleur corporelle en mouvement avec un angle panoramique de 110 degrés.",
    price: 2600,
    oldPrice: 3000,
    costPrice: 1300,
    quantity: 22,
    lowStockThreshold: 5,
    stock: "in",
    isNew: false,
    isBestSeller: false,
    characteristics: "Angle de détection large 110°, portée jusqu'à 7 mètres, rotule orientable à 360°, immunité aux petites perturbations lumineuses.",
    specs: [
      { name: "Technologie", value: "Infrarouge passif (PIR)" },
      { name: "Portée de détection", value: "6 à 7 mètres" },
      { name: "Angle de vision", value: "110° grand angle" },
      { name: "Alimentation", value: "3 piles AAA ou câble Micro-USB" },
      { name: "Réseau", value: "Wi-Fi 2.4 GHz" },
      { name: "Garantie", value: "12 Mois" }
    ],
    compatibility: "• Compatible Tuya Smart / Smart Life.\n• Permet d'allumer automatiquement une lumière quand quelqu'un entre, et de l'éteindre après x minutes sans mouvement.",
    installation: "1. Fixez le support rotatif au mur ou posez-le sur une étagère à environ 2 mètres de hauteur.\n2. Orientez la tête du détecteur vers la zone de passage à surveiller.",
    usage: "1. Insérez les piles et couplez le capteur via l'application Smart Life.\n2. Définissez la sensibilité et le délai d'intervalle entre deux alertes.",
    faq: [
      {
        question: "Mes animaux de compagnie vont-ils déclencher l'alarme ?",
        answer: "Pour les petits animaux de moins de 10 kg, il est conseillé de positionner le capteur à environ 2,10m du sol orienté légèrement vers le haut."
      }
    ]
  },
  {
    id: 7,
    slug: "module-relais-volet-roulant",
    name: "Module relais WiFi pour volet roulant",
    category: "interrupteurs",
    icon: Zap,
    sku: "DK-MOD-SHUTTER",
    shortDesc: "Motorisez le pilotage de votre volet roulant électrique.",
    longDesc: "Ce micromodule intelligent s'encastre derrière votre interrupteur de volet roulant existant ou dans le caisson du moteur pour ouvrir, fermer ou régler vos volets au pourcentage près depuis votre téléphone ou à la voix.",
    price: 3200,
    oldPrice: null,
    costPrice: 1650,
    quantity: 26,
    lowStockThreshold: 5,
    stock: "in",
    isNew: false,
    isBestSeller: true,
    characteristics: "Calibrage automatique de la course du volet, contrôle précis en pourcentage (ex: ouvrir à 40%), conservation des boutons manuels existants.",
    specs: [
      { name: "Tension", value: "100-240V AC" },
      { name: "Charge max.", value: "3A (moteurs jusqu'à 500W)" },
      { name: "Format", value: "Micromodule compact (39 x 39 x 15 mm)" },
      { name: "Connectivité", value: "Wi-Fi 2.4 GHz" },
      { name: "Garantie", value: "12 Mois DomoTek" }
    ],
    compatibility: "• Compatible avec tous les moteurs tubulaires 4 fils standard (Montée, Descente, Neutre, Terre).\n• Compatible avec interrupteurs de volet à bascule ou à poussoir.",
    installation: "1. Coupez le disjoncteur du circuit volets.\n2. Raccordez Phase et Neutre sur le module.\n3. Reliez les fils de montée et descente du moteur aux sorties respectives du module.\n4. Reconnectez votre interrupteur mural aux bornes d'entrée du module.\n5. Remettez le courant et procédez au calibrage de course dans l'application.",
    usage: "1. Appairez le module dans Smart Life.\n2. Lancez le calibrage automatique : le volet monte et descend pour apprendre ses limites.\n3. Créez une routine 'Lever du soleil' pour ouvrir automatiquement à 7h et fermer au crépuscule.",
    faq: [
      {
        question: "Mon interrupteur physique d'origine fonctionne-t-il toujours ?",
        answer: "Absolument ! Le module s'installe en parallèle, vos boutons muraux physiques restent 100% opérationnels."
      }
    ]
  },
  {
    id: 8,
    slug: "ampoule-led-wifi-rgb",
    name: "Ampoule LED WiFi RGB",
    category: "smart-home",
    icon: Lightbulb,
    sku: "DK-BULB-RGB",
    shortDesc: "Changez la couleur et l'intensité de votre éclairage depuis l'application.",
    longDesc: "Créez l'ambiance lumineuse parfaite pour chaque occasion avec 16 millions de couleurs et une gamme complète de blancs (du blanc chaud cosy 2700K au blanc froid dynamique 6500K).",
    price: 2100,
    oldPrice: null,
    costPrice: 950,
    quantity: 30,
    lowStockThreshold: 5,
    stock: "in",
    isNew: true,
    isBestSeller: false,
    variants: { label: "Culot", options: ["E27", "B22"] },
    characteristics: "16 millions de couleurs RGB + Blanc réglable CCT, synchronisation avec le rythme de la musique, gradation d'intensité ultra-fluide de 1% à 100%.",
    specs: [
      { name: "Puissance", value: "9W (équivalent 60W classique)" },
      { name: "Luminosité", value: "850 Lumens" },
      { name: "Température de couleur", value: "2700K à 6500K + RGB" },
      { name: "Culot disponible", value: "E27 à vis ou B22 à baïonnette" },
      { name: "Durée de vie", value: "25 000 heures" },
      { name: "Garantie", value: "12 Mois" }
    ],
    compatibility: "• Se visse dans toute douille standard E27 ou B22.\n• Compatible Smart Life, Google Assistant, Amazon Alexa.",
    installation: "1. Éteignez l'interrupteur.\n2. Vissez l'ampoule dans votre luminaire.\n3. Rallumez l'interrupteur : l'ampoule commence à clignoter pour indiquer le mode appairage.",
    usage: "1. Détectez l'ampoule dans Smart Life.\n2. Choisissez vos teintes favorites, réglez la luminosité ou activez le mode réveil progressif.",
    faq: [
      {
        question: "Ai-je besoin d'un variateur mural ?",
        answer: "Non, la variation se fait directement électroniquement via l'application ou par commande vocale, vous n'avez pas besoin de variateur mural."
      }
    ]
  },
  {
    id: 9,
    slug: "sonnette-video-wifi",
    name: "Sonnette vidéo WiFi",
    category: "capteurs",
    icon: Video,
    sku: "DK-DB-CAM",
    shortDesc: "Voyez et parlez à vos visiteurs depuis votre smartphone.",
    longDesc: "Soyez prévenu en temps réel dès qu'un visiteur sonne à votre porte. Visualisez la vidéo en haute définition 1080p avec vision nocturne et échangez de vive voix avec lui où que vous soyez.",
    price: 6500,
    oldPrice: 7500,
    costPrice: 3800,
    quantity: 6,
    lowStockThreshold: 3,
    stock: "low",
    isNew: false,
    isBestSeller: false,
    characteristics: "Caméra Full HD 1080p grand angle 140°, audio bidirectionnel avec réduction de bruit, vision nocturne infrarouge jusqu'à 5m, carillon intérieur sans fil inclus.",
    specs: [
      { name: "Résolution vidéo", value: "Full HD 1080p (1920x1080)" },
      { name: "Angle de vue", value: "140° panoramique diagonal" },
      { name: "Batterie", value: "Rechargeable 5200mAh Li-ion (3 à 6 mois d'autonomie)" },
      { name: "Stockage", value: "Carte MicroSD jusqu'à 128Go ou Cloud sécurisé" },
      { name: "Étanchéité", value: "Norme IP65 (résiste à la pluie et poussière)" },
      { name: "Garantie", value: "12 Mois DomoTek" }
    ],
    compatibility: "• Compatible réseau WiFi 2.4 GHz.\n• Compatible avec le carillon intérieur fourni (se branche sur prise USB).\n• Compatible smartphones Android et iPhone.",
    installation: "1. Fixez le support mural antivol à l'aide des vis fournies ou de l'adhésif ultra-résistant.\n2. Enclenchez la sonnette sur le support.\n3. Branchez le carillon carillon USB dans une pièce centrale de la maison.",
    usage: "1. Appairez la sonnette sur Smart Life.\n2. Lorsqu'un visiteur appuie sur la sonnette, votre smartphone sonne comme un appel vidéo avec affichage instantané.",
    faq: [
      {
        question: "Faut-il payer un abonnement mensuel pour enregistrer les vidéos ?",
        answer: "Non, aucun abonnement obligatoire ! Vous pouvez insérer une carte MicroSD pour enregistrer localement tous les passages gratuitement."
      }
    ]
  },
  {
    id: 10,
    slug: "multiprise-intelligente-4-prises",
    name: "Multiprise intelligente WiFi 4 prises",
    category: "prises",
    icon: Plug,
    sku: "DK-PWR-STRIP",
    shortDesc: "Pilotez quatre appareils indépendamment depuis une seule multiprise.",
    longDesc: "Cette multiprise connectée combine 4 prises 220V contrôlables indépendamment et 4 ports USB intelligents avec charge rapide. Idéale pour coin TV, bureau informatique ou aquarium.",
    price: 4200,
    oldPrice: null,
    costPrice: 2200,
    quantity: 18,
    lowStockThreshold: 4,
    stock: "in",
    isNew: false,
    isBestSeller: false,
    characteristics: "4 prises 220V indépendantes + 4 ports USB, câble robuste de 1.8 mètre en cuivre pur, interrupteur général de sécurité et parasurtenseur intégré.",
    specs: [
      { name: "Prises 220V", value: "4 prises indépendantes (16A max total)" },
      { name: "Ports USB", value: "4 ports 5V / 3.1A partagés" },
      { name: "Longueur du câble", value: "1.80 mètre" },
      { name: "Protection", value: "Parafoudre & coupure thermique automatique" },
      { name: "Garantie", value: "12 Mois" }
    ],
    compatibility: "• Prises standard européennes avec terre.\n• Compatible Google Assistant, Alexa, Smart Life.",
    installation: "1. Branchez simplement la fiche d'alimentation dans une prise murale.\n2. Allumez l'interrupteur principal.",
    usage: "1. Connectez la multiprise dans l'application Smart Life.\n2. Renommez chaque prise (ex: 'Ordinateur', 'Écran', 'Imprimante', 'Lampe de bureau') pour les contrôler une par une.",
    faq: [
      {
        question: "Peut-on éteindre une seule prise sans couper les autres ?",
        answer: "Oui, les 4 prises 220V sont totalement indépendantes les unes des autres dans l'application."
      }
    ]
  },
  {
    id: 11,
    slug: "support-mural-camera",
    name: "Support mural pour caméra WiFi",
    category: "accessoires",
    icon: Cpu,
    sku: "DK-ACC-BRACKET",
    shortDesc: "Fixez votre caméra connectée à l'endroit idéal.",
    longDesc: "Support de fixation universel robuste pour orienter vos caméras de sécurité intérieures ou extérieures selon l'angle de vision optimal.",
    price: 1200,
    oldPrice: null,
    costPrice: 450,
    quantity: 8,
    lowStockThreshold: 3,
    stock: "low",
    isNew: false,
    isBestSeller: false,
    characteristics: "Rotule orientable à 360° et inclinaison à 90°, alliage d'aluminium antirouille, kit de vis et chevilles complet fourni.",
    specs: [
      { name: "Matériau", value: "Alliage d'aluminium & ABS haute résistance" },
      { name: "Rotation", value: "360 degrés horizontale / 90 degrés verticale" },
      { name: "Pas de vis", value: "Standard universel 1/4 pouce" },
      { name: "Charge max.", value: "Jusqu'à 2 kg" },
      { name: "Garantie", value: "12 Mois" }
    ],
    compatibility: "• Compatible avec toutes les caméras équipées d'un pas de vis standard 1/4\" (DomoTek, Ezviz, Xiaomi, Imou, etc.).",
    installation: "1. Marquez les trous sur votre mur ou plafond.\n2. Percez et insérez les chevilles fournies.\n3. Vissez le socle et ajustez la rotule sur la caméra.",
    usage: "1. Vissez votre caméra sur la tige filetée.\n2. Resserrez la molette de verrouillage une fois l'angle de vue idéal ajusté.",
    faq: [
      {
        question: "Convient-il pour une installation en extérieur ?",
        answer: "Oui, sa finition en aluminium thermolaqué résiste aux intempéries et à la corrosion."
      }
    ]
  },
  {
    id: 12,
    slug: "passerelle-domotique",
    name: "Passerelle domotique WiFi/Zigbee",
    category: "smart-home",
    icon: Cpu,
    sku: "DK-HUB-ZIGBEE",
    shortDesc: "Faites communiquer vos différents appareils connectés entre eux.",
    longDesc: "Le cœur névralgique de votre maison intelligente. Cette passerelle multi-protocoles relie vos capteurs et micromodules Zigbee basse consommation à votre box internet WiFi pour une réactivité instantanée et une portée décuplée.",
    price: 5800,
    oldPrice: null,
    costPrice: 3200,
    quantity: 0,
    lowStockThreshold: 3,
    stock: "out",
    isNew: false,
    isBestSeller: false,
    characteristics: "Prise en charge jusqu'à 128 appareils Zigbee simultanés, réactivité ultra-rapide en réseau maillé (mesh), scénarios locaux opérationnels même sans internet.",
    specs: [
      { name: "Protocoles", value: "Zigbee 3.0 + Wi-Fi 2.4 GHz" },
      { name: "Capacité", value: "Jusqu'à 128 sous-équipements connectés" },
      { name: "Alimentation", value: "5V 1A (Câble USB-C fourni)" },
      { name: "Portée Zigbee", value: "Jusqu'à 100 mètres en champ libre" },
      { name: "Dimensions", value: "60 x 60 x 15 mm" },
      { name: "Garantie", value: "12 Mois" }
    ],
    compatibility: "• Compatible avec tous les capteurs, vannes et interrupteurs au standard Zigbee 3.0 / Tuya.\n• Compatible assistants vocaux Alexa et Google Assistant.",
    installation: "1. Branchez la passerelle à un chargeur USB avec le câble USB-C fourni.\n2. Placez-la au centre de votre habitation pour une couverture radio optimale.",
    usage: "1. Ajoutez la passerelle dans Smart Life.\n2. Cliquez sur 'Ajouter un sous-appareil' pour lier vos capteurs Zigbee en un éclair.",
    faq: [
      {
        question: "Pourquoi choisir le Zigbee plutôt que le WiFi ?",
        answer: "Le Zigbee consomme très peu d'énergie (permettant 2 ans d'autonomie sur pile), ne surcharge pas le routeur WiFi de votre box et forme un réseau maillé où chaque équipement relais amplifie le signal."
      }
    ]
  }
];
