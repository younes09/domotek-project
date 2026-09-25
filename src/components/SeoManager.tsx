import React, { useEffect } from "react";
import type { Store } from "../types";

export const SeoManager: React.FC<{ s: Store }> = ({ s }) => {
  const { view, selectedProduct, shopFilters, searchQuery, categoryLabel } = s;

  useEffect(() => {
    let title = "DomoTek — Smart Home, Domotique & Objets Connectés en Algérie";
    let description =
      "DomoTek est la boutique leader en Algérie pour la domotique et la maison intelligente (interrupteurs tactiles, prises connectées, caméras WiFi, capteurs Zigbee). Livraison 58 wilayas & paiement à la livraison.";
    let canonicalUrl = "https://www.domotek.dz/";
    let ogImage = "https://www.domotek.dz/favicon.png";
    let jsonLdData: any = null;

    if (view === "product" && selectedProduct) {
      const p = selectedProduct;
      const catName = categoryLabel[p.category] || "Domotique";
      title = `${p.name} — ${p.price.toLocaleString("fr-DZ")} DZD | DomoTek Algérie`;
      description = `${p.shortDesc} Disponible en Algérie au prix de ${p.price.toLocaleString("fr-DZ")} DZD. Livraison rapide 58 wilayas & garantie 12 mois.`;
      canonicalUrl = `https://www.domotek.dz/#product/${p.id}`;

      const primaryImg = (p.images && p.images.length > 0 && p.images[0]) || p.imageUrl || ogImage;
      ogImage = primaryImg.startsWith("http") ? primaryImg : `https://www.domotek.dz${primaryImg.startsWith("/") ? "" : "/"}${primaryImg}`;

      const productSchema: any = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": p.name,
        "image": [ogImage],
        "description": p.longDesc || p.shortDesc,
        "sku": p.sku || `DK-PROD-${p.id}`,
        "mpn": `DOMOTEK-${p.id}`,
        "brand": {
          "@type": "Brand",
          "name": "DomoTek"
        },
        "category": catName,
        "offers": {
          "@type": "Offer",
          "url": canonicalUrl,
          "priceCurrency": "DZD",
          "price": p.price,
          "priceValidUntil": "2027-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": p.stock === "out" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "DomoTek Algérie"
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "DZ",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 14,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn"
          },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "600",
              "currency": "DZD"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "DZ"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": 0,
                "maxValue": 1,
                "unitCode": "DAY"
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": 1,
                "maxValue": 3,
                "unitCode": "DAY"
              }
            }
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": p.isBestSeller ? "4.9" : "4.8",
          "reviewCount": p.isBestSeller ? "42" : "19"
        }
      };

      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Accueil",
            "item": "https://www.domotek.dz/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Boutique",
            "item": "https://www.domotek.dz/#shop"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": catName,
            "item": `https://www.domotek.dz/#shop?category=${p.category}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": p.name,
            "item": canonicalUrl
          }
        ]
      };

      const graph: any[] = [productSchema, breadcrumbSchema];

      if (p.faq && Array.isArray(p.faq) && p.faq.length > 0) {
        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": p.faq.map((q) => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": q.answer
            }
          }))
        };
        graph.push(faqSchema);
      }

      jsonLdData = { "@context": "https://schema.org", "@graph": graph };
    } else if (view === "shop") {
      const activeCat = shopFilters.category;
      const catLabel = activeCat ? categoryLabel[activeCat] : null;
      if (catLabel) {
        title = `${catLabel} Connectés en Algérie — Prix & Modèles | DomoTek`;
        description = `Découvrez notre gamme de ${catLabel.toLowerCase()} intelligents pour la maison connectée en Algérie. Livraison 58 wilayas et paiement à la livraison.`;
        canonicalUrl = `https://www.domotek.dz/#shop?category=${activeCat}`;
      } else if (searchQuery) {
        title = `Recherche « ${searchQuery} » — DomoTek Domotique Algérie`;
        description = `Résultats de recherche pour ${searchQuery} chez DomoTek Algérie.`;
      } else {
        title = "Boutique Domotique & Maison Connectée Algérie — Catalogue | DomoTek";
        description = "Tous nos équipements domotiques, interrupteurs WiFi/Zigbee, prises intelligentes, caméras et capteurs au meilleur prix en Algérie.";
        canonicalUrl = "https://www.domotek.dz/#shop";
      }
    } else if (view === "checkout") {
      title = "Commander vos équipements domotiques — DomoTek Algérie";
      description = "Finalisez votre commande en toute sécurité avec paiement à la livraison dans toutes les wilayas d'Algérie.";
    }

    // 1. Update Document Title
    document.title = title;

    // 2. Helper to set/create meta tag
    const setMeta = (nameOrProp: "name" | "property", key: string, content: string) => {
      let el = document.querySelector(`meta[${nameOrProp}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(nameOrProp, key);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", ogImage);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);

    // 3. Update Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // 4. Inject Dynamic Schema.org JSON-LD Script
    const existingDynamicScript = document.getElementById("domotek-dynamic-jsonld");
    if (existingDynamicScript) {
      existingDynamicScript.remove();
    }

    if (jsonLdData) {
      const script = document.createElement("script");
      script.id = "domotek-dynamic-jsonld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLdData);
      document.head.appendChild(script);
    }
  }, [view, selectedProduct, shopFilters, searchQuery, categoryLabel]);

  return null;
};
