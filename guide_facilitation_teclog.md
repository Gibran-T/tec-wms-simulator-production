# Guide de facilitation — Programme TEC.LOG
## Cours : Gestion de stock WMS/ERP · Collège de la Concordia

**Version :** 1.0 — Mai 2026  
**Auteur :** Équipe pédagogique TEC.LOG  
**Durée totale :** 30 heures (10 séances × 3h)  
**Outils :** TEC.WMS Simulator · Odoo EDU LAB (edu-concorde-logistics-lab.odoo.com)

---

## Présentation du programme

TEC.LOG est un programme de formation en gestion de stock qui combine une simulation WMS interactive (TEC.WMS) et un portail ERP réel (Odoo EDU LAB). L'étudiant apprend en faisant : chaque transaction simulée dans TEC.WMS trouve son équivalent dans Odoo, ce qui ancre la compréhension dans une réalité opérationnelle.

Le programme est structuré en **5 modules progressifs** couvrant l'ensemble du cycle logistique, de la réception fournisseur jusqu'à l'audit de conformité et la certification finale. Chaque module combine des slides pédagogiques, un quiz de validation, des scénarios de simulation et un lab Odoo guidé.

---

## Architecture pédagogique

| Composant | Rôle | Accès |
|-----------|------|-------|
| **Slides TEC.LOG** | Contenu théorique, concepts, flux | `/student/slides/:moduleId` |
| **Quiz de module** | Validation des prérequis (≥60%) | `/student/quiz/:moduleId` |
| **Scénarios TEC.WMS** | Simulation opérationnelle évaluée | `/student/scenarios` |
| **Odoo EDU LAB** | Référence ERP réelle (optionnel) | edu-concorde-logistics-lab.odoo.com |
| **Rapport final** | Score, erreurs, compétences validées | `/student/run/:id/report` |
| **Certification** | Attestation de réussite | Affichée dans le rapport final |

### Flux étudiant par module

```
Slides → Quiz (≥60%) → Scénario TEC.WMS → Odoo Lab (optionnel) → Rapport → Certification
```

---

## Structure des 10 séances

### Séance 1 — Introduction et fondements (M1, Partie 1)
**Durée :** 3h | **Module :** M1 — Fondements ERP/WMS

**Objectifs :** Comprendre le rôle d'un WMS et d'un ERP dans la chaîne logistique. Identifier les acteurs, les flux et les transactions clés.

**Déroulement :**

| Temps | Activité | Outil |
|-------|----------|-------|
| 0:00–0:30 | Présentation du programme TEC.LOG, des outils et de la méthode | Slides M1 (1–5) |
| 0:30–1:00 | Concepts fondamentaux : WMS, ERP, flux PO→GR→STOCK | Slides M1 (6–10) |
| 1:00–1:15 | Pause |  |
| 1:15–1:45 | Démonstration enseignant : navigation TEC.WMS, mode démo | TEC.WMS |
| 1:45–2:30 | Pratique guidée : scénario démo M1 (mode démonstration) | TEC.WMS |
| 2:30–3:00 | Discussion : "Où retrouve-t-on ces transactions dans Odoo ?" | Odoo EDU LAB |

**Points d'attention enseignant :**
- Insister sur la différence entre **créer** (READY) et **valider/poster** (POSTED). C'est l'erreur la plus fréquente en M1.
- Le mode démonstration ne compte pas dans les statistiques officielles — les étudiants peuvent explorer librement.
- Vérifier que tous les étudiants ont un compte TEC.WMS actif avant la séance.

---

### Séance 2 — Cycle complet M1 et certification fondamentaux (M1, Partie 2)
**Durée :** 3h | **Module :** M1 — Fondements ERP/WMS

**Objectifs :** Exécuter le cycle complet PO→GR→PUTAWAY→STOCK→SO→GI→CC→COMPLIANCE. Réussir le quiz M1 et obtenir la certification TEC.LOG Fundamentals.

**Déroulement :**

