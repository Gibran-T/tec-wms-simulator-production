# TEC.WMS — Simulateur Pédagogique ERP/WMS
### Collège de la Concorde — Montréal | Programme 1 — TEC.LOG

> **Gestion intégrée des stocks et performance logistique**  
> Simulateur interactif conçu pour l'enseignement des systèmes WMS (Warehouse Management System) et ERP (Enterprise Resource Planning) dans un contexte académique professionnel.

---

## Aperçu du projet

TEC.WMS est une application web pédagogique complète développée pour le **Collège de la Concorde à Montréal**, dans le cadre du programme **TEC.LOG — Gestion intégrée des stocks et performance logistique**. Elle permet aux étudiants de simuler l'ensemble des opérations d'un entrepôt réel — de la réception des marchandises à l'expédition, en passant par le rangement, le picking, l'inventaire cyclique et l'analyse des KPI — dans un environnement sécurisé et évaluatif.

Le simulateur reproduit fidèlement les flux opérationnels des grands systèmes ERP du marché (SAP, Microsoft Dynamics 365, Odoo), en insistant sur le fait que **la logique métier est identique** d'un système à l'autre — seuls les noms d'interface et les terminologies varient. Cette approche prépare les étudiants à s'adapter rapidement à n'importe quel environnement ERP professionnel.

---

## Fonctionnalités principales

### Côté étudiant

The student experience is structured around a progressive, module-locked curriculum. Each module requires passing a knowledge quiz before unlocking the practical scenarios, ensuring students have the theoretical foundation before attempting hands-on simulation.

| Fonctionnalité | Description |
|---|---|
| **5 modules progressifs** | M1 à M5, chacun avec quiz de déverrouillage et 3 à 5 scénarios |
| **17 scénarios d'évaluation** | Flux WMS complets avec scoring automatisé et feedback pédagogique |
| **Mode Évaluation** | Score officiel enregistré, conformité WMS calculée, rapport détaillé généré |
| **Mode Démonstration** | Exploration libre sans impact sur les statistiques officielles |
| **Diapositives intégrées** | 16 slides par module, accessibles directement depuis l'interface |
| **Rapport de scénario** | Score détaillé par étape, erreurs commises, leçons pédagogiques, recommandations |
| **Bascule FR / EN** | Interface disponible en français et en anglais |
| **Mode sombre / clair** | Thème adaptatif pour le confort visuel |
| **Liens Odoo Lab** | Accès direct aux exercices pratiques Odoo correspondant à chaque module |

### Côté enseignant

The teacher dashboard provides real-time visibility into every student's progress across all modules and scenarios, with granular step-by-step tracking and automated pedagogical analytics.

| Fonctionnalité | Description |
|---|---|
| **Tableau de bord enseignant** | Vue globale : scénarios, cohortes, devoirs, simulations actives |
| **Tableau de surveillance** | Suivi en temps réel de toutes les sessions (progression, score, conformité, étapes) |
| **Analytics pédagogiques** | KPI globaux, classement, distribution des scores, heatmap des étapes, erreurs fréquentes |
| **Gestion des cohortes** | Création et gestion des groupes d'étudiants par session |
| **Système d'assignments** | Assignation de scénarios spécifiques à des cohortes |
| **Réinitialisation de sessions** | L'enseignant peut réinitialiser la session d'un étudiant en un clic |
| **Export CSV** | Export des données de surveillance pour analyse externe |
| **Mode démonstration en classe** | Lancement direct du simulateur pour les démonstrations en présentiel |

---

## Architecture technique

The application is built on a modern full-stack TypeScript architecture, with end-to-end type safety enforced through tRPC, a React 19 frontend, and an Express 4 backend connected to a MySQL/TiDB database via Drizzle ORM.

```
client/                     ← React 19 + Tailwind CSS 4 + shadcn/ui
  src/
    pages/
      student/              ← Parcours étudiant (scénarios, quiz, slides, rapports)
      teacher/              ← Tableaux de bord enseignant (monitoring, analytics, cohortes)
    components/             ← Composants réutilisables (DashboardLayout, charts, etc.)
    contexts/               ← Auth context, language context
    hooks/                  ← Custom hooks (useAuth, useLanguage)

server/
  routers.ts                ← Procédures tRPC (auth, transactions M1–M5, quiz, analytics)
  db.ts                     ← Helpers de requêtes Drizzle
  _core/                    ← OAuth Manus, LLM, context, env

drizzle/
  schema.ts                 ← Schéma de base de données (users, scenarios, runs, transactions)
```

