/** Extra consultation copy for key glossary terms — never mission answers. */

export type GlossarySupport = {
  operational: { fr: string; en: string };
  example: { fr: string; en: string };
};

export const GLOSSARY_SUPPORT_BY_CODE: Record<string, GlossarySupport> = {
  WMS: {
    operational: {
      fr: "Le WMS orchestre les mouvements ; il ne remplace pas le jugement de l’opérateur.",
      en: "The WMS orchestrates movements; it does not replace the operator’s judgment.",
    },
    example: {
      fr: "Consultez le terme quand une slide parle de zone, bin ou document — pas pour deviner la mission.",
      en: "Look up the term when a slide mentions a zone, bin or document — not to guess the mission.",
    },
  },
  PO: {
    operational: {
      fr: "Le PO est un engagement d’achat, pas du stock disponible.",
      en: "A PO is a purchase commitment, not available stock.",
    },
    example: {
      fr: "Utile avant une réception : le document existe, la marchandise n’est pas encore en bin.",
      en: "Useful before receiving: the document exists, goods are not yet in a bin.",
    },
  },
  GR: {
    operational: {
      fr: "La GR enregistre l’entrée réelle. Sans GR postée, le stock n’est pas fiable.",
      en: "GR records the real inbound. Without a posted GR, stock is not reliable.",
    },
    example: {
      fr: "Relisez GR si une mission parle d’arrivée au quai ou de document fantôme.",
      en: "Re-read GR if a mission mentions dock arrival or a ghost document.",
    },
  },
  PUTAWAY: {
    operational: {
      fr: "Le rangement déplace le stock de RÉCEPTION vers STOCKAGE selon capacité et zone.",
      en: "Putaway moves stock from RECEIVING to STORAGE according to capacity and zone.",
    },
    example: {
      fr: "Consultez PUTAWAY / FIFO pour le vocabulaire, pas pour la quantité du scénario.",
      en: "Use PUTAWAY / FIFO for vocabulary, not for the scenario quantity.",
    },
  },
  FIFO: {
    operational: {
      fr: "FIFO = sortir le lot le plus ancien d’abord. Ce n’est pas « le bin le plus proche ».",
      en: "FIFO = issue the oldest lot first. It is not “the nearest bin”.",
    },
    example: {
      fr: "Utile en picking M2 : date/lot avant proximité.",
      en: "Useful in M2 picking: date/lot before proximity.",
    },
  },
  SO: {
    operational: {
      fr: "Le SO réserve une intention de vente ; il ne crée pas le stock.",
      en: "An SO reserves a sales intent; it does not create stock.",
    },
    example: {
      fr: "Avant GI, vérifiez que le stock disponible couvre le SO.",
      en: "Before GI, check that available stock covers the SO.",
    },
  },
  GI: {
    operational: {
      fr: "Le GI diminue le stock. Un GI sans couverture ATP crée une rupture documentaire.",
      en: "GI decreases stock. A GI without ATP coverage creates a documentary stockout.",
    },
    example: {
      fr: "Reliez GI à ATP / stock disponible, pas à la PO.",
      en: "Link GI to ATP / available stock, not to the PO.",
    },
  },
  ATP: {
    operational: {
      fr: "ATP = ce qui peut encore être promis. Document ≠ disponibilité physique.",
      en: "ATP = what can still be promised. A document is not physical availability.",
    },
    example: {
      fr: "Consultez ATP quand une commande dépasse le stock vu à l’écran.",
      en: "Look up ATP when an order exceeds the stock on screen.",
    },
  },
  CC: {
    operational: {
      fr: "Le cycle count compare le système au physique ; il ne crée pas l’entrée initiale.",
      en: "Cycle count compares system to physical; it does not create the initial inbound.",
    },
    example: {
      fr: "Utile en M3 : variance → justification → ajustement.",
      en: "Useful in M3: variance → justification → adjustment.",
    },
  },
  ADJ: {
    operational: {
      fr: "L’ajustement corrige un écart prouvé. Ce n’est pas un raccourci pour « arranger » le stock.",
      en: "Adjustment corrects a proven variance. It is not a shortcut to “fix” stock.",
    },
    example: {
      fr: "Après CC, seulement si la variance est justifiée.",
      en: "After CC, only if the variance is justified.",
    },
  },
};