| Temps | Activité | Outil |
|-------|----------|-------|
| 0:00–0:20 | Révision des concepts M1, Q&A | Slides M1 |
| 0:20–0:50 | Quiz M1 (mode pratique, illimité) | TEC.WMS Quiz |
| 0:50–1:00 | Correction collective du quiz | Enseignant |
| 1:00–1:15 | Pause |  |
| 1:15–2:30 | Scénario officiel M1 (mode examen, compte) | TEC.WMS |
| 2:30–2:50 | Analyse des rapports : score, erreurs, conformité | TEC.WMS Rapport |
| 2:50–3:00 | Certification M1 : présentation de la page Odoo EDU LAB | Odoo EDU LAB |

**Script enseignant — Certification M1 :**
> "Ceux qui ont obtenu ≥60 points et la conformité système verront apparaître dans leur rapport final une bannière verte 'TEC.LOG Fundamentals Certification'. Cette certification valide votre maîtrise des fondements ERP/WMS. La page de certification officielle est disponible sur le portail Odoo EDU LAB."

**Procédure de reset (si nécessaire) :**
L'enseignant peut réinitialiser un run étudiant depuis le tableau de bord Monitor → bouton "Réinitialiser" (double confirmation requise). L'étudiant peut également se réinitialiser lui-même depuis son rapport final → "Nouvelle tentative".

---

### Séance 3 — Exécution d'entrepôt : emplacements et rangement (M2, Partie 1)
**Durée :** 3h | **Module :** M2 — Exécution d'entrepôt

**Objectifs :** Comprendre la structure des emplacements WMS (WH/Input → WH/Stock/Allée-A/B/C). Appliquer les règles de rangement (putaway) et valider la capacité des bins.

**Déroulement :**

| Temps | Activité | Outil |
|-------|----------|-------|
| 0:00–0:30 | Slides M2 : structure des emplacements, règles putaway | Slides M2 (1–6) |
| 0:30–1:00 | Lab Odoo M2 : Inventory → Configuration → Putaway Rules | Odoo EDU LAB |
| 1:00–1:15 | Pause |  |
| 1:15–1:45 | Quiz M2 (mode pratique) | TEC.WMS Quiz |
| 1:45–2:30 | Scénario M2 — Réception et rangement structuré | TEC.WMS |
| 2:30–3:00 | Débrief : règles FIFO, capacité bin, erreurs fréquentes | Enseignant |

**Points d'attention enseignant :**
- Rappeler que dans Odoo EDU LAB, les règles putaway sont configurées : SKU-001 → Allée-A, SKU-003 → Allée-B, SKU-004 → Allée-C.
- L'erreur classique en M2 : ranger dans le mauvais emplacement ou ignorer la capacité maximale du bin.

---

### Séance 4 — FIFO, traçabilité et précision d'inventaire (M2, Partie 2)
**Durée :** 3h | **Module :** M2 — Exécution d'entrepôt

**Objectifs :** Appliquer la règle FIFO dans les sorties de stock. Gérer la traçabilité par lots (ASN). Mesurer la précision d'inventaire.

**Déroulement :**

| Temps | Activité | Outil |
|-------|----------|-------|
| 0:00–0:30 | Slides M2 : FIFO/LIFO, lots, ASN, précision inventaire | Slides M2 (7–12) |
| 0:30–1:00 | Lab Odoo M2 : Inventory → Lots → LOT-SKU003-A/B/C | Odoo EDU LAB |
| 1:00–1:15 | Pause |  |
| 1:15–2:30 | Scénario M2 officiel (mode examen) | TEC.WMS |
| 2:30–3:00 | Analyse des rapports M2, discussion FIFO vs LIFO | TEC.WMS Rapport |

---

### Séance 5 — Contrôle des stocks et inventaire cyclique (M3, Partie 1)
**Durée :** 3h | **Module :** M3 — Contrôle des stocks

**Objectifs :** Réaliser un inventaire cyclique complet. Identifier et analyser les écarts de stock. Comprendre les ajustements d'inventaire.

**Déroulement :**

| Temps | Activité | Outil |
|-------|----------|-------|
| 0:00–0:30 | Slides M3 : cycle count, écarts, ajustements | Slides M3 (1–6) |
| 0:30–1:00 | Lab Odoo M3 : Inventory → Inventory Adjustments | Odoo EDU LAB |
| 1:00–1:15 | Pause |  |
| 1:15–1:45 | Quiz M3 (mode pratique) | TEC.WMS Quiz |
| 1:45–2:30 | Scénario M3 — Cycle count et réconciliation | TEC.WMS |
| 2:30–3:00 | Débrief : causes d'écarts, procédures d'ajustement | Enseignant |

