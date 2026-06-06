# FICHE DE MISSION OPÉRATIONNELLE — SCN-006



**Référence:** CL-SCN-006  

**Code scénario:** SCN-006  

**Module:** M2 — Exécution d'entrepôt  

**Seuil évaluation:** 60/100  

**Difficulté:** facile  

**Statut:** ACTIF



*Concorde Logistics — Institutional Standard · QMS v2.0*



---



## Contexte opérationnel



150 unités de **SKU-001** sont reçues et **postées** au quai **REC-01**. La marchandise est prête pour le rangement définitif. Vous devez affecter un emplacement en zone **STOCKAGE** conformément aux règles **LT01** et aux contraintes de capacité affichées dans le cockpit.



*Accès Mission Control recommandé pour la couche d'intelligence putaway (encart M2).*



## Objectif de la mission



Exécuter un rangement structuré depuis le quai vers un emplacement STOCKAGE conforme aux règles de capacité et de zone.



## Rôles



| Type | Libellé |

|------|---------|

| **Rôle de mission** (poste simulé) | Spécialiste Rangement (Putaway Specialist) |

| **Compétence évaluée** (rôle entrepôt) | Spécialiste rangement |

| **Compétence primaire** | Rangement structuré |

| **Niveau Bloom** | Appliquer |

| **Progression** | Intermédiaire M2 |



## Spécifications techniques



| SKU | Quantité | Emplacement source | Emplacement cible |

|-----|----------|-------------------|-------------------|

| SKU-001 | 150 | REC-01 (GR postée) | Bin zone STOCKAGE (LT01) |



## Actions à réaliser (étudiant)



1. **GR** — Valider que la réception est postée et que le stock est visible au quai REC-01.

2. **PUTAWAY** — Ranger REC-01 → bin STOCKAGE valide selon règles LT01 (Mission Control si besoin).

3. **FIFO_PICK** — Exécuter le prélèvement FIFO si le scénario l'exige.

4. **STOCK_ACCURACY** — Valider la précision stock après rangement.

5. **COMPLIANCE_ADV** — Clôturer avec conformité avancée M2.



## Preuves attendues



Voir `student-expected-evidence.md`.



## Critères de réussite



Voir `success-criteria.md`.



## Conditions d'échec



Voir `failure-conditions.md`.



## Équivalents ERP/WMS



Voir `erp-wms-mapping.md`.



## Lien certification



Voir `certification-mapping.md`.



## Points de contrôle



1. Confirmer GR postée avant tout putaway.

2. Vérifier que le bin destination est en zone STOCKAGE.

3. Répondre à toute alerte capacité sur le bin choisi (150 u.).

4. Poursuivre le pipeline M2 jusqu'à COMPLIANCE_ADV.



## Résultat attendu



Marchandise rangée en STOCKAGE, stock précis, conformité M2 validée.



---



**NOTE INSTITUTIONNELLE — DOUBLE RÔLE**  

Le « Rôle de mission » décrit votre poste dans la simulation.  

La « Compétence évaluée » décrit ce que TEC.LOG mesure pour votre certification.  

Ces deux libellés peuvent différer sans contradiction.



*Référence : `docs/phase-b3/01-dual-role-standard.md` § 5*


