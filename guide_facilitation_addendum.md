# TEC.LOG — Guide de facilitation : Addendum de production
## Version 2.0 — 2026-05-18

Cet addendum complète le Guide de facilitation principal. Il couvre les procédures
opérationnelles de production : checklists de séance, guide SKU, dépannage et
procédures de certification.

---

## Addendum A — Checklists de séance

### Checklist avant chaque séance (15 minutes avant)

```
SYSTÈME TEC.WMS
□ Connexion enseignant confirmée (rôle teacher ou admin)
□ Tableau de bord Surveillance ouvert
□ Tous les runs étudiants de la séance précédente réinitialisés
□ Tentatives de quiz réinitialisées si nécessaire (module M1)
□ Comptes étudiants vérifiés (au moins 1 test de connexion)

ODOO EDU LAB (edu-concorde-logistics-lab.odoo.com)
□ Connexion Odoo confirmée (compte admin)
□ Stock SKU-001 @ Allée-A = 130 u.
□ Stock SKU-003 @ Allée-B = 100 u. (3 lots)
□ Stock SKU-004 @ Allée-C = 65 u. (2 lots)
□ Stock SKU-005 @ Allée-C = 500 u.
□ Règles putaway actives (6 règles)
□ Règles Min/Max actives (3 règles)
□ Documents de référence visibles (WH/IN/00002–00006, WH/OUT/00001)

MATÉRIEL PÉDAGOGIQUE
□ Diapositives du module chargées dans TEC.WMS (Portail cours)
□ Scénario du module disponible dans TEC.WMS
□ Quiz du module accessible (M1 uniquement)
□ Lien Odoo EDU LAB testé depuis un poste étudiant
```

### Checklist après chaque séance

```
□ Captures d'écran des scores étudiants sauvegardées (si évaluation)
□ Incidents ou erreurs fréquentes notés pour amélioration du cours
□ Documents exam archivés dans Odoo (si séance d'évaluation)
□ Rapport de séance transmis au coordinateur pédagogique
```

### Checklist avant examen (en plus de la checklist standard)

```
□ Tous les runs étudiants réinitialisés (0 run actif dans Surveillance)
□ Toutes les tentatives de quiz réinitialisées
□ Stock Odoo restauré à l'état canonique (script odoo_stock_adjust.py)
□ Documents exam de la séance précédente archivés
□ Mode examen communiqué aux étudiants (pas de mode pratique)
□ Critères d'évaluation affichés (score ≥60, conformité requise)
```

---

## Addendum B — Guide SKU de référence rapide

### Tableau de référence produits

| Code | Désignation | Allée | Lot | Qté initiale | Module principal | KPI associé |
|------|-------------|-------|-----|--------------|------------------|-------------|
| SKU-001 | Boîte carton standard | A | Non | 130 | M1, M2 | Volume réceptions |
| SKU-002 | Palette bois standard | A | Non | 20 | M2 | Transfert interne |
| SKU-003 | Film étirable transparent | B | Oui (3 lots) | 100 | M2, M3 | Comptage cyclique |
| SKU-004 | Ruban adhésif d'emballage | C | Oui (2 lots) | 65 | M2, M3 | Min/Max |
| SKU-005 | Étiquette code-barres | C | Non | 500 | M3, M4 | Taux de rotation |
| BOX-001 | Carton assemblé | A | Non | 75 | M1, M2 | GR de référence |

### Lots de référence

| Lot | Produit | Qté | Allée | Utilisation pédagogique |
|-----|---------|-----|-------|------------------------|
| LOT-SKU003-A | SKU-003 | 50 | B | Lot le plus ancien — FIFO M2 |
| LOT-SKU003-B | SKU-003 | 30 | B | Comptage cyclique M3 |
| LOT-SKU003-C | SKU-003 | 20 | B | Comptage cyclique M3 |
| LOT-SKU004-2024-A | SKU-004 | 40 | C | Traçabilité M2 |
| LOT-SKU004-2024-B | SKU-004 | 25 | C | Réapprovisionnement M3 |

### Règles Min/Max