---

### Séance 6 — Réapprovisionnement et stock de sécurité (M3, Partie 2)
**Durée :** 3h | **Module :** M3 — Contrôle des stocks

**Objectifs :** Configurer et interpréter les règles Min/Max. Calculer le ROP (Reorder Point) et l'EOQ. Gérer le stock de sécurité.

**Déroulement :**

| Temps | Activité | Outil |
|-------|----------|-------|
| 0:00–0:30 | Slides M3 : ROP, EOQ, stock de sécurité, MRP | Slides M3 (7–12) |
| 0:30–1:00 | Lab Odoo M3 : Inventory → Reordering Rules (SKU-003: min=30, max=150) | Odoo EDU LAB |
| 1:00–1:15 | Pause |  |
| 1:15–2:30 | Scénario M3 officiel (mode examen) | TEC.WMS |
| 2:30–3:00 | Analyse des rapports M3 | TEC.WMS Rapport |

---

### Séance 7 — Indicateurs de performance logistique (M4)
**Durée :** 3h | **Module :** M4 — Indicateurs de performance

**Objectifs :** Calculer les KPIs logistiques clés (OTIF, Fill Rate, DSI, LPH, Taux de rotation). Diagnostiquer les causes de sous-performance. Proposer des actions correctives.

**Déroulement :**

| Temps | Activité | Outil |
|-------|----------|-------|
| 0:00–0:30 | Slides M4 : KPIs, formules, seuils de performance | Slides M4 (1–6) |
| 0:30–1:00 | Lab Odoo M4 : Inventory → Reporting → Inventory Valuation | Odoo EDU LAB |
| 1:00–1:15 | Pause |  |
| 1:15–1:45 | Quiz M4 (mode pratique) | TEC.WMS Quiz |
| 1:45–2:30 | Scénario M4 — Calcul et interprétation des KPIs | TEC.WMS |
| 2:30–3:00 | Débrief : analyse Lean, Root Cause Analysis | Enseignant |

**Formules clés à afficher au tableau :**

| KPI | Formule | Seuil acceptable |
|-----|---------|-----------------|
| OTIF | Livraisons à temps et complètes / Total livraisons × 100 | ≥95% |
| Fill Rate | Lignes livrées complètes / Lignes commandées × 100 | ≥98% |
| DSI | Stock moyen / (Coût des ventes / 365) | <30 jours |
| Taux de rotation | Coût des ventes / Stock moyen | >12×/an |
| LPH | Lignes préparées / Heures travaillées | Benchmark interne |

---

### Séance 8 — Simulation intégrée M5 (Partie 1)
**Durée :** 3h | **Module :** M5 — Simulation opérationnelle intégrée

**Objectifs :** Exécuter les étapes Réception, Rangement FIFO et Inventaire cyclique dans le contexte M5 intégré.

**Déroulement :**

| Temps | Activité | Outil |
|-------|----------|-------|
| 0:00–0:30 | Slides M5 : flux intégré M1–M4, scénario de crise | Slides M5 (1–5) |
| 0:30–1:00 | Quiz M5 (mode pratique) | TEC.WMS Quiz |
| 1:00–1:15 | Pause |  |
| 1:15–2:30 | Scénario M5 — Étapes 1 à 3 (Réception, Putaway, Cycle Count) | TEC.WMS |
| 2:30–3:00 | Point d'avancement, questions, préparation séance 9 | Enseignant |

---

### Séance 9 — Simulation intégrée M5 (Partie 2) et KPI finaux
**Durée :** 3h | **Module :** M5 — Simulation opérationnelle intégrée

**Objectifs :** Compléter les étapes Réapprovisionnement, KPI et Décision stratégique. Préparer la validation finale.

**Déroulement :**

