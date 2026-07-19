# GUIDE SCÉNARIOS — CLASSE 6 (SCN-012 · SCN-013 · SCN-014)

**Module :** M4 — mode analytique (aucune transaction WMS)  
**Pipeline commun :**

```
KPI_DATA → KPI_ROTATION → KPI_SERVICE → KPI_DIAGNOSTIC → COMPLIANCE_M4
```

**Jeu Annexe A (partagé) :**

| Indicateur | Valeur |
|------------|--------|
| Consommation annuelle | 2 400 u. |
| Stock moyen | 400 u. |
| Rotation | 6× (2 400 ÷ 400) |
| OTIF | 95 % (285 ÷ 300) |
| Erreurs | 4 % (12 ÷ 300) |
| Lead time | 3,5 j |
| Capital | 48 000 $ |

**Réponse courte (classe entière) :** `LECTURE → DÉCISION → SUIVI` (1–3 phrases)

Sources : `GUIDE_OFFICIEL_REPONSES_M4_M5.md` (lecture seule — ne pas modifier validators).

---

# SCN-012 — Politique stock et capital immobilisé

## Carte scénario

| Champ | Contenu |
|-------|---------|
| **Rôle** | Analyste logistique présentant à la finance |
| **Problème métier** | « Les 48 000 $ immobilisés sont-ils justifiés ? » |
| **Focus** | Rotation · capital · segmentation SKU · décision globale vs ciblée |
| **Seuil** | ≥ 70/100 |
| **Réponse courte modèle** | « Rotation 6×, zone normale. Maintenir globalement. Surveiller les SKU lents. » |

### Ce que la valeur prouve / ne prouve pas

| | |
|--|--|
| **Prouve** | Rotation portefeuille dans bande normale ; capital cohérent avec 6× |
| **Ne prouve pas** | Absence de SKU lents · absence de risque local · “rien à faire” |

| Risque opérationnel | Impact financier | Impact client |
|---------------------|------------------|---------------|
| Destock global aveugle | Libération cash court terme | OTIF menacé |
| Ignorer SKU < 4× | Capital qui pourrit localement | Obsolescence / markdown |

| Décision recommandée | Mauvaise alternative | Conséquence |
|----------------------|----------------------|-------------|
| Maintenir + surveillance SKU | Déclarer surstock / destock massif | Échec conformité · risque service |

**Question de débrief :** « Pourquoi “moyenne normale” n’interdit pas une action SKU ? »

---

## 7 couches pédagogiques — SCN-012

### 1. CONTEXTE PROFESSIONNEL
Revue Q3 avec finance / CFO. Pression working capital. L’analyste doit défendre une **politique**, pas une panique.

### 2. DONNÉES
Annexe A complète — focus rotation + capital ; OTIF/erreurs = contexte.

### 3. LECTURE KPI / OPÉRATION

| INPUT | FORMULE | RÉSULTAT | CLASSIFICATION | DÉCISION | SUIVI |
|-------|---------|----------|----------------|----------|-------|
| 2 400 · 400 | C ÷ S | 6× | Normale (4–12) | Maintenir | SKU < 4× mensuel |
| 48 000 $ | — | Capital | Cohérent avec 6× | Pas destock global | Revue capital |

### 4. DIAGNOSTIC
Pas de surstock systémique. Pression CFO légitime → segmentation.

### 5. DÉCISION
Maintenir la politique stock globale.

### 6. ACTION
Cartographier SKU lents ; ajustements ciblés seulement.

### 7. SUIVI
Revue mensuelle capital 48 000 $ + rotations à rotation faible.

---

## Étapes runtime — SCN-012

### Étape KPI_DATA

| | |
|--|--|
| **Observer** | Chargement Annexe A · contexte CFO |
| **Calculer** | Accuser réception des valeurs (pas encore classer en profondeur) |
| **Répondre** | Données chargées : rotation 6×, OTIF 95 %, erreurs 4 %, délai 3,5 j, capital 48 000 $. Analyse portefeuille, pas de TX WMS. |
| **Ne pas conclure** | « Surstock » ou « destock » dès cette étape |
| **Sens pro** | Briefing reçu = base commune comité |
| **Dashboard** | KPI tower visible |
| **Débrief** | Avez-vous listé toutes les valeurs avant d’opiner ? |

### Étape KPI_ROTATION

| | |
|--|--|
| **Observer** | 2 400 ÷ 400 |
| **Calculer** | 6× |
| **Répondre** | Rotation 6× = **performance normale** (4–12). Capital 48 000 $ cohérent ; pas de surstock systémique. |
| **Ne pas conclure** | Mot **surstock** · destock global |
| **Sens pro** | Classer avant de décider |
| **Dashboard** | Tuile rotation |
| **Débrief** | Où placez-vous 6× sur la bande ? |

### Étape KPI_SERVICE

