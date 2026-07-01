# Revue QA finale — Guide étudiant M4/M5 (PDF-ready)

**Document audité :** `TECWMS_GUIDE_ETUDIANT_M4_M5_PREPARATION_CERTIFICATION_PDF_READY.md`  
**Date de revue :** 19 juin 2026  
**Type de revue :** Pédagogique et institutionnelle uniquement (audit — aucune modification du source)  
**Références de contrôle :** `Documentation/Pedagogical_Framework/.../05-evaluation-thresholds.md`, `02-INSTRUCTOR-FACILITATION/05-evaluation-consistency-rules.md`, `Documentation/CERTIFICATION_INTELLIGENCE_AUDIT.md`, `shared/learningFeedbackRegistry.ts`, `RC14_SILVER_FINAL_ACCEPTANCE.md`

---

## Verdict global

# YELLOW

**Publication :** Le guide est **pédagogiquement solide et utilisable** pour la préparation SCN-012 à SCN-017. Aucun bloqueur de type RED (contradiction majeure, seuils obsolètes, fuite de validateur, réponses canoniques intégrales). Des **ajustements de clarté institutionnelle** sont recommandés avant diffusion officielle à grande échelle — principalement le cadrage **Silver vs Gold** et quelques précisions rédactionnelles.

---

## Synthèse exécutive

| # | Critère | Verdict | Commentaire |
|---|---------|---------|-------------|
| 1 | Cohérence M4 / M5 | **PASS** | Paradigmes distincts et rappels anti-confusion présents |
| 2 | Seuils à jour | **PASS** | 70/100 M4–M5, bandes Annexe A alignées |
| 3 | Règles de certification obsolètes | **PASS avec réserve** | Pas de règle fausse ; cadrage certification incomplet |
| 4 | Divulgation validateur | **PASS avec réserve** | Pas de logique interne ; rubriques chiffrées proches de l’UI |
| 5 | Réponses canoniques copier-coller | **PASS** | Structures oui, paragraphes modèles non |
| 6 | Terminologie cohérente | **PASS avec réserve** | KPI/OTIF/Rotation/Service/Ledger/S&OP OK ; anglicismes assumés |
| 7 | Grammaire et orthographe FR | **PASS avec réserve** | Qualité globale bonne ; 2–3 formulations à corriger |
| 8 | Expérience certification Silver | **PASS avec réserve** | Pas de contradiction Silver ; ambiguïté Gold/couverture |
| 9 | Ton institutionnel | **PASS** | Professionnel, étudiant, Collège de la Concorde |
| 10 | Prêt PDF | **PASS avec réserve** | Structure OK ; risque page blanche post-couverture |

---

## 1. Contradictions entre M4 et M5

**Verdict : PASS**

Le guide établit clairement deux paradigmes (tableau « Deux paradigmes à distinguer », lignes 207–215) :

| Dimension | M4 | M5 | Cohérence |
|-----------|----|----|-----------|
| Activité | Interprétation KPI portefeuille | Exécution ops + KPI dérivés | ✓ |
| Moniteur | Vide = normal | Transactions GR → … → REPLENISH | ✓ |
| Source chiffres | Tour de contrôle + Annexe A | Ledger / snapshot du run | ✓ |
| Niveau décision | Politique / arbitrage | Tactique (015/016) vs stratégique (017) | ✓ |

**Rappels anti-confusion bien placés :**
- M5 : ne pas recopier portefeuille M4 (`400`, `48 000 $`) — SCN-015, 016, 017
- M4 : pas de transactions WMS — SCN-012
- Mêmes **bandes** Annexe A pour **classer** en M5, échelle opérationnelle différente — SCN-017, progression pédagogique

**Aucune contradiction bloquante identifiée** entre les six scénarios ou entre modules.

**Note mineure (non bloquante) :** SCN-012 interdit `formation picking` / `J-90` dans les mots-clés, tandis que SCN-013/015/016 les recommandent — **cohérent par scénario**, pas contradictoire.

---

## 2. Seuils obsolètes

**Verdict : PASS**

