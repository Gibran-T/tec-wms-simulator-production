# Guide de rédaction étudiant — Modules 4 et 5 (SCN-012 à SCN-017)

**Programme :** TEC.LOG — Simulation WMS intégrée  
**Public :** étudiants  
**Langue :** français  
**Seuil de réussite :** 70 / 100 par scénario  
**Version :** 2026-06-19

---

## Comment utiliser ce guide

Ce document vous aide à **rédiger de meilleures réponses** en comprenant ce que chaque étape évalue. Il ne remplace pas votre analyse : vous devez **observer**, **calculer** et **argumenter** vous-même.

| Ce guide contient | Ce guide ne contient pas |
|-------------------|--------------------------|
| Où regarder dans le simulateur | Les formulations exactes à recopier |
| Quels KPI lire et comment les relier | Les réponses « modèles » des correcteurs |
| Concepts, structure et pièges courants | La logique interne de correction automatique |

**Ordre recommandé :** SCN-012 → 013 → 014 (Module 4), puis SCN-015 → 016 → 017 (Module 5 Peak Week).

---

## Référence commune — Bandes KPI (Annexe A)

| Indicateur | Formule / base | Bande normale ou excellente | Signal d'alerte |
|------------|----------------|------------------------------|-----------------|
| **Rotation** | Consommation ÷ stock moyen | **4 à 12×/an = normal** | < 4× : risque de surstock · > 12× : risque de stock trop serré |
| **Service (OTIF)** | Commandes honorées ÷ total | **≥ 95 % = excellent** | < 85 % insuffisant |
| **Erreurs** | Erreurs ÷ opérations | **1 à 5 % = acceptable** | > 5 % critique |
| **Délai (lead time)** | Délai moyen fournisseur | **3 à 7 j = normal** | Contexte supply chain |

**Module 4** — bundle portefeuille partagé (rotation 6×, OTIF 95 %, erreurs 4 %, délai 3,5 j, capital 48 000 $). Le moniteur de transactions reste **vide** : c'est normal.  
**Module 5** — vos KPI viennent du **moniteur après vos opérations** (échelle SKU, pas le portefeuille entier).

**Contrat ops M5 (fiche mission) :** SKU-001 · quai REC-01 · emplacement B-01-R1-L1 · lot LOT-M5-A · bon PO-M5-001 · min 10 · max 100.

---

# MODULE 4 — Tour de contrôle KPI (analytique)

> **Paradigme :** vous **interprétez** des indicateurs. Parcours : Briefing → Rotation → Service → Diagnostic → Conformité.

---

## SCN-012 — Rotation et capital immobilisé

**Contexte :** Revue CFO Q3 — les 48 000 $ immobilisés sont-ils justifiés ?  
**Piège central :** complaisance à rotation « normale » sans politique claire.

---

### Étape KPI_DATA — Données KPI

**1. Où porter son attention**
- Fiche mission : question du comité finance sur le capital circulant.
- Tour de contrôle KPI : bannière « mode analytique — aucune transaction WMS ».
- Bloc Annexe A : valeurs de référence du portefeuille.
- Cockpit : ordre des étapes (données → rotation → service → diagnostic).

**2. KPI à lire**
- Consommation annuelle, stock moyen (base du calcul rotation).
- OTIF, erreurs, délai, capital immobilisé — **contexte global**, pas encore le diagnostic final.

**3. Concepts attendus**
- Mode analytique M4 vs mode opérationnel M1–M3.
- KPI comme preuves de performance portefeuille, pas comme saisie ops.
- Cadrage CFO : politique stock et working capital.

**4. Mots-clés qui renforcent la réponse**
- `tour de contrôle`, `Annexe A`, `portefeuille`, `rotation`, `capital`, `OTIF`, `contexte CFO`

**5. Mots-clés à éviter**
- Vocabulaire de transaction WMS (`MIGO`, `LT01`, `réception`) — hors sujet M4.
- « Moniteur vide = bug » — c'est le comportement attendu.

**6. Structure de réponse suggérée**
1. Confirmer le mode analytique et le briefing lu.
2. Énumérer les indicateurs clés repérés dans le tour de contrôle.
3. Annoncer l'enjeu : revue politique stock / capital.

**7. Erreurs fréquentes**
- Tenter une réception ou un rangement dans le simulateur.
- Ignorer le capital immobilisé alors que la mission le met au centre.
- Confondre cette étape avec le diagnostic final.

**8. Pièges de validation**
- Soumettre sans avoir parcouru le tour de contrôle KPI.
- Réponses ops au lieu d'une reconnaissance des données analytiques.

---

### Étape KPI_ROTATION — Taux de rotation

**1. Où porter son attention**
- Objectif de l'étape : formule consommation ÷ stock moyen.
- Tuile rotation au centre du tour de contrôle (mise en évidence SCN-012).
- Annexe A : bande industrielle 4–12×.
- Alerte pédagogique sur la complaisance à 6×.

**2. KPI à lire**
- **Rotation (primaire)** : consommation ÷ stock moyen → classer dans la bande.
- **Capital immobilisé (primaire)** : relier au niveau de rotation.
- OTIF 95 %, erreurs 4 % — contexte secondaire seulement.

**3. Concepts attendus**
- Formule rotation = consommation annuelle ÷ stock moyen.
- Bande normale 4–12× : 6× n'est ni surstock ni rupture systémique.
- Lien rotation ↔ capital immobilisé ↔ pression CFO.
- DSI (jours de stock) comme complément de lecture.

**4. Mots-clés qui renforcent la réponse**
- `normale`, `équilibrée`, `bande 4–12`, `6×`, `formule`, `consommation`, `stock moyen`, `capital immobilisé`, `48 000 $`, `cohérent`

**5. Mots-clés à éviter**
- `surstock`, `sur-stock`, `excès de stock` — à 6×, fausse classification.
- `rupture`, `sous-performance` — incohérent avec la bande normale.
- `destock global`, `liquidation` — prématuré pour une rotation normale.

**6. Structure de réponse suggérée**
1. Citer la formule et les deux composantes (consommation, stock moyen).
2. Présenter le résultat calculé et le classer dans la bande Annexe A.
3. Relier explicitement rotation et capital immobilisé.
4. Conclure sur l'absence (ou non) de signal d'alerte rotation.

**7. Erreurs fréquentes**
- Classer 6× comme surstock (< 4× = surstock, pas 6×).
- Oublier la formule — une classification sans calcul manque de crédibilité.
- Appliquer la logique SCN-013 (erreurs / picking) — mauvais scénario.
- Recommander déjà un plan d'action détaillé — réservé au diagnostic.

**8. Pièges de validation**
- Mentionner « surstock » même pour dire « pas de surstock » — évitez le mot entièrement à 6×.
- Réponse trop courte sans formule ni bande.
- Contradiction avec la bannière pédagogique du simulateur.