| Produit | Min | Max | Déclenchement | Point pédagogique |
|---------|-----|-----|---------------|-------------------|
| SKU-003 | 30 | 150 | < 30 u. | Seuil de réapprovisionnement |
| SKU-004 | 10 | 50 | < 10 u. | Alerte stock bas |
| SKU-005 | 20 | 100 | < 20 u. | Gestion consommables |

---

## Addendum C — Données KPI M4

Les données suivantes ont été créées dans Odoo pour l'analyse KPI du module M4 :

### Réceptions (5 réceptions sur 30 jours)

| Référence | Produit | Qté | Délai | Interprétation |
|-----------|---------|-----|-------|----------------|
| KPI-IN-001 | SKU-001 | 50 | 2 j. | Délai excellent |
| KPI-IN-002 | SKU-001 | 30 | 3 j. | Délai bon |
| KPI-IN-003 | SKU-002 | 15 | 5 j. | Délai acceptable |
| KPI-IN-004 | SKU-005 | 200 | 7 j. | Délai lent |
| KPI-IN-005 | SKU-001 | 20 | 1 j. | Délai excellent |

**Délai moyen = (2+3+5+7+1)/5 = 3,6 jours**

### Livraisons (6 livraisons sur 30 jours)

| Référence | Produit | Qté | Dans les délais | OTIF |
|-----------|---------|-----|-----------------|------|
| KPI-OUT-001 | SKU-001 | 25 | Oui | ✓ |
| KPI-OUT-002 | SKU-001 | 20 | Oui | ✓ |
| KPI-OUT-003 | SKU-001 | 15 | Oui | ✓ |
| KPI-OUT-004 | SKU-001 | 30 | **Non** | ✗ |
| KPI-OUT-005 | SKU-001 | 10 | Oui | ✓ |
| KPI-OUT-006 | SKU-001 | 12 | **Non** | ✗ |

**OTIF = 4/6 = 67% (objectif : 85%) → Point pédagogique : sous-performance**

### Calculs KPI attendus (résultats d'analyse M4)

```
OTIF = 4 livraisons dans les délais / 6 livraisons totales = 67%
Délai moyen réception = 3,6 jours
Fill Rate = stock disponible / demande (variable selon le moment de l'analyse)
DSI (Days Sales of Inventory) = (stock moyen / COGS) × 365
  → SKU-001: stock moyen ≈ 130 u., COGS estimé = 112 u. livrées
  → DSI ≈ (130/112) × 365 ≈ 423 jours (stock élevé — point pédagogique)
```

---

## Addendum D — Structure de certification

### Certification 1 — TEC.LOG Fundamentals (M1)

**Déclenchement :** Score ≥ 60/100 ET conformité validée sur le scénario M1

**Affichage :** Bannière verte dans le rapport final TEC.WMS + lien vers Odoo EDU LAB

**Page Odoo :** Slide "TEC.LOG Fundamentals Certification" (seq 39) dans le portail eLearning

**Compétences validées :**
- Flux PO → GR → Putaway → Stock → SO → GI → CC → Compliance
- Distinction "Enregistrer" vs "Valider/Comptabiliser"
- Lecture du stock disponible vs stock prévisionnel dans Odoo

### Certification 2 — TEC.LOG Integrated (M2–M5)

**Déclenchement :** Score ≥ 60/100 ET conformité validée sur le scénario M5

**Affichage :** Bannière indigo dans le rapport final TEC.WMS + lien vers Odoo EDU LAB

**Page Odoo :** Slide "TEC.LOG — Integrated ERP/WMS Logistics Certification" (seq 69)

**Compétences validées :**
- Exécution d'entrepôt (M2) : emplacements, putaway, transferts internes
- Contrôle des stocks (M3) : comptage cyclique, traçabilité lots, Min/Max
- KPIs logistiques (M4) : OTIF, délai, Fill Rate, DSI
- Simulation intégrée (M5) : flux end-to-end, audit, conformité

---

## Addendum E — Guide de dépannage

### Problème : "L'étudiant ne peut pas démarrer le scénario"