| Seuil documenté | Source officielle | Alignement |
|-----------------|-------------------|------------|
| **70 / 100** par scénario M4–M5 | `05-evaluation-thresholds.md`, `05-evaluation-consistency-rules.md` | ✓ |
| Rotation **4–12×** = normal | Annexe A / `learningFeedbackRegistry` | ✓ |
| OTIF **≥ 95 %** = excellent | Idem | ✓ |
| OTIF **< 85 %** = insuffisant | Idem | ✓ |
| Erreurs **1–5 %** = acceptable | Idem | ✓ |
| Délai **3–7 j** = normal | Idem | ✓ |
| Bundle M4 : **6×, 95 %, 4 %, 3,5 j, 48 000 $** | Registry SCN-012 | ✓ |

**Aucun seuil M1/M2 (60/100)** n’est appliqué par erreur à M4/M5.  
**Aucun ancien seuil** (ex. 60/100 pour M4) détecté.

**Lacune non bloquante :** le guide ne mentionne pas le **Quiz M5 ≥ 60 %** (exigence Gold). Hors scope scénario strict, mais pertinent si la couverture parle de « certification ».

---

## 3. Règles de certification obsolètes

**Verdict : PASS avec réserve**

**Ce qui est correct :**
- Seuil 70/100 pour M4 et M5 — conforme au parcours Gold actuel
- Pas de règle Silver erronée (ex. exiger SCN-012 pour Silver)
- Pas de mention d’émission automatique de certificat par le simulateur
- Pas de référence à d’anciens moteurs ou seuils RC13 obsolètes

**Réserve institutionnelle — cadrage certification :**

| Fait programme (2026) | Présence dans le guide |
|------------------------|------------------------|
| **Silver** = M1 (SCN-001–005) + Quiz M1 60 % | Non mentionné |
| **Gold** = Silver + M2–M5 (dont M4/M5 à 70/100) + Quiz M5 60 % | Non mentionné |
| Conformité finale **verte** requise | Absente de la checklist (item « cohérence » seulement) |
| Mode démo exclu de la certification | Non mentionné (acceptable en guide scénario) |

La couverture indique « **Préparation aux scénarios et à la certification** » sans préciser que **M4/M5 relèvent du parcours Gold**, pas du Silver. Pour un étudiant ayant obtenu Silver (M1), ce libellé peut laisser croire que ce guide prépare une **nouvelle** certification Silver plutôt que la **poursuite vers Gold**.

**Recommandation (sans modification effectuée) :** ajouter une phrase de cadrage du type : *« Modules 4 et 5 — parcours Gold (certification Silver M1 préalable requise). »*

---

## 4. Divulgation accidentelle de la logique validateur

**Verdict : PASS avec réserve**

**Absences positives (conformes) :**
- Pas de points de pénalité (−5 pts, etc.)
- Pas de codes d’erreur API (`COMPLIANCE_M4_FAILED`, `STRATEGIC`, etc.)
- Pas de pondération sémantique / mots-clés « magiques »
- Pas de références au moteur (`rotationStatus`, pipeline scoring)
- Pas de seuils de caractères minimum explicites
- Déclaration explicite d’exclusion : « logique interne de correction automatique » (l. 180)

**Formulations proches du rubric / UI (acceptable mais à surveiller) :**

| Passage | Risque | Évaluation |
|---------|--------|------------|
| « ≥ 2 KPI chiffrés » (SCN-017, OIL Panel B) | Miroir rubrique capstone | **Faible** — visible côté étudiant dans l’UI |
| « ≥ 3 domaines KPI, idéal : 4 » (SCN-014) | Miroir attente board | **Faible** — pédagogique, pas algorithme |
| « progression bloquée » / « KPI bloqué » / « verrouillé » | Comportement simulateur | **Négligeable** — expérience utilisateur |

**Conclusion :** pas de fuite de validateur au sens audit RC13/RC15. Les seuils qualitatifs reflètent des **attentes pédagogiques publiques**, pas la logique interne de scoring.

---

## 5. Réponses canoniques copier-coller

**Verdict : PASS**

Comparaison avec `GUIDE_OFFICIEL_REPONSES_M4_M5.md` et `SCN0xx_CANONICAL_RESPONSES.md` :

| Élément | Guide étudiant | Canonique instructeur |
|---------|----------------|----------------------|
| Paragraphes diagnostic complets | **Absents** | Présents mot pour mot |
| Classifications (normale, excellent) | Présentes | Identiques (dérivées Annexe A) |
| Politique SCN-012 « maintien + surveillance SKU » | Directionnelle | Paragraphe complet |
| SCN-013 cible « 2 % » explicite | **Absente** | Présente dans canonique |
| Valeurs ops M5 (50, −5, PO, bin) | Contrat mission + logique | Tableaux chiffrés exacts |