---

### Étape KPI_SERVICE — Taux de service

**1. Où porter son attention**
- Objectif : OTIF 285/300 et son classement industriel.
- Tuile service dans le tour de contrôle.
- Annexe A : seuil excellent ≥ 95 %.
- Contexte SCN-012 : le service **contextualise** la politique stock, il n'est pas le levier principal.

**2. KPI à lire**
- **OTIF (primaire)** : 285/300 → pourcentage → bande.
- **Erreurs (secondaire)** : 4 % — contexte, pas angle principal SCN-012.
- Rotation 6× — rappel de cohérence portefeuille.

**3. Concepts attendus**
- OTIF = On Time In Full ; KPI client prioritaire.
- Seuil excellent ≥ 95 % vs acceptable 85–95 %.
- Service excellent = ne pas justifier un destock agressif.
- Erreurs acceptables (1–5 %) comme contexte, pas comme urgence ici.

**4. Mots-clés qui renforcent la réponse**
- `excellent`, `optimal`, `seuil`, `95 %`, `285/300`, `OTIF`, `acceptable`, `contexte`

**5. Mots-clés à éviter**
- `faible service`, `insuffisant`, `critique` — à 95 %, mauvaise bande.
- `formation picking`, `plan J-90` — logique SCN-013, pas SCN-012.
- `surstock` — hors sujet à cette étape service.

**6. Structure de réponse suggérée**
1. Calculer ou citer OTIF (commandes honorées ÷ total).
2. Classer le résultat (excellent / acceptable / insuffisant).
3. Mentionner brièvement les erreurs en contexte.
4. Relier au cadrage capital : service favorable pour une politique prudente.

**7. Erreurs fréquentes**
- Qualifier 95 % de « acceptable » au lieu d'« excellent ».
- Traiter uniquement les erreurs en oubliant l'OTIF.
- Proposer un plan qualité complet — trop tôt, réservé au diagnostic SCN-013.

**8. Pièges de validation**
- Contradire l'excellence reconnue du service (95 %).
- Réponse centrée erreurs sans reconnaître l'OTIF.
- Copier une analyse SCN-013 (picking, SLA J-90).

---

### Étape KPI_DIAGNOSTIC — Diagnostic opérationnel

**1. Où porter son attention**
- Fiche mission : recommandation au comité finance.
- Synthèse des trois étapes précédentes (rotation, service, capital).
- Attente : **politique stock** actionnable, pas l'inaction.
- Longueur : paragraphe structuré, pas une phrase.

**2. KPI à lire**
- Rotation 6× + capital 48 000 $ — **cœur du diagnostic**.
- OTIF 95 % — argument pour ne pas sur-réagir.
- Erreurs 4 % — mention contextuelle brève.

**3. Concepts attendus**
- Politique stock : maintien, ajustement ciblé, surveillance SKU.
- Réponse à la pression CFO sans panique ni passivité.
- Plan concret : fréquence de revue, périmètre SKU, décision nommée.
- Complaisance = dire « tout va bien » sans recommandation.

**4. Mots-clés qui renforcent la réponse**
- `recommande`, `décision`, `politique`, `maintenir`, `surveillance`, `SKU`, `capital`, `action`, `revue`, `mensuelle`, `trimestrielle`

**5. Mots-clés à éviter**
- `surstock`, `destock global`, `liquidation`, `réduction massive`
- `rien à faire`, `aucune action`, `statu quo sans plan`
- `formation picking`, `SLA`, `J-90` — hors scénario capital

**6. Structure de réponse suggérée**
1. **Constat** — rotation classée + capital immobilisé + service en contexte.
2. **Interprétation** — ce que cela signifie pour le CFO (justifié / à surveiller).
3. **Recommandation** — politique claire (maintien + surveillance ciblée).
4. **Plan** — action mesurable (revue périodique, cartographie SKU lents).