| | |
|--|--|
| **Observer** | OTIF 95 % · erreurs 4 % (contexte) |
| **Calculer** | 285÷300 · 12÷300 |
| **Répondre** | OTIF excellent ; erreurs acceptables — soutiennent une politique de **maintien**, pas un destock global. |
| **Ne pas conclure** | Que le service “sauve” sans politique stock · ou que 4 % est le sujet principal (c’est 013) |
| **Sens pro** | Service bon = filet contre panique cash |
| **Dashboard** | Tuiles service / erreurs |
| **Débrief** | Pourquoi le service compte dans une question de capital ? |

### Étape KPI_DIAGNOSTIC

| | |
|--|--|
| **Observer** | Synthèse rotation + capital + surveillance |
| **Calculer** | — (interprétation) |
| **Répondre (modèle)** | Recommander **maintenir** + **surveillance SKU**. Décision : monitorer < 4× sans destock global. Action : revue mensuelle 48 000 $ et articles lents. |
| **Court** | « Rotation 6×, zone normale. Maintenir globalement. Surveiller les SKU lents. » |
| **Ne pas conclure** | « Rien à faire » · « aucune action » · plan formation picking (mauvais levier 012) |
| **Sens pro** | Politique + filet SKU = langage finance + ops |
| **Débrief** | Votre note a-t-elle Lecture + Décision + Suivi ? |

### Étape COMPLIANCE_M4

| | |
|--|--|
| **Observer** | Conformité interprétation documentée |
| **Répondre** | Clôturer après diagnostic actionnable |
| **Ne pas conclure** | Run “fini” sans mots-clés maintien / surveiller / SKU |
| **Débrief** | Compliance = preuve de raisonnement, pas un tampon |

---

# SCN-013 — OTIF, erreurs et protection de service

## Carte scénario

| Champ | Contenu |
|-------|---------|
| **Rôle** | Responsable performance préparant une revue SLA |
| **Problème métier** | « Un OTIF excellent suffit-il pour sécuriser la performance ? » |
| **Focus** | OTIF · taux d’erreur · risque qualité · Pareto/root cause · protection service |
| **Réponse courte modèle** | « OTIF 95 %, excellent. Erreurs 4 %, à surveiller. Action qualité et suivi. » |

| Prouve | Ne prouve pas |
|--------|----------------|
| Service au seuil excellent | Exécution sans fragilité · renew garanti |

| Risque | Financier | Client |
|--------|-----------|--------|
| Erreurs picking/réception | Reprises, crédits, coût qualité | Litiges · renew J-90 |

| Décision reco | Mauvaise alternative | Conséquence |
|---------------|----------------------|-------------|
| Programme qualité (cible ~2 %, 90 j) | « Tout va bien » / destock comme levier / qualifier 95 % de faible | Échec conformité · risque SLA |

**Débrief :** « Pourquoi le tableau vert est un piège ? »

---

## 7 couches — SCN-013

1. **CONTEXTE** — Renouvellement grand compte J-90.  
2. **DONNÉES** — OTIF 95 % · erreurs 4 % (+ contexte rotation/délai/capital).  
3. **LECTURE**

| INPUT | FORMULE | RÉSULTAT | CLASSIFICATION | DÉCISION | SUIVI |
|-------|---------|----------|----------------|----------|-------|
| 285/300 | OTIF | 95 % | Excellent | Protéger | OTIF parallèle |
| 12/300 | Erreurs | 4 % | Acceptable | Qualité | Hebdo top 3 · cible 2 % |

4. **DIAGNOSTIC** — Excellence OTIF + fragilité exécution.  
5. **DÉCISION** — Financer qualité, pas destock.  
6. **ACTION** — Formation picking · double validation réception · revue hebdo.  
7. **SUIVI** — Erreurs → 2 % sans dégrader OTIF ; horizon 90 j.

---

## Étapes runtime — SCN-013

### KPI_DATA
- **Observer :** briefing SLA J-90.  
- **Répondre :** OTIF 285/300 (95 %), erreurs 12/300 (4 %), rotation 6×, délai 3,5 j, capital 48 000 $.  
- **Ne pas conclure :** « service faible ».

### KPI_ROTATION
- **Répondre :** Rotation **normale** 6× — contexte stable (pas le levier principal).  
- **Ne pas conclure :** surstock.

### KPI_SERVICE *(erreurs intégrées — pas d’étape KPI_ERRORS séparée)*
- **Observer :** dual OTIF + erreurs · corrélation picking/réception.  
- **Répondre :** OTIF 95 % **excellent** ; erreurs 4 % **acceptables mais corrigeables** ; corréler picking/réception au risque OTIF avant J-90.  
- **Ne pas conclure :** OTIF seul sans erreurs · erreurs génériques sans picking/réception.