Le guide enseigne **comment raisonner et structurer**, pas **quoi recopier**. Les classifications **normale / excellent** pour 6× et 95 % sont **pédagogiquement inévitables** (données fixes Annexe A), pas des réponses rédigées.

**Point de vigilance (non RED) :** la structure SCN-012 diagnostic (l. 271) prescrire « maintien + surveillance SKU ciblée » réduit l’espace de réponses alternatives valides (ex. ajustement ciblé par SKU lents). Acceptable comme **orientation**, pas comme texte soumis.

---

## 6. Terminologie cohérente

**Verdict : PASS avec réserve**

| Terme | Usage | Cohérence |
|-------|-------|-----------|
| **KPI** | Majuscules, pluriel | ✓ Uniforme |
| **OTIF** | Défini via « Service (OTIF) » | ✓ |
| **Rotation** | Formule + bande | ✓ |
| **Service** | Alterne avec OTIF selon contexte | ✓ Acceptable |
| **Ledger** | M5 uniquement (moniteur, snapshot) | ✓ |
| **S&OP** | SCN-014, majuscules | ✓ |

**Anglicismes métier (cohérents avec le simulateur) :** `trade-off`, `board`, `dashboard`, `lead time`, `working capital`, `snapshot`, `Peak Week`, codes ops (`GR`, `PUTAWAY`, `MI04`, `MI07`).

**Écarts mineurs :**
- L. 409 : « **Triangle** d'arbitrage » alors que **quatre** dimensions sont listées (cash · service · exécution · supply) → préférer « cadre d'arbitrage » ou « quadrangle »
- L. 461 : `erreur` (singulier) vs `erreurs` ailleurs
- L. 200 : « données portefeuille partagé » — accord grammatical (voir §7)

---

## 7. Grammaire et orthographe (français)

**Verdict : PASS avec réserve**

**Points forts :**
- Accents et typographie française corrects (é, è, à, ô, ç)
- Registre soutenu et accessible
- Ponctuation et listes homogènes
- Tirets cadratins et guillemets français bien employés

**Corrections recommandées (sans modification effectuée) :**

| Ligne | Formulation actuelle | Suggestion |
|-------|---------------------|------------|
| 200 | « données portefeuille partagé » | « jeu de données de portefeuille partagé » ou « données de portefeuille partagées » |
| 409 | « Triangle d'arbitrage » (4 axes) | « Cadre d'arbitrage multi-KPI » |
| 468 | « Ops (étapes 1 à 4) » + « cycle complet » | Préciser « étapes opérationnelles 1 à 4 sur 7 » pour éviter l’ambiguïté (KPI, décision, conformité absentes de la liste) |

**Anglicismes :** acceptables dans un contexte ERP/WMS institutionnel québécois ; pas d’erreur, choix éditorial.

---

## 8. Cohérence avec l’expérience certification Silver actuelle

**Verdict : PASS avec réserve**

**Contexte Silver (RC14, juin 2026) :**
- Silver = **Module 1 uniquement** (SCN-001–005, Quiz M1 60 %)
- Affichage certificat Silver : couche visuelle RC14 (crest, signatures, QR placeholder)
- **Aucune règle Silver** ne couvre M4/M5

**Alignement du guide :**
- ✓ Ne prétend pas que M4/M5 débloquent Silver
- ✓ Seuil 70/100 correct pour M4/M5 (Gold)
- ✓ Pas de conflit avec `RC14_SILVER_FINAL_ACCEPTANCE.md` (domaine display-only)

**Écarts par rapport au parcours étudiant Silver → Gold :**

| Expérience plateforme | Guide |
|----------------------|-------|
| Silver obtenu après M1 | Non rappelé |
| M4 accessible après M3 validé enseignant | Hors scope (OK) |
| Gold requiert Silver + M2–M5 + Quiz M5 | Non explicité |
| Conformité verte finale par scénario | Checklist partielle |

**Réserve principale :** le titre « Préparation à la **certification** » sans qualifiant **Gold** peut désorienter un étudiant certifié Silver qui consulte ce guide pour M4/M5. Contenu scénario correct ; **cadrage parcours certification** à renforcer.

---

## 9. Ton institutionnel

**Verdict : PASS**

