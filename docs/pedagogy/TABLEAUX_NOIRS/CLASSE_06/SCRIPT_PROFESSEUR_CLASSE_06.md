# SCRIPT PROFESSEUR — CLASSE 6 (M4)

**Usage :** lecture / reformulation en salle.  
**Voix :** senior supply chain & logistique (~25 ans) — grande distribution, CD haut volume, opérations Canada–États-Unis, lien achats/ops/transport/finance.  
**Pas d’autobiographie.** Expérience au service de l’explication.

Companion : [`TABLEAU_NOIR_CLASSE_06.md`](./TABLEAU_NOIR_CLASSE_06.md) · [`GUIDE_SCENARIOS_CLASSE_06.md`](./GUIDE_SCENARIOS_CLASSE_06.md)

---

## 0. Préparation (avant 18:00)

- Vérifier `teacherValidated` M3 sur le Dashboard.
- Afficher Annexe A (tableau ou paper).
- Mode Évaluation pour les runs certification.
- Préparer le tableau : colonnes M1 / M2 / M3 vides pour l’ouverture.

---

## 1. Ouverture 18:00–18:30 — Consolidation M1–M3 uniquement

### 1.1 Accueil (3 min)

« Bonsoir. Avant les KPI, on ancre ce que vous savez déjà faire. Dans une opération de grande distribution, un analyste qui ne comprend pas l’exécution invente des décisions dangereuses. On consolide M1, M2, M3 — sans ouvrir encore le Module 4. »

### 1.2 M1 — Exécuter (8 min)

Au tableau :

```
PO → GR → PUTAWAY → MOUVEMENTS → COHÉRENCE PHYSIQUE / SYSTÈME
```

**Dire :**  
« M1, c’est la discipline d’entrée. La PO engage le fournisseur. La GR prouve l’arrivée. Le putaway place. Les mouvements tracent. La cohérence physique/système est le contrat de confiance. Si le système dit 200 et le quai en a 185, le KPI de demain mentira. »

**Question :** « Que se passe-t-il si on reçoit sans PO valide ? »  
**Attendu :** pas d’entrée propre · contamination du stock · rupture de traçabilité.

**Analogie :** « C’est comme enregistrer un paiement sans facture : le cash bouge, le contrôle disparaît. »

### 1.3 M2 — Contrôler (8 min)

```
FIFO · CAPACITÉS · LOTS · EXCEPTIONS · CONTRÔLE AVANT VALIDATION
```

**Dire :**  
« Dans un centre de distribution à haut volume, le FIFO n’est pas une théorie de date : c’est éviter la péremption, les reprises et les litiges. La capacité bin, c’est la physique. Les lots, c’est la preuve. Les exceptions, c’est le moment où le professionnel ralentit. Contrôler avant de valider : c’est ce qui sépare l’opérateur pressé du professionnel. »

**Question :** « Pourquoi forcer 501 unités dans un bin de 500 est une mauvaise idée même si “ça passe” à l’œil ? »  
**Attendu :** débordement · erreur adresse · risque inventaire · non-conformité.

### 1.4 M3 — Planifier (8 min)

```
DEMANDE · MIN/MAX · RÉAPPRO · DISPONIBILITÉ · LEAD TIME FOURNISSEUR
```

**Dire :**  
« M3, c’est anticiper. La demande dit ce qui part. Min/Max et ROP disent quand agir. Le réappro dit combien. La disponibilité dit ce qu’on peut promettre. Le lead time fournisseur dit le délai réel — pas le délai marketing. Dans une opération transfrontalière Canada–États-Unis, ce lead time change avec douane, transport et fournisseur : le planificateur qui ignore le délai casse le service. »

**Question :** « Stock sous ROP — que déclenche une logique saine ? »  
**Attendu :** signal de réappro / PO — pas attendre la rupture.

### 1.5 Synthèse ouverture (3 min)

Écrire :

```
M1–M3 : EXÉCUTER · CONTRÔLER · PLANIFIER
```