**Stack technologique :**

| Couche | Technologie |
|---|---|
| Frontend | React 19, Tailwind CSS 4, shadcn/ui, Recharts |
| Backend | Node.js, Express 4, tRPC 11 |
| Base de données | MySQL / TiDB via Drizzle ORM |
| Authentification | Manus OAuth (session cookie JWT) |
| Typage | TypeScript (end-to-end via tRPC + Zod) |
| Tests | Vitest (218 tests — 100% passing) |
| Déploiement | Manus Cloud (tecwmssim-nahgw8xk.manus.space) |

---

## Curriculum pédagogique

### Module 1 — Fondements de la chaîne logistique et intégration ERP/WMS
**Durée :** 4 heures | **Flux :** PO → GR → PUTAWAY → STOCK → SO → PICKING → GI → CC → COMPLIANCE

Ce module introduit les concepts fondamentaux du WMS et de l'ERP à travers le flux logistique complet d'un entrepôt. Les étudiants apprennent à créer une commande d'achat (PO — Purchase Order), confirmer la réception physique des marchandises (GR — Goods Receipt), ranger les articles dans les emplacements de stockage (PUTAWAY), créer une commande de vente (SO — Sales Order), préparer les articles (PICKING), expédier (GI — Goods Issue), réaliser un inventaire cyclique (CC — Cycle Count) et valider la conformité globale du cycle.

**Scénarios :** Cycle propre | Réception fantôme (GR non postée) | Stock insuffisant | Écart d'inventaire | Non-conformités multiples

### Module 2 — Exécution d'entrepôt et gestion des emplacements
**Durée :** 8 heures | **Prérequis :** M1 ≥ 60/100 | **Flux :** GR → PUTAWAY → FIFO_PICK → STOCK_ACCURACY → COMPLIANCE_ADV

Ce module approfondit la gestion physique de l'entrepôt : stratégies de rangement structuré, validation des capacités d'emplacement, et application rigoureuse de la méthode FIFO (First In, First Out — Premier entré, premier sorti) dans un contexte multi-lots.

**Scénarios :** Rangement structuré | Validation capacité d'emplacement | FIFO multi-lots

### Module 3 — Contrôle des stocks et réapprovisionnement
**Durée :** 8 heures | **Flux :** CC_LIST → CC_COUNT → CC_RECON → REPLENISH → COMPLIANCE_M3

Ce module couvre le cycle complet de contrôle des stocks : planification de l'inventaire cyclique, comptage physique, réconciliation des écarts, génération des ajustements (ADJ), et calcul du réapprovisionnement selon les paramètres Min/Max et le stock de sécurité.

**Scénarios :** Inventaire cyclique simple | Analyse d'écart et ajustement | Réapprovisionnement Min/Max

### Module 4 — Indicateurs de performance logistique (KPI)
**Durée :** 8 heures | **Flux :** KPI_DATA → KPI_ROTATION → KPI_SERVICE → KPI_DIAGNOSTIC → COMPLIANCE_M4

Ce module développe la capacité analytique des étudiants à travers l'interprétation des indicateurs clés de performance : taux de rotation des stocks, taux de service (OTIF — On Time In Full), taux d'erreur opérationnel, lead time, et diagnostic global de la performance logistique. Les réponses sont évaluées par analyse sémantique des mots-clés.

**Scénarios :** Analyse de la rotation | Taux de service et erreurs | Diagnostic global

### Module 5 — Simulation opérationnelle intégrée
**Durée :** 8 heures | **Flux :** M5_RECEPTION → M5_PUTAWAY → M5_CYCLE_COUNT → M5_REPLENISH → M5_KPI → M5_DECISION → COMPLIANCE_M5