| Temps | Activité | Outil |
|-------|----------|-------|
| 0:00–0:30 | Continuation scénario M5 — Étapes 4 à 6 (Réappro, KPI, Décision) | TEC.WMS |
| 0:30–1:00 | Lab Odoo M5 : Inventory → Reporting (vue d'ensemble intégrée) | Odoo EDU LAB |
| 1:00–1:15 | Pause |  |
| 1:15–2:00 | Validation finale M5 (conformité, audit trail) | TEC.WMS |
| 2:00–2:30 | Analyse du rapport M5 | TEC.WMS Rapport |
| 2:30–3:00 | Présentation de la certification finale TEC.LOG | Odoo EDU LAB |

**Script enseignant — Certification finale :**
> "Les étudiants qui ont complété M5 avec ≥60 points et la conformité système verront une bannière indigo 'TEC.LOG — Integrated ERP/WMS Logistics Certification'. Cette certification valide la maîtrise complète du parcours M2–M5. La page officielle est sur le portail Odoo EDU LAB."

---

### Séance 10 — Révision, rattrapage et remise des certifications
**Durée :** 3h | **Modules :** M1–M5 (révision)

**Objectifs :** Permettre aux étudiants en retard de compléter leurs modules. Présenter les certifications officielles. Bilan pédagogique du programme.

**Déroulement :**

| Temps | Activité | Outil |
|-------|----------|-------|
| 0:00–0:30 | Révision collective : points difficiles identifiés | Enseignant |
| 0:30–1:30 | Rattrapage libre : modules incomplets ou scores insuffisants | TEC.WMS |
| 1:30–1:45 | Pause |  |
| 1:45–2:15 | Présentation des certifications (M1 Fundamentals + Final) | Odoo EDU LAB |
| 2:15–2:45 | Bilan du programme : compétences acquises, prochaines étapes | Enseignant |
| 2:45–3:00 | Évaluation du cours (feedback étudiant) | Formulaire |

---

## Procédures opérationnelles

### Connexion et accès

Les étudiants se connectent à TEC.WMS via l'URL du projet. Lors de la première connexion, ils doivent entrer leur numéro étudiant dans le champ prévu sur la page "Mes Scénarios" — ce numéro est requis pour l'identification par l'enseignant dans le tableau de bord Monitor.

L'accès à Odoo EDU LAB est à l'adresse `edu-concorde-logistics-lab.odoo.com`. Les étudiants utilisent les identifiants fournis par l'établissement. L'accès Odoo est toujours **optionnel** — TEC.WMS fonctionne de manière autonome même si Odoo est indisponible.

### Modes de simulation

TEC.WMS propose deux modes distincts pour chaque scénario :

**Mode Démonstration** : Scores non comptabilisés, exploration libre, aucune limite de tentatives. Recommandé pour la découverte et la pratique avant l'évaluation officielle.

**Mode Examen** : Scores officiels comptabilisés dans les statistiques. Le rapport final est enregistré et visible par l'enseignant. Ce mode déclenche l'affichage des certifications si les seuils sont atteints.

### Quiz de module

Chaque module dispose d'un quiz de validation accessible depuis la page "Mes Scénarios" (bouton "Quiz requis" si non passé, ou "Quiz ✓" si réussi). Le quiz est en **mode pratique illimité** — les étudiants peuvent le reprendre autant de fois que nécessaire. Un score ≥60% est requis pour déverrouiller les scénarios officiels du module.

### Procédure de reset étudiant

**Auto-reset (étudiant) :** Depuis le rapport final d'un run, le bouton "Nouvelle tentative" réinitialise complètement le run (toutes les transactions, le score et la progression sont effacés). L'étudiant repart de zéro sur le même scénario.

**Reset enseignant :** Depuis le tableau de bord Monitor → colonne Actions → bouton "Réinitialiser". Une double confirmation est requise. L'enseignant peut également réinitialiser les tentatives de quiz d'un étudiant via le bouton "Réinit. quiz" dans le même tableau.

### Gestion des certifications

**Certification 1 — TEC.LOG Fundamentals** : Affichée automatiquement dans le rapport final d'un scénario M1 lorsque le score ≥60 et la conformité système est atteinte. Lien vers la page de certification sur Odoo EDU LAB.

**Certification 2 — TEC.LOG Integrated ERP/WMS** : Affichée automatiquement dans le rapport final d'un scénario M5 lorsque le score ≥60 et la conformité système est atteinte. Valide le parcours complet M2–M5.

---

## Erreurs fréquentes des étudiants

Le tableau suivant recense les erreurs les plus courantes observées par module, avec les corrections pédagogiques recommandées.

| Module | Erreur fréquente | Cause | Correction pédagogique |
|--------|-----------------|-------|----------------------|
| M1 | Créer un PO sans le valider (statut READY) | Confusion créer/valider | Insister : "Un document READY n'existe pas dans le stock système" |
| M1 | Effectuer une sortie de stock avant la réception | Ignorance du flux séquentiel | Rappeler le flux obligatoire : PO→GR→STOCK→SO→GI |
| M2 | Ranger dans le mauvais emplacement | Non-respect des règles putaway | Montrer les règles dans Odoo : SKU-001 → Allée-A |
| M2 | Ignorer la capacité maximale du bin | Méconnaissance des limites | Expliquer : "Un bin plein = blocage de la réception" |
| M3 | Ajuster le stock sans justification | Précipitation | Rappeler : tout ajustement doit être documenté et approuvé |
| M3 | Confondre ROP et stock de sécurité | Concepts proches | Utiliser la formule : ROP = (Consommation × Lead Time) + Safety Stock |
| M4 | Calculer le DSI sans le stock moyen | Utilisation du stock instantané | Insister sur la différence stock moyen vs stock instantané |
| M4 | Interpréter un OTIF de 94% comme "bon" | Méconnaissance des seuils | Rappeler : seuil industriel = 95% minimum |
| M5 | Sauter une étape du flux intégré | Fatigue de fin de parcours | Encourager : "Chaque étape compte pour le score final" |

---

## Critères d'évaluation

### Barème par module

| Module | Seuil de réussite | Compétences évaluées |
|--------|------------------|---------------------|
| M1 | 60/100 | Flux PO→GR→SO→GI, conformité système, cycle count |
| M2 | 60/100 | Putaway, FIFO, traçabilité lots, précision inventaire |
| M3 | 70/100 | Cycle count, ajustements, ROP, Min/Max, EOQ |
| M4 | 70/100 | Calcul KPIs, interprétation, diagnostic, RCA |
| M5 | 70/100 | Flux intégré M1–M4, décision stratégique, audit final |

### Composantes du score TEC.WMS

Chaque scénario est évalué sur 100 points selon les composantes suivantes :

- **Étapes validées** : Points attribués pour chaque étape complétée dans le bon ordre (60–70% du score).
- **Conformité système** : Vérification que toutes les transactions sont dans le bon état (POSTED, pas READY). Pénalité si non conforme.
- **Précision des données** : Exactitude des quantités, SKUs, emplacements saisis.
- **Bonus simulation parfaite** : Points supplémentaires pour un run sans erreur (score ≥100 possible).
- **Pénalités** : Déduites pour chaque erreur commise (transaction hors séquence, données incorrectes, non-conformité).

---

## Checklist enseignant — Avant chaque séance

Avant de commencer une séance, l'enseignant doit vérifier les éléments suivants :

- [ ] Tous les étudiants ont un compte TEC.WMS actif et leur numéro étudiant est enregistré
- [ ] Le tableau de bord Monitor est accessible et affiche les étudiants de la cohorte
- [ ] Les slides du module sont accessibles depuis `/student/slides/:moduleId`
- [ ] Le quiz du module est actif et fonctionnel
- [ ] Les scénarios du module sont visibles dans la liste (vérifier qu'il n'y a pas "Aucun scénario disponible")
- [ ] Odoo EDU LAB est accessible (connexion vérifiée) — optionnel mais recommandé
- [ ] Les données Odoo du module sont présentes (SKUs, lots, règles putaway/réappro)

---

## Ressources et liens

| Ressource | URL / Accès |
|-----------|-------------|
| TEC.WMS Simulator | URL du projet (fournie par l'établissement) |
| Odoo EDU LAB | https://edu-concorde-logistics-lab.odoo.com |
| Certification M1 (Odoo) | Odoo EDU LAB → eLearning → TEC.LOG → M1 Certification |
| Certification Finale (Odoo) | Odoo EDU LAB → eLearning → TEC.LOG → Final Certification |
| Tableau de bord enseignant | `/teacher` (rôle teacher ou admin requis) |
| Monitor étudiant | `/teacher/monitor` |
| Gestion des scénarios | `/teacher/scenarios` |

---

*Guide de facilitation TEC.LOG — Version 1.0 — Collège de la Concordia — Mai 2026*