**Phrase forte :**  
« Vous savez faire tourner l’entrepôt. Maintenant on apprend à le **mesurer** sans se tromper de décision. »

---

## 2. Transition 18:30–18:40 — Entrée M4

Écrire en gros :

```
M4 : MESURER → INTERPRÉTER → DÉCIDER → SUIVRE
```

**Dire :**  
« Dans une revue de performance avec les achats, les opérations et le transport, personne ne gagne avec un seul chiffre. M4 est analytique : moniteur de transactions vide = normal. On lit le KPI tower. On classe. On décide. On suit. »

Distribuer / pointer Annexe A.

---

## 3. Slides — scripts oraux complets

### SLIDE M4-S1 — Tableau de bord KPI — Vue d’ensemble

**QUOI OBSERVER**  
Tour de contrôle · familles Rotation / Service / Erreurs / Lead time · absence de mouvements stock.

**CE QUE DIT LE PROFESSEUR**  
« Regardez ce dashboard comme une tour de contrôle aéroportuaire. Vous ne poussez pas les avions à la main : vous lisez altitude, carburant, météo. En M4, vous ne postez pas une GR pour “voir si ça marche”. Les données sont là. Votre métier : lire juste, interpréter juste, décider juste. Si le moniteur TX est vide, ce n’est pas un bug — c’est le design analytique. »

**EXEMPLE PROFESSIONNEL**  
Revue hebdomadaire CD retail : ops apporte OTIF et erreurs ; finance apporte capital ; supply apporte lead time. Une seule réunion, quatre lentilles.

**EXEMPLE QUANTITATIF**  
Présenter le jeu Annexe A sans encore conclure.

| INPUT | FORMULE | RÉSULTAT | CLASSIFICATION | DÉCISION | SUIVI |
|-------|---------|----------|----------------|----------|-------|
| Jeu Annexe A | — | — | À classer slide par slide | Ne pas décider encore | Ouvrir SCN après S7 |

**ERREUR FRÉQUENTE**  
Chercher une transaction WMS « pour avancer ».

**QUESTION**  
« Pourquoi M4 refuse-t-il le réflexe opérateur ? »  
**ATTENDU**  
Parce que la compétence est l’interprétation, pas le posting.

**PHRASE FORTE**  
« Vide ≠ cassé. Vide = lisez. »

**TRANSITION**  
« Première lentille : la rotation — l’argent dans les casiers. »

**GLOSSAIRE** Dashboard / KPI tower · **SCÉNARIO** 012–014

---

### SLIDE M4-S2 — Rotation des stocks

**QUOI OBSERVER**  
Formule · bande 4–12 · exemple 2 400 ÷ 400.

**CE QUE DIT LE PROFESSEUR**  
« Rotation = consommation annuelle divisée par stock moyen. Calculez avec moi : 2 400 divisé par 400 = 6. Six tours par an. Dans la bande industrielle 4 à 12, c’est **normal**. Moins de 4× : rotation faible — **risque** de surstock. Plus de 12× : rotation élevée — **risque** de stock trop serré ou de rupture à vérifier (OTIF, lead time, stock de sécurité). Une rotation élevée n’est pas mauvaise en soi : elle devient risquée si le stock ne protège plus le niveau de service. Attention : la moyenne du portefeuille peut cacher des SKU morts. Le CFO voit 48 000 $ immobilisés et demande si c’est justifié. Votre job n’est pas de paniquer : c’est de classer, puis de segmenter. »

**EXEMPLE PROFESSIONNEL**  
Grande distribution : un SKU promo qui tourne 20× à côté d’un SKU saisonnier à 2× — la moyenne 6× est saine, le SKU à 2× mérite une action ciblée, pas un destock global.

**EXEMPLE QUANTITATIF**

| INPUT | FORMULE | RÉSULTAT | CLASSIFICATION | DÉCISION | SUIVI |
|-------|---------|----------|----------------|----------|-------|
| 2 400 u. · 400 u. | C ÷ S | **6×** | Normale (4–12) | Maintenir globalement | Surveiller SKU < 4× · revue mensuelle capital |