**Cause probable :** Quiz M1 non passé (score < 60%) — le bouton "Démarrer" est remplacé par "Faire le quiz d'abord"

**Solution :**
1. Demander à l'étudiant de refaire le quiz (tentatives illimitées en mode pratique)
2. OU réinitialiser les tentatives de quiz depuis MonitorDashboard → "Réinit. quiz"
3. OU (mode démo) l'étudiant peut accéder en mode démonstration sans quiz

### Problème : "Le stock Odoo ne correspond pas à ce qui est affiché dans TEC.WMS"

**Explication :** TEC.WMS et Odoo sont deux systèmes indépendants. TEC.WMS simule un WMS interne, Odoo est l'ERP de référence. Les quantités ne sont pas synchronisées en temps réel — c'est intentionnel pour l'enseignement de la distinction WMS/ERP.

**Solution :** Expliquer aux étudiants que l'Odoo EDU LAB est un **système de référence ERP** et non un miroir du WMS. Les mouvements dans TEC.WMS correspondent aux opérations que l'étudiant devrait effectuer dans Odoo.

### Problème : "Le bouton Odoo Lab ouvre une page de connexion"

**Solution :**
1. L'étudiant doit se connecter à Odoo EDU LAB avec son compte (fourni par l'enseignant)
2. URL directe : `https://edu-concorde-logistics-lab.odoo.com`
3. Après connexion, le lien deep link fonctionne directement

### Problème : "Le reset ne fonctionne pas — le bouton est grisé"

**Cause :** Le run est en état `not_started` — aucun reset nécessaire

**Solution :** Si le run est en état `in_progress` ou `completed`, le bouton est actif. Vérifier l'état du run dans la colonne "Statut" de MonitorDashboard.

### Problème : "Les données KPI M4 ne sont pas visibles dans Odoo"

**Solution :**
1. Naviguer vers Inventory → Reporting → Moves
2. Filtrer par date : "Ce mois" ou "30 derniers jours"
3. Les réceptions KPI-IN-001 à KPI-IN-005 et livraisons KPI-OUT-001 à KPI-OUT-006 doivent apparaître

### Problème : "La certification n'apparaît pas après le scénario M1"

**Conditions requises :**
- Score ≥ 60/100 (affiché en haut du rapport)
- Conformité validée (badge vert "Conforme" dans le rapport)
- Mode officiel (pas mode démo)

**Si toutes les conditions sont remplies et la bannière n'apparaît pas :** Actualiser la page du rapport.

---

## Addendum F — Procédure de reset Odoo (script)

Le script `odoo_stock_adjust.py` restaure le stock Odoo à l'état canonique.

**Prérequis :** Python 3 installé, accès internet, credentials Odoo

**Exécution :**
```bash
python3 /home/ubuntu/odoo_stock_adjust.py
```

**Résultat attendu :**
```
Authenticated as UID: 2
=== Redistributing stock to Allée locations ===
  ✓ Updated: SKU-001 @ WH/Stock/Allée-A lot=- → qty=130
  ✓ Updated: BOX-001 @ WH/Stock/Allée-A lot=- → qty=75
  ✓ Updated: SKU-003 @ WH/Stock/Allée-B lot=LOT-SKU003-A → qty=50
  ✓ Updated: SKU-003 @ WH/Stock/Allée-B lot=LOT-SKU003-B → qty=30
  ✓ Updated: SKU-003 @ WH/Stock/Allée-B lot=LOT-SKU003-C → qty=20
  ✓ Updated: SKU-004 @ WH/Stock/Allée-C lot=LOT-SKU004-2024-A → qty=40
  ✓ Updated: SKU-004 @ WH/Stock/Allée-C lot=LOT-SKU004-2024-B → qty=25
  ✓ Updated: SKU-002 @ WH/Stock/Allée-A lot=- → qty=20
  ✓ Updated: SKU-005 @ WH/Stock/Allée-C lot=- → qty=500
Done.
```

---

*Addendum rédigé le 2026-05-18. Version 2.0.*
*Complète le Guide de facilitation TEC.LOG Version 1.0.*