### KPI_DIAGNOSTIC
- **Répondre :** Piège tableau vert. OTIF excellent ; risque = erreurs 4 %. Recommander programme qualité (formation, double validation, revue hebdo top 3, cible 2 % / 90 j). Décision : budget formation plutôt que destock.  
- **Court :** « OTIF 95 %, excellent. Erreurs 4 %, à surveiller. Action qualité et suivi. »  
- **Ne pas conclure :** plan sans cible % ni horizon · destock principal.

### COMPLIANCE_M4
- Vérifier dualité OTIF+erreurs + plan chiffré.

---

# SCN-014 — Capstone S&OP multi-KPI

## Carte scénario

| Champ | Contenu |
|-------|---------|
| **Rôle** | Operations manager en comité S&OP |
| **Problème métier** | « Quelle initiative doit être financée en priorité ? » |
| **Focus** | Multi-KPI · trade-off · priorité · owner · horizon · suivi |
| **Structure** | PRIORITÉ · ACTION · COMPROMIS · RESPONSABLE · HORIZON · KPI DE SUIVI |
| **Réponse courte modèle** | « Priorité qualité. Maintenir le stock. Revoir OTIF et erreurs dans 90 jours. » |

### Lentilles

| Partie | KPI | Valeur | Pression |
|--------|-----|--------|----------|
| CFO | Rotation + capital | 6× · 48 000 $ | Cash |
| Ventes | OTIF | 95 % | Maintenir service |
| Ops | Erreurs | 4 % | Qualité exécution |
| Supply | Lead time | 3,5 j | Pas d’urgence (3–7) |

| Décision reco | Mauvaise alternative | Conséquence |
|---------------|----------------------|-------------|
| Initiative unique = qualité exécution ; reporter destock | Mono-KPI · liste sans trade-off · omettre lead time | Échec conformité / pédagogie |

**Débrief :** « Qu’avez-vous sacrifié explicitement ? »

---

## 7 couches — SCN-014

1. **CONTEXTE** — Budget pour **une** initiative.  
2. **DONNÉES** — Annexe A complète (4 domaines).  
3. **LECTURE** — Classer chaque KPI (normale / excellent / acceptable / normal).  
4. **DIAGNOSTIC** — Levier naturel = erreurs 4 % ; OTIF à protéger ; rotation pas surstock ; lead time à citer.  
5. **DÉCISION** — Financer qualité ; reporter destock.  
6. **ACTION** — Programme picking/réception 90 j.  
7. **SUIVI** — Rotation · OTIF · erreurs · délai (tableau de bord).

### Structure à faire écrire aux étudiants

| Élément | Exemple Classe 6 |
|---------|------------------|
| **PRIORITÉ** | Qualité d’exécution (réduire erreurs) |
| **ACTION** | Formation + contrôles réception/picking |
| **COMPROMIS** | Reporter destock / libération cash |
| **RESPONSABLE** | Ops / Qualité (owner nommé) |
| **HORIZON** | 90 jours |
| **KPI DE SUIVI** | Erreurs (→2 %) · OTIF (≥ seuil) · rotation · lead time |

---

## Étapes runtime — SCN-014

### KPI_DATA
Briefing multi-KPI + contrainte **une** initiative.

### KPI_ROTATION
Rotation normale 6× — pas de chasse au surstock global (héritage 012).

### KPI_SERVICE
Service excellent 95 % ; erreurs 4 % = risque latent à intégrer dans l’arbitrage.

### KPI_DIAGNOSTIC (≥ 150 caractères côté runtime — enseigner la densité utile, pas l’essai)
Inclure **au moins 3 domaines sur 4** (rotation · service · erreur · délai).  
Vocabulaire trade-off : arbitrage / reporte / maintien / priorité.  
**Court :** « Priorité qualité. Maintenir le stock. Revoir OTIF et erreurs dans 90 jours. »

### COMPLIANCE_M4
Vérifier multi-KPI + trade-off explicite + suivi.

---

## Comparatif pédagogique (à afficher)

| | SCN-012 | SCN-013 | SCN-014 |
|--|---------|---------|---------|
| Question | Capital justifié ? | OTIF suffit ? | Quelle initiative ? |
| Levier | Politique stock + SKU | Qualité exécution | Arbitrage unique |
| Mot-clé | *normale* / maintenir / SKU | *excellent* + erreurs + plan | trade-off + 90 j + multi-KPI |
| Interdit | surstock à 6× | « 95 % = faible » / OTIF seul | mono-KPI / sans compromis |

---

## Rappels scoring (information professeur — ne pas modifier le runtime)

| SCN | Seuil | Notes |
|-----|-------|-------|
| 012–014 | ≥ 70 | Plafond parfait historique documenté à 75 dans certains guides — **politique RC16 : max 100** possible ; enseigner le seuil 70 |
| Mode | Évaluation | Certification |

**À VALIDER en séance si divergence score max affichée UI vs guide :** confirmer message étudiant sur le plafond affiché — sans changer le code dans cette wave.

---

*Guide Scénarios Classe 6 — READY — documentation pédagogique uniquement*