**ERREUR FRÉQUENTE**  
Écrire « surstock » à 6×.

**QUESTION**  
« Les 48 000 $ sont-ils justifiés ? »  
**ATTENDU**  
Oui au global ; surveiller les SKU lents.

**PHRASE FORTE**  
« Une rotation élevée n’est pas mauvaise en soi. Elle devient risquée si le stock ne protège plus le niveau de service. »

**TRANSITION**  
« Deuxième lentille : le client — OTIF — et la qualité d’exécution. »

**GLOSSAIRE** Rotation · Capital immobilisé · **SCÉNARIO** SCN-012

---

### SLIDE M4-S3 — OTIF & erreurs opérationnelles

**QUOI OBSERVER**  
285/300 · 12/300 · corrélation picking/réception · piège tableau vert.

**CE QUE DIT LE PROFESSEUR**  
« OTIF = commandes à temps et complètes sur total. 285 sur 300 = 95 %. Au seuil, c’est **excellent**. Erreurs : 12 sur 300 = 4 % — bande **acceptable**, pas “excellent”. Dans une revue SLA, le piège classique : tout est vert, donc on ne finance rien. Or les erreurs de picking et de réception rongent l’OTIF avant le renouvellement contrat. Vert aujourd’hui peut être rouge à J-90 si on ne corrige pas. »

**EXEMPLE PROFESSIONNEL**  
Compte clé retail : OTIF 95 %, mais 4 % d’erreurs picking génèrent reprises, crédits et fatigue client — le renew est en jeu.

**EXEMPLE QUANTITATIF**

| INPUT | FORMULE | RÉSULTAT | CLASSIFICATION | DÉCISION | SUIVI |
|-------|---------|----------|----------------|----------|-------|
| 285/300 | OTIF | 95 % | Excellent | Protéger le service | Suivre OTIF + erreurs |
| 12/300 | Erreurs | 4 % | Acceptable | Action qualité | Cible ~2 % / 90 j · revue hebdo top 3 |

**ERREUR FRÉQUENTE**  
Dire « service faible à 95 % » ou ignorer les 4 %.

**QUESTION**  
« Un OTIF excellent suffit-il à sécuriser la performance ? »  
**ATTENDU**  
Non — surveiller et traiter les erreurs.

**PHRASE FORTE**  
« Vert n’interdit pas l’action qualité. »

**TRANSITION**  
« Productivité et coût : le langage du trade-off. »

**GLOSSAIRE** OTIF · Taux d’erreur · **SCÉNARIO** SCN-013

---

### SLIDE M4-S4 — Productivité et coût

**QUOI OBSERVER**  
Unités/heure · coût/unité · leviers (process, formation, automation).

**CE QUE DIT LE PROFESSEUR**  
« Productivité = unités traitées / heures. Coût unitaire = coût total / unités. Ces formules ne remplacent pas Annexe A dans le scoring M4, mais elles éclairent le comité : former coûte aujourd’hui, mal picker coûte demain en reprises et en OTIF. Dans une revue finance-ops, on compare le coût d’une initiative qualité au coût d’un destock qui casserait le service. »

**EXEMPLE PROFESSIONNEL**  
Choisir entre budget formation picking et projet destock CFO — le coût caché des erreurs gagne souvent.

**EXEMPLE QUANTITATIF (illustratif)**

| INPUT | FORMULE | RÉSULTAT | CLASSIFICATION | DÉCISION | SUIVI |
|-------|---------|----------|----------------|----------|-------|
| 1 200 u. / 8 h | Prod. | 150 u./h | Contexte | Ne pas décider seul sur prod. | Suivre avec OTIF/erreurs |
| Coût erreurs (reprises) | Coût / u. | (cas) | Pression ops | Préférer qualité si OTIF déjà excellent | KPI erreurs |