Module de synthèse qui intègre l'ensemble des compétences acquises dans un cycle opérationnel complet. Les étudiants doivent gérer simultanément les flux physiques, les écarts d'inventaire, les indicateurs de performance, et prendre des décisions stratégiques argumentées.

**Scénarios :** Cycle opérationnel complet | Gestion d'écarts et réajustement | Analyse décisionnelle stratégique

---

## Logique de scoring et de conformité

Each scenario is scored automatically on a 100-point scale. The scoring engine evaluates both the correctness of each transaction (field values, bin selection, quantities) and the student's adherence to WMS compliance rules (posting all transactions, resolving inventory discrepancies, following the correct sequence).

| Composante | Points | Description |
|---|---|---|
| Étapes complétées | 8 × 10 pts | Chaque étape du flux vaut 10 points |
| Conformité système | 5 pts | Aucune transaction non postée, aucun ADJ non résolu |
| Précision des champs | Variable | Bonus/malus selon l'exactitude des valeurs saisies |
| Pénalité hors séquence | -5 pts | Toute tentative d'exécution hors ordre |

**Seuil de réussite :** 60/100. Un étudiant peut obtenir un statut "Non conforme" tout en passant le seuil de réussite — ce comportement est intentionnel et pédagogiquement significatif : il enseigne que la conformité WMS est un objectif distinct de la simple complétion des étapes.

---

## Installation et développement local

```bash
# Cloner le dépôt
git clone https://github.com/Gibran-T/tec-wms-simulator-production.git
cd tec-wms-simulator-production

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
# (Copier .env.example et renseigner DATABASE_URL, JWT_SECRET, etc.)

# Pousser le schéma de base de données
pnpm db:push

# Démarrer le serveur de développement
pnpm dev

# Lancer la suite de tests (218 tests)
pnpm test
```

**Variables d'environnement requises :**

| Variable | Description |
|---|---|
| `DATABASE_URL` | Chaîne de connexion MySQL/TiDB |
| `JWT_SECRET` | Secret pour la signature des cookies de session |
| `VITE_APP_ID` | Identifiant de l'application Manus OAuth |
| `OAUTH_SERVER_URL` | URL du serveur OAuth Manus |
| `BUILT_IN_FORGE_API_KEY` | Clé API Manus (côté serveur) |

---

## Tests

The test suite covers all critical business logic: transaction scoring, WMS compliance rules, step sequencing enforcement, quiz validation, and analytics aggregation.

```bash
pnpm test          # Lancer tous les tests (218 tests)
pnpm test --watch  # Mode watch pour le développement
```

**Couverture :** Routers tRPC, logique de scoring M1–M5, calcul de conformité, séquençage des étapes, validation des quiz, agrégation analytique.

---

## Déploiement

L'application est déployée sur **Manus Cloud** et accessible à l'adresse :

**[https://tecwmssim-nahgw8xk.manus.space](https://tecwmssim-nahgw8xk.manus.space)**

Le déploiement est géré via l'interface Manus. Pour déployer une nouvelle version, sauvegarder un checkpoint puis cliquer sur le bouton **Publier** dans l'interface de gestion.

---

## Auteur et contexte académique

**Développé par :** Thiago Gibran  
**Institution :** Collège de la Concorde — Montréal, Québec, Canada  
**Programme :** TEC.LOG — Gestion intégrée des stocks et performance logistique  
**Contact :** gibranlog@gmail.com  
**Dépôt GitHub :** [Gibran-T/tec-wms-simulator-production](https://github.com/Gibran-T/tec-wms-simulator-production)

Ce projet a été conçu pour combler un manque pédagogique identifié dans l'enseignement des systèmes ERP/WMS au niveau collégial : l'absence d'environnements de simulation accessibles, progressifs et évaluatifs qui permettent aux étudiants de pratiquer les flux opérationnels réels sans risque pour des systèmes de production. TEC.WMS offre un environnement sécurisé où l'erreur est une opportunité d'apprentissage, et où chaque décision opérationnelle a des conséquences mesurables et expliquées.

---

## Licence

Usage pédagogique uniquement. Reproduction, diffusion ou utilisation commerciale interdite sans autorisation écrite du Collège de la Concorde.

© 2026 Collège de la Concorde — Montréal. Tous droits réservés.