**7. Erreurs fréquentes**
- Diagnostic passif sans politique ni plan.
- Destock global incohérent avec rotation normale et OTIF excellent.
- Texte trop court pour une recommandation finance crédible.
- Reprendre SCN-013 (qualité d'exécution) au lieu du capital.

**8. Pièges de validation**
- Diagnostic contradictoire avec la rotation « normale » déclarée à l'étape précédente.
- Absence de verbe de recommandation (`recommande`, `décision`, `politique`).
- Paragraphe trop court — une recommandation board exige de la substance.

---

### Étape COMPLIANCE_M4 — Conformité Module 4

**1. Où porter son attention**
- Checklist : toutes les interprétations KPI complétées.
- Cohérence entre rotation, service et diagnostic.
- Ordre : diagnostic **avant** conformité.

**2. KPI à lire**
- Vue d'ensemble : rotation, service, erreurs, délai, capital — cohérence globale.

**3. Concepts attendus**
- Porte intégrateur : clôture analytique sans transaction WMS.
- Gouvernance KPI : interprétations documentées avant rapport direction.

**4. Mots-clés qui renforcent la réponse**
- `conformité`, `cohérent`, `interprétations validées`, `diagnostic`

**5. Mots-clés à éviter**
- Nouvelles analyses contradictoires avec les étapes précédentes.
- Vocabulaire ops WMS.

**6. Structure de réponse suggérée**
1. Confirmer que chaque étape KPI est complétée.
2. Affirmer la cohérence diagnostic ↔ interprétations.
3. Valider la clôture du scénario analytique.

**7. Erreurs fréquentes**
- Soumettre la conformité avant le diagnostic.
- Modifier mentalement une interprétation déjà soumise (incohérence).

**8. Pièges de validation**
- Étape diagnostic non validée → conformité bloquée.
- Interprétations contradictoires entre étapes.

---

## SCN-013 — Service, erreurs et renouvellement SLA (J-90)

**Contexte :** Renouvellement contrat SLA dans 90 jours — piège du **tableau vert**.  
**Piège central :** OTIF excellent masque une fragilité d'exécution (erreurs corrigeables).

---

### Étape KPI_DATA — Données KPI

**1. Où porter son attention**
- Fiche mission : horizon **J-90** et enjeu renouvellement SLA.
- Tour de contrôle : OTIF **et** taux d'erreur visibles ensemble.
- Alerte « piège tableau vert » dans l'interface.

**2. KPI à lire**
- OTIF 285/300 — KPI headline du tableau vert.
- Erreurs 12/300 — KPI headline du risque caché.
- Rotation 6× — contexte portefeuille stable.

**3. Concepts attendus**
- Tableau vert = indicateurs headline bons, risque ailleurs.
- Contexte temporel J-90 : durabilité, pas seulement l'instant T.
- Deux KPI à retenir dès le briefing : service **et** erreurs.

**4. Mots-clés qui renforcent la réponse**
- `J-90`, `SLA`, `renouvellement`, `OTIF`, `285/300`, `erreurs`, `tableau vert`, `contexte`

**5. Mots-clés à éviter**
- Ignorer le contexte J-90.
- Ne mentionner que la rotation — mauvais angle pour SCN-013.

**6. Structure de réponse suggérée**
1. Cadrer la revue SLA à 90 jours.
2. Repérer les deux KPI centraux : OTIF et erreurs.
3. Signaler le piège : apparence « tout vert » à analyser.

**7. Erreurs fréquentes**
- Traiter comme SCN-012 (capital / destock).
- Oublier l'horizon 90 jours dans le cadrage initial.

**8. Pièges de validation**
- Briefing sans mention du dual KPI service + erreurs.
- Confondre avec une revue CFO capital.

---

### Étape KPI_ROTATION — Taux de rotation

**1. Où porter son attention**
- Rotation = **contexte seulement** en SCN-013.
- Ne pas bloquer la progression avec un mauvais angle stock.

**2. KPI à lire**
- Rotation 6× — classer normale, puis **passer** au sujet principal (exécution).

**3. Concepts attendus**
- Portefeuille stable : le risque SCN-013 est l'exécution, pas le stock.
- Rotation normale ≠ sujet du renouvellement SLA.

**4. Mots-clés qui renforcent la réponse**
- `normale`, `6×`, `contexte`, `portefeuille stable`, `bande 4–12`

**5. Mots-clés à éviter**
- `surstock`, `destock`, `capital 48 000 $` comme angle principal.
- Long développement rotation — détourne du piège vert.

**6. Structure de réponse suggérée**
1. Calculer / classer la rotation (normale).
2. Indiquer que ce n'est pas le risque prioritaire du scénario.
3. Orienter vers l'analyse service / erreurs à l'étape suivante.

**7. Erreurs fréquentes**
- Analyse rotation longue type SCN-012.
- Classer 6× surstock — bloque la cohérence globale.

**8. Pièges de validation**
- Mot « surstock » à 6×.
- Diagnostic capital prématuré à cette étape.

---

### Étape KPI_SERVICE — Taux de service et erreurs

**1. Où porter son attention**
- **Deux indicateurs obligatoires** : OTIF **et** taux d'erreur.
- Tuile service + tuile erreurs dans le tour de contrôle.
- Corrélation picking / réception → risque OTIF.
- Image utile : dashboard **vert**, exécution **ambre**.

**2. KPI à lire**
- **OTIF (primaire)** : 285/300 → excellent au seuil.
- **Erreurs (primaire)** : 12/300 → 4 % → acceptable mais corrigeable.
- Rotation 6× — contexte, une ligne suffit.

**3. Concepts attendus**
- Analyse **duale** : reconnaître l'excellence OTIF **et** challenger l'exécution.
- Erreurs picking / réception comme causes typiques de dérive OTIF.
- Acceptable ≠ excellent : 4 % n'est pas un signal vert d'exécution.
- Horizon J-90 : fragilité future, pas crise présente.

**4. Mots-clés qui renforcent la réponse**
- `excellent`, `95 %`, `OTIF`, `285/300`, `acceptable`, `4 %`, `erreurs`, `picking`, `prélèvement`, `réception`, `fragilité`, `dérive`, `J-90`, `corrél`

**5. Mots-clés à éviter**
- `faible service`, `insuffisant`, `OTIF critique` — à 95 %, faux.
- `excellent` pour les erreurs à 4 % — mauvaise bande.
- `surstock`, `destock` — hors sujet.
- OTIF seul sans mentionner les 4 % erreurs.

**6. Structure de réponse suggérée**
1. **OTIF** — calcul, classification excellente, reconnaissance explicite.
2. **Erreurs** — calcul, classification acceptable, nuance « corrigeable ».
3. **Corrélation** — picking / réception → risque OTIF à J-90.
4. **Image** — tableau vert masque un risque d'exécution.

**7. Erreurs fréquentes**
- Analyser l'OTIF seul (étape incomplète).
- Nier l'excellence du 95 % (« service faible »).
- Classer 4 % comme excellent ou critique.
- Oublier picking / réception dans la corrélation.

**8. Pièges de validation**
- Réponse service-only — le pipeline attend aussi les erreurs ici.
- Contradiction : excellent OTIF qualifié de problème principal.
- Absence de lien erreurs → processus → OTIF.

---

### Étape KPI_DIAGNOSTIC — Synthèse diagnostic

**1. Où porter son attention**
- Synthèse multi-KPI avec **plan d'exécution chiffré**.
- Enjeu : renouvellement SLA — plan traçable exigé.
- Levier prioritaire : **qualité d'exécution**, pas stock.

**2. KPI à lire**
- OTIF 95 % — à honorer dans la synthèse.
- Erreurs 4 % — risque prioritaire à traiter.
- Rotation 6× — contexte une phrase.

**3. Concepts attendus**
- Plan mesurable : cible % erreurs, horizon 90 j, fréquence suivi.
- Budget formation / qualité vs destock.
- Reconnaître l'excellence actuelle tout en proposant une action.
- Complaisance = « tout va bien » sans plan.

**4. Mots-clés qui renforcent la réponse**
- `recommande`, `formation`, `qualité`, `picking`, `réception`, `checklist`, `cible`, `2 %`, `90 jours`, `hebdomadaire`, `suivi`, `décision`, `budget`

**5. Mots-clés à éviter**
- `destock`, `surstock`, `capital` comme levier principal.
- `rien à faire`, `aucune action`, `statu quo`
- Plan sans chiffres (%, jours, fréquence).
- `faible service` — contredit le 95 %.

**6. Structure de réponse suggérée**
1. **Reconnaissance** — OTIF excellent au seuil.
2. **Risque** — erreurs 4 %, processus picking/réception, horizon J-90.
3. **Recommandation** — programme qualité / formation.
4. **Plan chiffré** — cible %, échéance, rythme de revue.
5. **Décision** — financer qualité plutôt que destock.

**7. Erreurs fréquentes**
- Plan vague sans cible ni horizon.
- Destock comme levier principal — hors sujet SCN-013.
- Diagnostic trop court.
- Contradire l'excellence OTIF reconnue à l'étape service.

**8. Pièges de validation**
- Absence de cible chiffrée (ex. réduction vers ~2 %).
- Absence d'horizon 90 jours ou de fréquence de suivi.
- Recommandation non mesurable — insuffisant pour un renouvellement SLA.

---

### Étape COMPLIANCE_M4 — Conformité Module 4

*(Même logique que SCN-012 — vérifier cohérence globale service/erreurs/diagnostic.)*

**8. Pièges de validation spécifiques SCN-013**
- Diagnostic capital/destock incohérent avec les étapes service.
- Conformité soumise avant diagnostic J-90 complet.

---

## SCN-014 — Arbitrage S&OP multi-KPI (capstone M4)

**Contexte :** Comité S&OP — **une seule** initiative à financer. Conflit CFO / Ventes / Ops.  
**Piège central :** optimisation **mono-KPI** (une lentille au détriment des autres).

---

### Étape KPI_DATA — Données KPI

**1. Où porter son attention**
- Fiche mission : arbitrage budget unique.
- Tour de contrôle : **quatre lentilles** — rotation, service, erreurs, **délai**.
- Intégration des compétences SCN-012 et SCN-013.

**2. KPI à lire**
- Bundle complet : rotation, OTIF, erreurs, délai 3,5 j, capital 48 000 $.

**3. Concepts attendus**
- S&OP = alignement ventes, ops, finance.
- Une initiative financée → trade-offs obligatoires.
- Ne pas traiter comme SCN-012 ou SCN-013 isolément.

**4. Mots-clés qui renforcent la réponse**
- `S&OP`, `arbitrage`, `initiative`, `trade-off`, `CFO`, `ventes`, `ops`, `bundle complet`

**5. Mots-clés à éviter**
- Réponse mono-domaine dès le briefing.
- Oublier le délai 3,5 j dans l'inventaire initial.

**6. Structure de réponse suggérée**
1. Cadrer la réunion S&OP et la contrainte budget unique.
2. Lister les quatre lentilles KPI disponibles.
3. Annoncer l'arbitrage intégré requis.

**7. Erreurs fréquentes**
- Cadrage type SCN-012 seul (capital) ou SCN-013 seul (SLA).
- Omettre le délai fournisseur du panorama initial.

**8. Pièges de validation**
- Briefing sans mention de l'arbitrage multi-parties prenantes.

---

### Étape KPI_ROTATION — Taux de rotation

**1. Où porter son attention**
- Lentille **CFO** : rotation + capital immobilisé.
- Pas de chasse destock globale sans arbitrage S&OP.

**2. KPI à lire**
- Rotation 6× — normale.
- Capital 48 000 $ — pression cash, pas urgence surstock.

**3. Concepts attendus**
- Rotation normale = pas de levier destock global isolé.
- Capital comme **input** à l'arbitrage, pas comme décision finale seule.

**4. Mots-clés qui renforcent la réponse**
- `normale`, `6×`, `capital`, `48 000 $`, `contexte CFO`, `arbitrage`, `pas de destock global`

**5. Mots-clés à éviter**
- `surstock`, `destock global` sans trade-off.
- Analyse rotation longue sans ouverture S&OP.

**6. Structure de réponse suggérée**
1. Classer la rotation (normale) avec formule.
2. Relier au capital immobilisé (contexte CFO).
3. Indiquer que toute action stock devra s'intégrer à l'arbitrage global.

**7. Erreurs fréquentes**
- Recommander destock global type SCN-012 sans synthèse S&OP.
- Classer 6× surstock.

**8. Pièges de validation**
- Décision rotation-only — le capstone exige multi-KPI.

---

### Étape KPI_SERVICE — Taux de service

**1. Où porter son attention**
- Lentille **Ventes** : OTIF au seuil.
- Lentille **Ops** : erreurs 4 % = menace cachée.
- Tension ventes vs ops dans le même paragraphe.

**2. KPI à lire**
- OTIF 95 % — excellent, **à préserver** dans tout trade-off.
- Erreurs 4 % — acceptable, levier qualité naturel.

**3. Concepts attendus**
- Service excellent ≠ exécution sans risque.
- Qualité d'exécution comme initiative candidate S&OP.
- Préserver OTIF dans tout sacrifice nommé.

**4. Mots-clés qui renforcent la réponse**
- `excellent`, `95 %`, `erreurs`, `4 %`, `qualité`, `exécution`, `menace cachée`, `préserver`, `OTIF`

**5. Mots-clés à éviter**
- `faible service` à 95 %.
- Ignorer les erreurs — piège SCN-013 non intégré.
- `destock` comme seule réponse service.

**6. Structure de réponse suggérée**
1. OTIF — excellent, enjeu ventes / client.
2. Erreurs — acceptable, enjeu ops / qualité.
3. Tension : maintenir le service tout en corrigeant l'exécution.

**7. Erreurs fréquentes**
- Service-only sans erreurs.
- Proposer destock pour « améliorer le service » — incohérent à 95 %.

**8. Pièges de validation**
- Analyse mono-lentille ventes ou ops seule.

---

### Étape KPI_DIAGNOSTIC — Synthèse diagnostic S&OP

**1. Où porter son attention**
- Paragraphe type **board** : ≥ 3 domaines KPI (idéal : 4).
- **Délai 3,5 j obligatoire** — souvent oublié.
- Trade-off explicite : ce qui est financé vs reporté.
- Horizon 90 jours + KPI de suivi nommés.

**2. KPI à lire**
- Rotation + capital (CFO).
- OTIF (Ventes).
- Erreurs (Ops).
- **Délai 3,5 j (Supply)** — ne pas omettre.

**3. Concepts attendus**
- Triangle d'arbitrage : cash · service · exécution · supply.
- Une initiative prioritaire avec sacrifice nommé.
- Trade-off explicite (`reporte`, `maintien`, `priorité`, `sacrifice`).
- Synthèse exécutive, pas liste de souhaits.

**4. Mots-clés qui renforcent la réponse**
- `rotation`, `6×`, `service`, `excellent`, `95 %`, `erreurs`, `4 %`, `délai`, `3,5 j`, `lead time`, `qualité`, `trade-off`, `arbitrage`, `reporte`, `maintien`, `priorité`, `90 jours`, `initiative`

**5. Mots-clés à éviter**
- `surstock` à 6×.
- Diagnostic mono-KPI (rotation seule, service seul…).
- Omission du délai.
- Paragraphe trop court pour un comité S&OP.
- Liste d'actions sans **une** initiative clairement financée.

**6. Structure de réponse suggérée**
1. **Contexte S&OP** — contrainte budget unique.
2. **Panorama KPI** — ≥ 3 domaines (rotation, service, erreurs, délai).
3. **Initiative prioritaire** — ex. programme qualité d'exécution.
4. **Trade-off explicite** — ex. destock reporté pour préserver service et capital.
5. **Horizon** — 90 jours, KPI de suivi nommés.

**7. Erreurs fréquentes**
- Oublier le délai 3,5 j.
- Trade-off implicite seulement.
- Reprendre SCN-012 ou SCN-013 sans intégration.
- Paragraphe trop court (< ~150 caractères insuffisant pour un board).

**8. Pièges de validation**
- Diagnostic mono-domaine.
- Absence de mot d'arbitrage / trade-off.
- Délai absent de la synthèse finale.
- Vocabulaire crise surstock à rotation normale.

---

### Étape COMPLIANCE_M4 — Conformité Module 4

**8. Pièges de validation spécifiques SCN-014**
- Conformité avant diagnostic S&OP complet.
- Incohérence entre lentilles (ex. surstock à rotation normale dans une étape antérieure).

---

# MODULE 5 — Peak Week (simulation intégrée)

> **Paradigme :** vous **exécutez** un cycle entrepôt, puis **dérivez** vos KPI du moniteur. Ne recopiez pas les chiffres portefeuille Module 4.

**Chaîne ops :** Réception → Rangement → Comptage → [Ajustement SCN-016] → Réappro → KPI → Décision → Conformité

---

## SCN-015 — Cycle opérationnel nominal (Peak Week Jour 1)

**Contexte :** Cycle complet sans anomalie — prouver que les KPI viennent de l'exécution.  
**Niveau décision :** **tactique** (post-cycle immédiat).

---

### Étape M5_RECEPTION — Réception (MIGO)

**1. Où porter son attention**
- Fiche mission : contrat SKU, quantité, bon de commande.
- Stock initial **vide** — normal ; première preuve après réception.
- Moniteur : première transaction GR du cycle.

**2. KPI à lire**
- Aucun KPI final ici — poser la **première preuve** de la chaîne causale ops → KPI.

**3. Concepts attendus**
- GR (Goods Receipt) = point de départ du cycle Peak Week.
- Exactitude SKU / quantité / PO — toute erreur propage la chaîne.
- Transaction MIGO en contexte SAP/WMS.

**4. Mots-clés qui renforcent la réponse**
- Référencer exactement les valeurs de la **fiche mission** (SKU, PO, quantité).
- `réception`, `GR`, `première transaction`, `contrat`

**5. Mots-clés à éviter**
- Valeurs inventées non alignées sur la fiche mission.
- Confondre avec saisie KPI portefeuille M4.

**6. Structure de réponse suggérée**
- Saisie structurée : SKU · quantité · référence document PO — conformes au contrat mission.

**7. Erreurs fréquentes**
- Mauvais SKU, quantité ou PO — rejet dur en amont.
- Sauter la réception et tenter le rangement.

**8. Pièges de validation**
- Quantité ou référence PO incorrecte → cascade d'erreurs sur tout le run.
- Tentative d'utiliser des valeurs Annexe A (400 u.) au lieu du contrat ops.

---

### Étape M5_PUTAWAY — Rangement (LT01)

**1. Où porter son attention**
- Flux REC-01 (quai réception) → B-01-R1-L1 (stockage).
- Numéro de lot LOT-M5-A — traçabilité FIFO.
- Moniteur : transaction PUTAWAY après GR validé.

**2. KPI à lire**
- Aucun KPI final — vérifier cohérence bin et lot pour le comptage suivant.

**3. Concepts attendus**
- Putaway = transfert réception → emplacement définitif.
- FIFO / traçabilité lot.
- Dépendance : réception validée requise.

**4. Mots-clés qui renforcent la réponse**
- `REC-01`, `B-01-R1-L1`, `LOT-M5-A`, `FIFO`, `rangement`, `traçabilité`

**5. Mots-clés à éviter**
- Bin destination hors contrat mission.
- Omettre le numéro de lot.

**6. Structure de réponse suggérée**
- Bin source → bin destination · lot · quantité alignée sur la réception.

**7. Erreurs fréquentes**
- Bin incorrect ou inversion source/destination.
- Quantité différente de la réception.
- Oublier le lot.

**8. Pièges de validation**
- Putaway sans réception préalable — progression bloquée.
- Bin incohérent avec le comptage cyclique suivant.

---

### Étape M5_CYCLE_COUNT — Comptage cyclique (MI04)

**1. Où porter son attention**
- Comparer stock **système** vs stock **physique** au bin B-01-R1-L1.
- SCN-015 nominal : attendre cohérence **sans écart**.
- Moniteur : transaction CC après putaway.

**2. KPI à lire**
- **Variance (delta)** = physique − système — doit être **0** en nominal.

**3. Concepts attendus**
- Cycle count = contrôle de cohérence ops.
- Variance 0 confirme réception + rangement corrects.
- MI04 saisie comptage ; pas encore MI07 (SCN-016).

**4. Mots-clés qui renforcent la réponse**
- `système`, `physique`, `variance`, `0`, `cohérence`, `MI04`, `comptage cyclique`

**5. Mots-clés à éviter**
- Inventer un écart en SCN-015 nominal.
- Quantités incohérentes avec les étapes précédentes.

**6. Structure de réponse suggérée**
1. Citer stock système et stock physique compté.
2. Calculer la variance.
3. Confirmer cohérence nominale (variance nulle).

**7. Erreurs fréquentes**
- Quantités ne correspondant pas à la réception/rangement.
- Anticiper un écart SCN-016 — ici le chemin est nominal.

**8. Pièges de validation**
- Variance non nulle sans justification — déclenche logique SCN-016.
- Sauter le comptage — snapshot KPI faussé ou bloqué.

---

### Étape M5_REPLENISH — Réapprovisionnement

**1. Où porter son attention**
- Stock actuel vs **minimum** (10) et **maximum** (100).
- Formule conceptuelle : Q = Max − stock actuel (si stock < min, commander).
- Piège pédagogique : stock suffisant → **pas de commande**.

**2. KPI à lire**
- Stock actuel post-comptage (cohérent avec variance 0).
- Seuils min / max / stock de sécurité de la fiche mission.

**3. Concepts attendus**
- MRP / réapprovisionnement : commander seulement si nécessaire.
- Stock ≥ min → Q = 0 (pas de réappro).
- Ordre des étapes : réappro **après** comptage.

**4. Mots-clés qui renforcent la réponse**
- `Q = 0`, `stock suffisant`, `minimum`, `pas de commande`, `réapprovisionnement`

**5. Mots-clés à éviter**
- Commander la quantité reçue (ex. Q = 50) par réflexe — piège courant.
- Calcul sur stock pré-comptage.

**6. Structure de réponse suggérée**
1. Citer stock actuel et seuil minimum.
2. Comparer : stock ≥ min ?
3. Conclure : Q = 0 avec justification.

**7. Erreurs fréquentes**
- Q = 50 ou Q = max sans analyse — incohérent si stock > min.
- Utiliser stock incorrect (pré-ops).

**8. Pièges de validation**
- Q ≠ 0 alors que stock couvre le minimum — incohérence logique ops.
- Réappro avant comptage — ordre incorrect.

---

### Étape M5_KPI — Snapshot KPI

**1. Où porter son attention**
- Moniteur / ledger **après** toutes les ops — pas le tour de contrôle contexte M4.
- Bloc d'ancrage ledger + **case de confirmation** depuis moniteur.
- Échelle SKU : stock ~50 u., pas 400 u. portefeuille.

**2. KPI à lire**
- Consommation, stock moyen → **rotation**.
- Commandes honorées / total → **OTIF**.
- Erreurs / opérations → **taux d'erreur**.
- Délai moyen, **valeur stock** — à votre échelle de run.

**3. Concepts attendus**
- KPI **dérivés** de vos transactions, pas copiés d'Annexe A.
- Preuve ops → analytics : la chaîne causale du cycle.
- Classer avec les mêmes bandes M4 (6× normal, 95 % excellent, 4 % acceptable).

**4. Mots-clés qui renforcent la réponse**
- `moniteur`, `ledger`, `dérivé`, `snapshot`, `cycle`, chiffres **de votre run**
- `rotation`, `6×`, `95 %`, `4 %`, `3,5 j`

**5. Mots-clés à éviter**
- `400`, `48 000 $` — valeurs portefeuille M4, pas votre ledger SKU.
- KPI sans confirmation ancrage moniteur.
- Chiffres théoriques non lus dans l'interface.

**6. Structure de réponse suggérée**
1. Lire chaque champ depuis le moniteur / panel ledger.
2. Saisir consommation, stock, OTIF, erreurs, délai, valeur stock.
3. Cocher la confirmation d'ancrage.
4. Classer brièvement rotation / service / erreurs dans les bandes.

**7. Erreurs fréquentes**
- Coller Annexe A (400 u., 48 000 $).
- Oublier la checkbox de confirmation ledger.
- Saisir avant d'avoir complété toutes les ops.
- Confondre cibles d'affichage (contexte) et valeurs à soumettre.

**8. Pièges de validation**
- Valeurs portefeuille M4 dans champs M5 — rejet.
- Snapshot sans ops complètes — chiffres incohérents.
- Omission de la confirmation moniteur.

---

### Étape M5_DECISION — Décision tactique

**1. Où porter son attention**
- Guide décision **tactique** (pas stratégique board).
- KPI de **votre** snapshot M5_KPI.
- Actions ops immédiates : réappro, formation, procédures.

**2. KPI à lire**
- Rotation, service, erreurs du snapshot — classer avec bandes M4.
- Stock actuel — confirmer Q = 0 si pas de réappro.

**3. Concepts attendus**
- Niveau tactique : que faire **maintenant** post-cycle ?
- Lien KPI observés → action opérationnelle concrète.
- Erreurs 4 % → formation / procédures (pas destock global).
- Pas d'essai stratégique long — réservé à SCN-017.

**4. Mots-clés qui renforcent la réponse**
- `rotation`, `service`, `erreur`, `stock`, `réapprovisionnement`, `formation`, `procédure`, `améliorer`, `recommande`

**5. Mots-clés à éviter**
- Structure board longue (`situation · preuve · arbitrage · horizon 180 j`) — trop pour J1.
- `48 000 $`, stock portefeuille 400 u.
- `destock global`, `surstock` à 6×.
- Actions ops pures (« poster la réception ») — déjà faites ; ici c'est l'analyse post-cycle.

**6. Structure de réponse suggérée**
1. Synthèse KPI snapshot (rotation, service, erreurs — bandes).
2. Constat ops : réappro nécessaire ou non (Q = 0).
3. Action tactique : ex. formation picking / revue procédure réception.

**7. Erreurs fréquentes**
- Décision stratégique type SCN-017 — surinvestissement prose.
- Texte générique sans KPI du snapshot.
- Recommander réappro alors que stock > min.
- Copier logique capital M4.

**8. Pièges de validation**
- Décision avant M5_KPI validé.
- Réponse trop vague sans lien KPI → action.
- Niveau stratégique soumis en SCN-015 — attente tactique.

---

### Étape COMPLIANCE_M5 — Conformité Module 5

**1. Où porter son attention**
- Checklist 7 étapes complètes (pas de M5_ADJ en SCN-015).
- Snapshot KPI enregistré.
- Décision tactique soumise.

**2. KPI à lire**
- Cohérence globale ops → KPI → décision.

**3. Concepts attendus**
- Certification cycle intégré nominal complet.
- Preuve de maîtrise chaîne WMS/ERP.

**4. Mots-clés qui renforcent la réponse**
- `conformité`, `cycle complet`, `7 étapes`, `snapshot validé`

**5. Mots-clés à éviter**
- Clôturer avec étapes manquantes.

**6. Structure de réponse suggérée**
- Valider que toutes les étapes ops, KPI et décision sont complétées.

**7. Erreurs fréquentes**
- Conformité avant décision ou KPI.
- Étape ops sautée.

**8. Pièges de validation**
- COMPLIANCE_M5 sans M5_KPI ou M5_DECISION validés.
- Run incomplet — certification impossible.

---

## SCN-016 — Écart inventaire et correction (Peak Week Jour 2)

**Contexte :** Variance −5 au comptage — **corriger avant de piloter**.  
**Règle d'or :** Réconcilier d'abord, décider ensuite. **8 étapes** (avec M5_ADJ).

---

### Étape M5_RECEPTION — Réception (MIGO)

*(Identique SCN-015 — contrat mission, première preuve GR.)*

**8. Pièges de validation spécifiques SCN-016**
- Erreur amont amplifiée par l'écart injecté au comptage — exactitude d'autant plus critique.

---

### Étape M5_PUTAWAY — Rangement (LT01)

*(Identique SCN-015 — REC-01 → B-01-R1-L1 · LOT-M5-A.)*

---

### Étape M5_CYCLE_COUNT — Comptage cyclique (MI04)

**1. Où porter son attention**
- **Écart injecté** : système ≠ physique au bin B-01-R1-L1.
- Signal OIL / alerte variance — KPI bloqué tant qu'écart ouvert.
- Moment diagnostic de l'exception.

**2. KPI à lire**
- **Delta (variance)** signé : physique − système.
- Repérer l'écart **−5** (pas +5).

**3. Concepts attendus**
- Variance non nulle = exception à traiter avant suite du flux.
- MI04 détecte ; MI07 corrige (étape suivante).
- Écart observable **uniquement** au comptage, pas avant.

**4. Mots-clés qui renforcent la réponse**
- `variance`, `écart`, `système`, `physique`, `−5`, `MI04`, `investigation`

**5. Mots-clés à éviter**
- `variance 0` — incohérent SCN-016.
- `+5` (mauvais signe).
- Passer à réappro sans traiter l'écart.

**6. Structure de réponse suggérée**
1. Citer stock système et physique compté.
2. Calculer et signer la variance.
3. Conclure : ajustement MI07 requis avant KPI.

**7. Erreurs fréquentes**
- Ignorer l'écart injecté (saisir 50 = 50).
- Mauvais signe sur la variance.
- Anticiper l'écart avant la réception — il n'apparaît qu'au comptage.

**8. Pièges de validation**
- Variance 0 soumise — bypass de la pédagogie J2.
- Progression vers réappro/KPI sans ADJ — bloqué par simulateur.

---

### Étape M5_ADJ — Ajustement MI07

**1. Où porter son attention**
- Corriger l'écart **avant** réappro, KPI et décision.
- Champ **justification** — expliquer la réconciliation métier.
- Stock post-correction = base fiable pour la suite.

**2. KPI à lire**
- Variance −5 à corriger.
- Stock corrigé (physique) — nouvelle base pour réappro et snapshot.

**3. Concepts attendus**
- Règle « corriger avant de piloter ».
- MI07 = validation traçable de l'écart inventaire.
- Justification ≥ longueur minimale — expliquer le constat comptage.

**4. Mots-clés qui renforcent la réponse**
- `MI07`, `ajustement`, `−5`, `réconciliation`, `justification`, `écart`, `MI04`, `stock corrigé`

**5. Mots-clés à éviter**
- `+5` (mauvais signe d'ajustement).
- Justification trop courte / vide.
- Sauter l'ADJ et tenter KPI.

**6. Structure de réponse suggérée**
1. Référencer l'écart détecté au MI04.
2. Poster l'ajustement avec le bon signe.
3. Justifier : constat physique vs système, réconciliation avant pilotage.

**7. Erreurs fréquentes**
- Signe d'ajustement inversé.
- Justification < longueur minimale UI.
- ADJ sans lien avec le comptage précédent.

**8. Pièges de validation**
- KPI ou réappro avant ADJ — progression bloquée.
- Ajustement sans justification — rejet UI.
- Stock post-ADJ incohérent avec l'écart déclaré.

---

### Étape M5_REPLENISH — Réapprovisionnement

**1. Où porter son attention**
- Stock **post-correction** (45 u.), pas pré-écart (50 u.).
- Comparer au minimum 10 → toujours Q = 0 ici.

**2. KPI à lire**
- Stock actuel post-ADJ vs min/max.

**3. Concepts attendus**
- Réappro sur stock **réconcilié**, pas sur stock système erroné.
- Q = 0 si stock ≥ min — même logique SCN-015, base différente.

**4. Mots-clés qui renforcent la réponse**
- `post-correction`, `45`, `Q = 0`, `stock suffisant`, `minimum`

**5. Mots-clés à éviter**
- `50` (stock pré-ADJ) pour le calcul réappro.
- Q = 50 par réflexe.

**6. Structure de réponse suggérée**
1. Citer stock post-ADJ.
2. Comparer au minimum.
3. Q = 0 avec justification.

**7. Erreurs fréquentes**
- Utiliser stock 50 au lieu de 45 post-correction.
- Commander malgré stock > min.

**8. Pièges de validation**
- Réappro sur stock pré-écart — incohérence logique.
- Q ≠ 0 sans justification — rejet.

---

### Étape M5_KPI — Snapshot KPI

**1. Où porter son attention**
- Snapshot **post-ADJ** — ledger corrigé.
- Stock moyen, consommation, valeur stock recalculés après correction.
- Même discipline : moniteur, pas Annexe A.

**2. KPI à lire**
- Tous les champs ledger — valeurs **après** correction (−5).
- Consommation et stock moyen reflètent le stock corrigé.

**3. Concepts attendus**
- KPI sur stock réconcilié = fiabilité inventaire.
- Bandes rotation/service/erreurs stables — l'enjeu J2 est la **qualité des données**.

**4. Mots-clés qui renforcent la réponse**
- `post-ADJ`, `ledger corrigé`, `snapshot`, `réconcilié`, chiffres du **moniteur**

**5. Mots-clés à éviter**
- Valeurs pré-correction (stock 50).
- Annexe A portefeuille (400 / 48 000 $).

**6. Structure de réponse suggérée**
1. Confirmer ops + ADJ complétés.
2. Lire ledger post-correction dans le moniteur.
3. Saisir et confirmer ancrage snapshot.

**7. Erreurs fréquentes**
- KPI avant ADJ — bloqué ou chiffres faux.
- Coller valeurs SCN-015 nominal (50 u.) au lieu post-correction.

**8. Pièges de validation**
- Snapshot pré-ADJ — incohérence avec le ledger.
- Omission confirmation moniteur.

---

### Étape M5_DECISION — Décision tactique

**1. Où porter son attention**
- Mentionner la **résolution de l'écart** dans la décision.
- KPI du snapshot **corrigé**.
- Action : fiabilité inventaire + maintien service.

**2. KPI à lire**
- Rotation, service, erreurs — bandes (stable).
- Stock réconcilié — preuve ops.

**3. Concepts attendus**
- Décision tactique post-exception.
- Priorité fiabilité inventaire : procédures comptage, double-vérification.
- Pas de réappro si Q = 0.

**4. Mots-clés qui renforcent la réponse**
- `variance`, `écart`, `correction`, `MI07`, `ADJ`, `réconcili`, `fiabilité inventaire`, `comptage`, `formation`, `service`

**5. Mots-clés à éviter**
- Ignorer l'exception traitée.
- Décision identique SCN-015 sans mention ADJ.
- Niveau stratégique board SCN-017.

**6. Structure de réponse suggérée**
1. Confirmer écart résolu par ajustement MI07.
2. Synthèse KPI snapshot corrigé (bandes).
3. Pas de réappro (Q = 0).
4. Action : revue procédure comptage / formation pour éviter récurrence.

**7. Erreurs fréquentes**
- Décision sans mention de la correction inventaire.
- Copier SCN-015 mot pour mot.
- Oublier l'angle fiabilité inventaire.

**8. Pièges de validation**
- Décision avant ADJ ou KPI post-correction.
- Texte sans lien avec l'exception J2 traitée.

---

### Étape COMPLIANCE_M5 — Conformité Module 5

**8. Pièges de validation spécifiques SCN-016**
- 8 étapes requises (avec M5_ADJ) — pas 7.
- Conformité avec écart ouvert — impossible.
- Snapshot ou décision pré-correction.

---

## SCN-017 — Décision stratégique capstone (Peak Week Jour 3)

**Contexte :** Cycle ops nominal (7 étapes) + **décision stratégique** niveau direction.  
**Niveau décision :** **stratégique** — preuves snapshot, arbitrage, horizon 90–180 j.

---

### Étape M5_RECEPTION — Réception (MIGO)

*(Identique SCN-015 — cycle nominal pour alimenter le ledger capstone.)*

---

### Étape M5_PUTAWAY — Rangement (LT01)

*(Identique SCN-015.)*

---

### Étape M5_CYCLE_COUNT — Comptage cyclique (MI04)

*(Identique SCN-015 — variance 0, chemin nominal.)*

---

### Étape M5_REPLENISH — Réapprovisionnement

*(Identique SCN-015 — Q = 0, stock ≥ min.)*

---

### Étape M5_KPI — Snapshot KPI

**1. Où porter son attention**
- Snapshot **verrouillé** — panel avec valeurs dérivées de votre run.
- Ces chiffres seront les **preuves** de M5_DECISION.
- Citer ≥ 2 KPI chiffrés dans la décision suivante.

**2. KPI à lire**
- Rotation, OTIF, erreurs, délai, valeur stock — **votre échelle SKU**.
- Classer avec bandes M4.

**3. Concepts attendus**
- Snapshot = base probatoire de la décision board.
- Ne pas utiliser portefeuille 48 000 $ / 400 u.
- Verrouillage : lire le panel, pas deviner.

**4. Mots-clés qui renforcent la réponse**
- `snapshot`, `panneau`, `ledger`, `preuve`, `6×`, `95 %`, `4 %`, `3,5 j`, valeur stock **du run**

**5. Mots-clés à éviter**
- `48 000 $`, `400` — portefeuille M4.
- KPI non présents dans votre panel.

**6. Structure de réponse suggérée**
1. Compléter ops nominal.
2. Lire et saisir tous les champs depuis le moniteur.
3. Confirmer ancrage — snapshot prêt pour la décision stratégique.

**7. Erreurs fréquentes**
- Coller Annexe A.
- Décision avant KPI — API bloquée.

**8. Pièges de validation**
- Snapshot non enregistré → M5_DECISION bloquée.
- Valeurs incohérentes avec ops nominal.

---

### Étape M5_DECISION — Décision stratégique

**1. Où porter son attention**
- Guide **stratégique** SCN-017 (≠ tactique SCN-015).
- Structure board : Situation · Preuve · Arbitrage · Recommandation · Horizon.
- OIL Panel B : ≥ 2 KPI chiffrés, trade-off, horizon 90–180 j.
- Trois orientations valides — **en choisir une** et l'argumenter :
  - **A1** Qualité d'exécution (formation, erreurs → cible basse, garde-fou service)
  - **A2** Working capital (stock cible, arbitrage cash vs service)
  - **A3** Résilience capacité (délai serré, investissement capacité préparation)

**2. KPI à lire**
- **≥ 2 KPI chiffrés** du snapshot M5_KPI (rotation, service, erreurs, délai, valeur stock).
- Classer chaque KPI cité dans sa bande.

**3. Concepts attendus**
- Niveau direction : politique, investissement, organisation — pas transaction ops.
- Arbitrage explicite entre dimensions (qualité vs capital vs service vs capacité).
- Horizon mesurable 90–180 j + KPI de suivi.
- Preuves chiffrées obligatoires — texte générique rejeté.

**4. Mots-clés qui renforcent la réponse**
- `situation`, `preuve`, `arbitrage`, `trade-off`, `compromis`, `recommandation`, `décision`, `plan`, `initiative`, `politique`
- `90 jours`, `180 jours`, `3 mois`, `6 mois`, `trimestre`, `horizon`
- KPI chiffrés du snapshot : `6×`, `95 %`, `4 %`, `3,5 j`, valeur stock du run
- Selon orientation : `formation`, `working capital`, `capacité`, `résilience`, `lead time`

**5. Mots-clés à éviter**
- « Poster la réception », « continuer le rangement » — niveau ops, rejet STRATEGIC.
- « Améliorer la performance globale » sans chiffres — trop vague.
- `48 000 $`, stock 400 u. — portefeuille M4, pas votre snapshot.
- Décision tactique courte type SCN-015 — insuffisant capstone.
- Arbitrage implicite seulement — formuler la tension explicitement.

**6. Structure de réponse suggérée**
1. **Situation** — Cycle ops complété ; performance globale post-Peak Week.
2. **Preuve** — Citer **≥ 2 KPI chiffrés** du snapshot (avec bandes).
3. **Arbitrage** — Tension explicite entre options (ex. qualité vs capital vs service).
4. **Recommandation** — Initiative claire + objectifs mesurables.
5. **Horizon** — Plan 90 à 180 jours + KPI de suivi nommés.

**7. Erreurs fréquentes**
- Réponse tactique courte (< ~150 caractères insuffisant pour un board).
- Une seule preuve KPI — il en faut au moins deux.
- Texte générique sans chiffres du snapshot.
- Copier SCN-015 ou SCN-014 sans adapter au niveau M5 stratégique.
- Recommandation sans horizon temporel.
- Orientation choisie sans arbitrage (pas de sacrifice nommé).

**8. Pièges de validation**
- M5_DECISION avant M5_KPI validé.
- Messages de feedback rejet — lire et compléter séquentiellement.
- KPI cités absents du panel snapshot.
- Conformité avant décision acceptée.
- Réponse purement opérationnelle — niveau insuffisant pour capstone J3.

---

### Étape COMPLIANCE_M5 — Conformité Module 5

**1. Où porter son attention**
- 7 étapes ops + snapshot + **décision stratégique acceptée**.

**8. Pièges de validation spécifiques SCN-017**
- Conformité avant décision stratégique validée — COMPLIANCE_M5_FAILED.
- Décision tactique soumise — niveau insuffisant, conformité bloquée.

---

## Synthèse — Progression et niveaux de rédaction

```text
MODULE 4 — Interpréter (moniteur vide = normal)
  SCN-012  Rotation + capital        → politique stock, pas destock global
  SCN-013  OTIF + erreurs J-90       → piège tableau vert, plan chiffré
  SCN-014  S&OP capstone             → arbitrage multi-KPI, délai obligatoire

MODULE 5 — Exécuter puis décider (KPI = votre ledger)
  SCN-015  Cycle nominal             → ops → KPI → décision tactique
  SCN-016  Variance + ADJ            → corriger avant piloter → tactique
  SCN-017  Capstone stratégique      → preuves snapshot + arbitrage board
```

| Transition | Ce qui change dans votre rédaction |
|------------|-----------------------------------|
| M3 → M4 | Transactions → interprétation KPI ; pas de vocabulaire MIGO/LT01 |
| M4 → M5 | Portefeuille Annexe A → chiffres ledger de **votre** run |
| SCN-015 → SCN-017 | Décision tactique courte → décision stratégique structurée avec preuves |
| SCN-012 → SCN-014 | Compétence isolée → synthèse intégrée avec trade-off explicite |

---

## Question reflexive avant chaque soumission

*« Qu'est-ce que ce chiffre me dit ? Quelle action professionnelle cohérente en découle — et ai-je nommé les compromis, les preuves et l'horizon attendus pour **cette** étape ? »*

---

*TEC.LOG — Guide de rédaction étudiant M4/M5 · juin 2026 · Guidance pédagogique uniquement — aucune réponse canonique ni logique interne de validation exposée.*