**ERREUR FRÉQUENTE**  
Remplacer l’analyse OTIF/rotation par un discours productivité vague.

**QUESTION**  
« Pourquoi la productivité seule ne choisit pas l’initiative S&OP ? »  
**ATTENDU**  
Parce que service, capital et risques client doivent entrer dans l’arbitrage.

**PHRASE FORTE**  
« Productivité sans service est une victoire locale. »

**TRANSITION**  
« RCA : comment on structure la décision. »

**GLOSSAIRE** Productivité · Coût · **SCÉNARIO** SCN-014 (cadre)

---

### SLIDE M4-S5 — Root Cause Analysis

**QUOI OBSERVER**  
Chaîne Problème → Données → Cause → Action → Suivi KPI.

**CE QUE DIT LE PROFESSEUR**  
« RCA, ce n’est pas trouver un coupable. C’est relier un symptôme à une cause actionnable. Problème : pression cash ou risque SLA. Données : Annexe A. Cause : pas “le stock est trop haut” à 6× — plutôt erreurs d’exécution à 4 % qui menacent OTIF. Action : une initiative. Suivi : KPI datés. Un décideur mono-KPI sous-optimise toujours quelqu’un d’autre dans la chaîne. »

**EXEMPLE PROFESSIONNEL**  
Comité S&OP mensuel : CFO pousse destock ; Ventes protège OTIF ; Ops veut formation ; Supply calme sur lead time 3,5 j.

**EXEMPLE QUANTITATIF**  
Utiliser les 4 lentilles 6× / 95 % / 4 % / 3,5 j pour un seul budget.

**ERREUR FRÉQUENTE**  
Liste de souhaits sans priorité unique.

**QUESTION**  
« Combien d’initiatives finance-t-on si le budget n’en permet qu’une ? »  
**ATTENDU**  
Une — avec compromis explicite.

**PHRASE FORTE**  
« Une priorité, un compromis, un suivi. »

**TRANSITION**  
« On mappe ça sur SCN-012, 013, 014. » *(sauter S6)*

**GLOSSAIRE** RCA · S&OP · **SCÉNARIO** SCN-014

---

### SLIDE M4-S7 — Application aux scénarios

**QUOI OBSERVER**  
Trois questions métier sur le **même** jeu de données.

**CE QUE DIT LE PROFESSEUR**  
« Même Annexe A. Trois rôles. SCN-012 : finance — capital justifié ? SCN-013 : SLA — OTIF suffit ? SCN-014 : S&OP — quelle initiative ? Votre note reste courte : Lecture, Décision, Suivi. Pas d’essai. »

**PHRASE FORTE**  
« Même dashboard, trois décisions. »

**TRANSITION**  
Quiz puis TP.

---

## 4. Glossaire oral (5 min avant quiz)

Passer la table du Tableau Noir §G. Insister : Fill Rate ≠ OTIF.

---

## 5. Quiz M4 (≈15 min)

« Objectif : sécuriser les bandes. Si quelqu’un coche “surstock à 6×”, on corrige immédiatement après. »

---

## 6. Brief TP avant scénarios (5 min)

Écrire :

```
KPI_DATA → KPI_ROTATION → KPI_SERVICE → KPI_DIAGNOSTIC → COMPLIANCE_M4
LECTURE → DÉCISION → SUIVI
```

« Vous êtes en Évaluation. Seuil 70. Aucune transaction physique. »

Puis enchaîner le guide scénarios.

---

## 7. Clôture (5–8 min)

Reprendre les trois réponses modèles :

1. « Rotation 6×, zone normale. Maintenir globalement. Surveiller les SKU lents. »  
2. « OTIF 95 %, excellent. Erreurs 4 %, à surveiller. Action qualité et suivi. »  
3. « Priorité qualité. Maintenir le stock. Revoir OTIF et erreurs dans 90 jours. »

« Classe suivante : on consolide et on complète M4. Même discipline. »

---

*Script Professeur Classe 6 — documentation pédagogique uniquement*