| Critère | Évaluation |
|---------|------------|
| Identité Collège de la Concorde | Couverture, pied de page, sous-titre ✓ |
| Marque TEC.WMS / programme TEC.LOG | Cohérent avec l’écosystème existant ✓ |
| Public étudiant | Impératifs pédagogiques, pas jargon instructeur ✓ |
| Neutralité | Pas de promesse de réussite ; pièges nommés ✓ |
| Exclusions professionnelles | « Ce guide ne contient pas… » (l. 176–181) ✓ |
| Checklist finale | Rituel de préparation professionnel ✓ |

Ton adapté à une publication Collège de la Concorde — simulateur pédagogique ERP/WMS.

---

## 10. Prêt PDF

**Verdict : PASS avec réserve**

**Éléments PDF-ready présents :**
- Page de couverture structurée (HTML + CSS)
- Table des matières manuelle avec ancres
- Sauts de page (`page-break`, `\newpage`) entre scénarios
- Pied de page institutionnel (CSS `@page` + YAML Pandoc)
- En-têtes configurés (YAML `fancyhdr`)
- Styles tableaux, checklist, cover

**Risques techniques identifiés (conversion réelle testée séparément) :**
- **Double saut de page post-couverture** (l. 127–130 : `page-break` après `.cover-page` qui a déjà `page-break-after`) → risque **page blanche** selon moteur PDF
- Mélange Markdown + HTML + LaTeX (`\newpage`) : OK pour Puppeteer ; `\newpage` ignoré en HTML
- Ancres TOC avec accents : comportement variable selon convertisseur
- Trois `#` sur la couverture peuvent générer des entrées TOC parasites dans certains outils

**Contenu :** intégralement convertible ; mise en page institutionnelle validée en génération PDF (19 pages, accents OK, tableaux OK).

---

## Revue par scénario (condensée)

| SCN | Alignement pédagogique | Risque |
|-----|------------------------|--------|
| **012** | Capital / rotation / complaisance — conforme registry | Faible — politique prescriptive |
| **013** | Tableau vert / dual KPI / J-90 — conforme | Faible |
| **014** | S&OP multi-KPI / délai — conforme règles instructeur | Faible — « triangle » à 4 axes |
| **015** | Ops → ledger → tactique — conforme | Faible — « étapes 1 à 4 » imprécis |
| **016** | Réconcilier avant piloter — conforme | Faible |
| **017** | Stratégique / preuves / arbitrage — conforme Annexe B | Faible — seuils ≥2 KPI rubric-adjacents |

---

## Findings priorisés

### Priorité haute (avant diffusion institutionnelle large)

1. **Clarifier Gold vs Silver** dans la couverture ou la présentation — M4/M5 = parcours Gold, Silver = M1 acquis.
2. **Corriger** « données portefeuille partagé » (accord).

### Priorité moyenne

3. Remplacer « Triangle d'arbitrage » (4 dimensions) par formulation exacte.
4. Préciser « étapes opérationnelles 1 à 4 sur 7 » en SCN-015.
5. Ajouter à la checklist : **conformité verte** avant soumission finale.
6. Éliminer le double `page-break` post-couverture pour PDF sans page blanche.

### Priorité basse

7. Mention optionnelle Quiz M5 60 % (Gold).
8. Harmoniser `erreur` / `erreurs` en SCN-015.

---

## Matrice de classification finale

| Niveau | Signification | Applicable ? |
|--------|---------------|--------------|
| **GREEN** | Publication sans réserve | Non — réserves institutionnelles présentes |
| **YELLOW** | Publication avec réserves documentées | **Oui** |
| **RED** | Retrait ou réécriture majeure requise | Non |

---

## Conclusion

Le guide `TECWMS_GUIDE_ETUDIANT_M4_M5_PREPARATION_CERTIFICATION_PDF_READY.md` est **pédagogiquement aligné** avec les scénarios SCN-012 à SCN-017, les bandes Annexe A, les seuils 70/100 et les règles instructeur M4/M5. Il **respecte la consigne** de ne pas exposer la logique validateur ni fournir de réponses canoniques intégrales.

La classification **YELLOW** reflète des **ajustements de clarté institutionnelle** (certification Gold vs Silver, grammaire, précisions rédactionnelles, checklist conformité, artefact PDF page blanche) — **aucun bloqueur pédagogique ou de conformité seuils/règles**.

---

*Revue QA — audit only — juin 2026 · Collège de la Concorde · TEC.WMS*
