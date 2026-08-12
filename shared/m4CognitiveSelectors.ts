/**
 * M4 in-step cognitive selectors — 5 near-miss options per analytical step.
 * Correct option.answerText must pass scoreKpiInterpretation / COMPLIANCE_M4.
 * Wrong options carry specific whyWrong copy for red alerts + score penalty.
 */

export type M4CognitiveStep = "KPI_ROTATION" | "KPI_SERVICE" | "KPI_DIAGNOSTIC";
export type M4CognitiveScn = "SCN-012" | "SCN-013" | "SCN-014";

export type LocalizedPair = { fr: string; en: string };

export type M4CognitiveOption = {
  id: string;
  label: LocalizedPair;
  /** Text submitted to the existing M4 scorer / compliance chain. */
  answerText: string;
  isCorrect: boolean;
  whyWrong?: LocalizedPair;
  whyRight?: LocalizedPair;
};

export type M4CognitiveQuestion = {
  scnCode: M4CognitiveScn;
  step: M4CognitiveStep;
  prompt: LocalizedPair;
  options: M4CognitiveOption[];
};

const ROT_CORRECT =
  "Rotation 6x, zone normale. Maintenir le stock global. Surveiller les SKU lents.";
const SVC_CORRECT = "OTIF 95%, excellent. Erreurs 4%, acceptables. Suivi qualite.";
const DIAG_012 =
  "Maintenir le stock. Reduction ciblee des SKU lents. Revue OTIF et capital.";
const DIAG_013 =
  "OTIF 95%, excellent. Erreurs 4%, acceptables mais a surveiller. Action qualite et suivi mensuel.";
const DIAG_014 =
  "Situation stable. Priorite: qualite d execution. Trade-off: maintenir le stock, former l equipe et revoir OTIF/erreurs dans 90 jours.";

const QUESTIONS: M4CognitiveQuestion[] = [
  // ── SCN-012 · KPI_ROTATION ───────────────────────────────────────────────
  {
    scnCode: "SCN-012",
    step: "KPI_ROTATION",
    prompt: {
      fr: "Lecture de la rotation 6× et recommandation de politique de stock au comité finance :",
      en: "Reading of 6× turnover and stock-policy recommendation to the finance committee:",
    },
    options: [
      {
        id: "scn012-rot-a",
        label: {
          fr: "6× est trop bas → liquidation globale pour libérer le capital de 48 k$.",
          en: "6× is too low → global liquidation to free the $48k capital.",
        },
        answerText: "6x trop bas. Liquidation globale du stock pour liberer le capital.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : 6× est dans la bande normale. Une liquidation globale détruit le service pour un capital déjà justifié.",
          en: "Error: 6× is in the normal band. Global liquidation destroys service for capital that is already justified.",
        },
      },
      {
        id: "scn012-rot-b",
        label: {
          fr: "Rotation normale à 6×. Maintenir le stock global et surveiller les SKU lents.",
          en: "Normal turnover at 6×. Maintain global stock and watch slow SKUs.",
        },
        answerText: ROT_CORRECT,
        isCorrect: true,
        whyRight: {
          fr: "Correct : lecture « normale », décision de maintien, suivi ciblé des SKU lents.",
          en: "Correct: “normal” reading, maintain decision, targeted slow-SKU follow-up.",
        },
      },
      {
        id: "scn012-rot-c",
        label: {
          fr: "6× = rupture imminente → monter immédiatement le stock de sécurité partout.",
          en: "6× = imminent stockout → raise safety stock everywhere immediately.",
        },
        answerText: "6x trop rapide. Rupture imminente. Augmenter le stock de securite partout.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : 6× n’indique pas une rupture. Hausser le SS partout crée du surstock inutile.",
          en: "Error: 6× does not signal a stockout. Raising SS everywhere creates unnecessary overstock.",
        },
      },
      {
        id: "scn012-rot-d",
        label: {
          fr: "Le capital immobilisé de 48 k$ est injustifié → destocker sans regarder la rotation.",
          en: "$48k immobilized capital is unjustified → destock without looking at turnover.",
        },
        answerText: "Capital 48k injustifie. Destocker sans analyser la rotation.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : le capital se lit avec la rotation. À 6×, le capital est cohérent — pas un signal de destock aveugle.",
          en: "Error: capital is read with turnover. At 6×, capital is coherent — not a blind destock signal.",
        },
      },
      {
        id: "scn012-rot-e",
        label: {
          fr: "Rien à faire : la rotation est normale, aucun suivi n’est requis.",
          en: "Nothing to do: turnover is normal, no follow-up required.",
        },
        answerText: "Rotation normale. Rien a faire.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : « normale » n’exclut pas le suivi des SKU lents. Absence d’action = réponse incomplète.",
          en: "Error: “normal” does not remove slow-SKU follow-up. No action = incomplete answer.",
        },
      },
    ],
  },

  // ── SCN-012 · KPI_SERVICE ────────────────────────────────────────────────
  {
    scnCode: "SCN-012",
    step: "KPI_SERVICE",
    prompt: {
      fr: "Lecture OTIF 95 % / erreurs 4 % — quelle interprétation professionnelle ?",
      en: "OTIF 95% / errors 4% reading — which professional interpretation?",
    },
    options: [
      {
        id: "scn012-svc-a",
        label: {
          fr: "OTIF 95 % est faible → priorité absolue : augmenter le stock pour protéger le service.",
          en: "OTIF 95% is weak → absolute priority: raise stock to protect service.",
        },
        answerText: "OTIF 95% faible. Augmenter le stock pour proteger le service.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : 95 % est excellent au seuil. Classer « faible » fausse toute la décision.",
          en: "Error: 95% is excellent at threshold. Calling it “weak” corrupts the whole decision.",
        },
      },
      {
        id: "scn012-svc-b",
        label: {
          fr: "Service acceptable mais médiocre → geler les investissements qualité.",
          en: "Service acceptable but mediocre → freeze quality investments.",
        },
        answerText: "Service mediocre. Geler les investissements qualite.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : OTIF 95 % n’est pas « médiocre ». On ne gèle pas la qualité sur une fausse lecture.",
          en: "Error: 95% OTIF is not “mediocre”. Do not freeze quality on a false reading.",
        },
      },
      {
        id: "scn012-svc-c",
        label: {
          fr: "Dashboard tout vert → aucune vigilance sur les erreurs 4 %.",
          en: "All-green dashboard → no vigilance on the 4% errors.",
        },
        answerText: "Dashboard vert. Aucune vigilance. Tout est parfait.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : piège du dashboard vert. OTIF excellent n’annule pas le risque erreurs 4 %.",
          en: "Error: green-dashboard trap. Excellent OTIF does not cancel the 4% error risk.",
        },
      },
      {
        id: "scn012-svc-d",
        label: {
          fr: "OTIF 95 %, excellent. Erreurs 4 %, acceptables. Suivi qualité.",
          en: "OTIF 95%, excellent. Errors 4%, acceptable. Quality follow-up.",
        },
        answerText: SVC_CORRECT,
        isCorrect: true,
        whyRight: {
          fr: "Correct : OTIF excellent, erreurs acceptables mais suivies — lecture équilibrée.",
          en: "Correct: excellent OTIF, acceptable but monitored errors — balanced reading.",
        },
      },
      {
        id: "scn012-svc-e",
        label: {
          fr: "Erreurs 4 % = critique → arrêter les expéditions jusqu’à audit complet.",
          en: "Errors 4% = critical → stop shipments until full audit.",
        },
        answerText: "Erreurs 4% critiques. Arreter les expeditions jusqu a audit.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : 4 % est acceptable (pas critique). Stopper les expéditions est une sur-réaction.",
          en: "Error: 4% is acceptable (not critical). Stopping shipments is an overreaction.",
        },
      },
    ],
  },

  // ── SCN-012 · KPI_DIAGNOSTIC ─────────────────────────────────────────────
  {
    scnCode: "SCN-012",
    step: "KPI_DIAGNOSTIC",
    prompt: {
      fr: "Synthèse multi-KPI pour le comité : quelle décision cohérente ?",
      en: "Multi-KPI synthesis for the committee: which coherent decision?",
    },
    options: [
      {
        id: "scn012-diag-a",
        label: {
          fr: "Tout liquider : rotation, service et capital seront automatiquement meilleurs.",
          en: "Liquidate everything: turnover, service and capital will automatically improve.",
        },
        answerText: "Liquidation globale. Tout sera automatiquement meilleur.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : liquidation globale contredit la rotation normale et met le service en danger.",
          en: "Error: global liquidation contradicts normal turnover and endangers service.",
        },
      },
      {
        id: "scn012-diag-b",
        label: {
          fr: "Ignorer les SKU lents : le portefeuille est déjà optimal.",
          en: "Ignore slow SKUs: the portfolio is already optimal.",
        },
        answerText: "Portefeuille optimal. Ignorer les SKU lents. Rien a faire.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : même en bande normale, les SKU lents demandent un suivi ciblé.",
          en: "Error: even in the normal band, slow SKUs still need targeted follow-up.",
        },
      },
      {
        id: "scn012-diag-c",
        label: {
          fr: "Maintenir le stock. Réduction ciblée des SKU lents. Revue OTIF et capital.",
          en: "Maintain stock. Targeted slow-SKU reduction. Review OTIF and capital.",
        },
        answerText: DIAG_012,
        isCorrect: true,
        whyRight: {
          fr: "Correct : maintien global + action ciblée + revue des KPI — arbitrage professionnel.",
          en: "Correct: global maintain + targeted action + KPI review — professional arbitration.",
        },
      },
      {
        id: "scn012-diag-d",
        label: {
          fr: "Priorité unique : maximiser la rotation même si l’OTIF chute.",
          en: "Single priority: maximize turnover even if OTIF drops.",
        },
        answerText: "Maximiser la rotation meme si OTIF chute. Priorite unique rotation.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : optimisation mono-KPI. Sacrifier l’OTIF pour la rotation est une sous-optimisation.",
          en: "Error: single-KPI optimization. Sacrificing OTIF for turnover is sub-optimization.",
        },
      },
      {
        id: "scn012-diag-e",
        label: {
          fr: "Attendre 12 mois sans action : les KPI se corrigeront seuls.",
          en: "Wait 12 months with no action: KPIs will self-correct.",
        },
        answerText: "Attendre 12 mois. Les KPI se corrigeront seuls. Rien a faire.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : absence d’action et d’horizon de revue. Le comité attend une décision.",
          en: "Error: no action and no review horizon. The committee expects a decision.",
        },
      },
    ],
  },

  // ── SCN-013 · KPI_ROTATION ───────────────────────────────────────────────
  {
    scnCode: "SCN-013",
    step: "KPI_ROTATION",
    prompt: {
      fr: "Contexte portefeuille (rotation 6×) avant l’arbitrage formation J-90 :",
      en: "Portfolio context (6× turnover) before the J-90 training arbitration:",
    },
    options: [
      {
        id: "scn013-rot-a",
        label: {
          fr: "Rotation 6× normale — maintenir le stock global et surveiller les SKU lents.",
          en: "6× turnover normal — maintain global stock and watch slow SKUs.",
        },
        answerText: ROT_CORRECT,
        isCorrect: true,
        whyRight: {
          fr: "Correct : le contexte rotation reste « normal » ; l’arbitrage qualité vient ensuite.",
          en: "Correct: turnover context stays “normal”; quality arbitration comes next.",
        },
      },
      {
        id: "scn013-rot-b",
        label: {
          fr: "Rotation mauvaise → annuler le budget formation pour financer un destock.",
          en: "Bad turnover → cancel training budget to fund a destock.",
        },
        answerText: "Rotation mauvaise. Annuler formation pour financer destock.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : la rotation n’est pas mauvaise. Couper la formation pour destocker est incohérent.",
          en: "Error: turnover is not bad. Cutting training to destock is incoherent.",
        },
      },
      {
        id: "scn013-rot-c",
        label: {
          fr: "6× = surstock critique → priorité destock avant toute qualité.",
          en: "6× = critical overstock → destock priority before any quality work.",
        },
        answerText: "6x surstock critique. Destock prioritaire avant qualite.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : 6× n’est pas un surstock critique. La priorité SCN-013 est le risque erreurs.",
          en: "Error: 6× is not critical overstock. SCN-013 priority is the error risk.",
        },
      },
      {
        id: "scn013-rot-d",
        label: {
          fr: "Ignorer la rotation : seul l’OTIF compte dans ce scénario.",
          en: "Ignore turnover: only OTIF matters in this scenario.",
        },
        answerText: "Ignorer la rotation. Seul OTIF compte.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : même dans un arbitrage service/qualité, la lecture rotation reste requise.",
          en: "Error: even in a service/quality arbitration, the turnover reading is still required.",
        },
      },
      {
        id: "scn013-rot-e",
        label: {
          fr: "Rotation excellente → augmenter massivement le stock pour “sécuriser”.",
          en: "Excellent turnover → massively raise stock to “secure” supply.",
        },
        answerText: "Rotation excellente. Augmenter massivement le stock.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : 6× est normal, pas un signal d’augmentation massive de stock.",
          en: "Error: 6× is normal, not a signal for massively raising stock.",
        },
      },
    ],
  },

  // ── SCN-013 · KPI_SERVICE ────────────────────────────────────────────────
  {
    scnCode: "SCN-013",
    step: "KPI_SERVICE",
    prompt: {
      fr: "OTIF 95 % vs erreurs 4 % avant renouvellement SLA — quelle lecture ?",
      en: "OTIF 95% vs 4% errors before SLA renewal — which reading?",
    },
    options: [
      {
        id: "scn013-svc-a",
        label: {
          fr: "Dashboard vert → refuser le budget formation J-90.",
          en: "Green dashboard → refuse the J-90 training budget.",
        },
        answerText: "Dashboard vert. Refuser le budget formation. Tout est parfait.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : piège du dashboard vert. L’OTIF masque un risque erreurs qui menace le SLA.",
          en: "Error: green-dashboard trap. OTIF hides an error risk that threatens the SLA.",
        },
      },
      {
        id: "scn013-svc-b",
        label: {
          fr: "OTIF 95 %, excellent. Erreurs 4 %, acceptables. Suivi qualité.",
          en: "OTIF 95%, excellent. Errors 4%, acceptable. Quality follow-up.",
        },
        answerText: SVC_CORRECT,
        isCorrect: true,
        whyRight: {
          fr: "Correct : service excellent + erreurs à surveiller — base de l’arbitrage formation.",
          en: "Correct: excellent service + errors to monitor — basis for training arbitration.",
        },
      },
      {
        id: "scn013-svc-c",
        label: {
          fr: "OTIF insuffisant → pénaliser l’équipe avant toute formation.",
          en: "Insufficient OTIF → penalize the team before any training.",
        },
        answerText: "OTIF insuffisant. Penaliser l equipe avant formation.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : 95 % n’est pas insuffisant. La sanction remplace à tort le diagnostic qualité.",
          en: "Error: 95% is not insufficient. Punishment wrongly replaces the quality diagnosis.",
        },
      },
      {
        id: "scn013-svc-d",
        label: {
          fr: "Erreurs 4 % acceptables → aucun suivi, SLA garanti.",
          en: "4% errors acceptable → no follow-up, SLA guaranteed.",
        },
        answerText: "Erreurs 4% acceptables. Aucun suivi. SLA garanti.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : « acceptable » ≠ « ignorer ». Sans suivi, le risque SLA reste réel.",
          en: "Error: “acceptable” ≠ “ignore”. Without follow-up, SLA risk remains real.",
        },
      },
      {
        id: "scn013-svc-e",
        label: {
          fr: "Service et erreurs sont contradictoires → impossible de décider.",
          en: "Service and errors contradict each other → impossible to decide.",
        },
        answerText: "Service et erreurs contradictoires. Impossible de decider.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : ce n’est pas une contradiction bloquante — c’est exactement l’arbitrage à faire.",
          en: "Error: this is not a blocking contradiction — it is exactly the arbitration to make.",
        },
      },
    ],
  },

  // ── SCN-013 · KPI_DIAGNOSTIC ─────────────────────────────────────────────
  {
    scnCode: "SCN-013",
    step: "KPI_DIAGNOSTIC",
    prompt: {
      fr: "Arbitrage budget formation J-90 : quelle synthèse ?",
      en: "J-90 training-budget arbitration: which synthesis?",
    },
    options: [
      {
        id: "scn013-diag-a",
        label: {
          fr: "Refuser la formation : l’OTIF 95 % prouve que tout va bien.",
          en: "Refuse training: 95% OTIF proves everything is fine.",
        },
        answerText: "Refuser formation. OTIF 95% prouve que tout va bien.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : OTIF excellent n’annule pas le risque erreurs 4 % avant le SLA.",
          en: "Error: excellent OTIF does not cancel the 4% error risk before the SLA.",
        },
      },
      {
        id: "scn013-diag-b",
        label: {
          fr: "Destocker d’abord, former ensuite — le capital prime sur la qualité.",
          en: "Destock first, train later — capital beats quality.",
        },
        answerText: "Destocker d abord. Capital prime sur la qualite.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : le scénario demande un arbitrage qualité/erreurs, pas un destock prioritaire.",
          en: "Error: the scenario asks for quality/error arbitration, not a destock-first move.",
        },
      },
      {
        id: "scn013-diag-c",
        label: {
          fr: "Couper le stock de sécurité pour financer la formation.",
          en: "Cut safety stock to fund training.",
        },
        answerText: "Couper le stock de securite pour financer la formation.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : financer la qualité en cassant le SS met le service en risque.",
          en: "Error: funding quality by cutting SS puts service at risk.",
        },
      },
      {
        id: "scn013-diag-d",
        label: {
          fr: "OTIF 95 % excellent. Erreurs 4 % à surveiller. Action qualité et suivi mensuel.",
          en: "OTIF 95% excellent. Errors 4% to monitor. Quality action and monthly follow-up.",
        },
        answerText: DIAG_013,
        isCorrect: true,
        whyRight: {
          fr: "Correct : on protège le service et on traite le risque erreurs avec suivi.",
          en: "Correct: protect service and treat the error risk with follow-up.",
        },
      },
      {
        id: "scn013-diag-e",
        label: {
          fr: "Attendre la rupture SLA pour justifier le budget formation.",
          en: "Wait for an SLA breach to justify the training budget.",
        },
        answerText: "Attendre la rupture SLA pour justifier la formation. Rien a faire maintenant.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : décision réactive trop tardive. L’arbitrage se fait avant le renouvellement SLA.",
          en: "Error: too-late reactive decision. Arbitration happens before SLA renewal.",
        },
      },
    ],
  },

  // ── SCN-014 · KPI_ROTATION ───────────────────────────────────────────────
  {
    scnCode: "SCN-014",
    step: "KPI_ROTATION",
    prompt: {
      fr: "S&OP multi-acteurs — lecture rotation avant arbitrage d’initiative :",
      en: "Multi-stakeholder S&OP — turnover reading before initiative arbitration:",
    },
    options: [
      {
        id: "scn014-rot-a",
        label: {
          fr: "Sales a raison : destocker massivement car 6× est insuffisant.",
          en: "Sales is right: massively destock because 6× is insufficient.",
        },
        answerText: "6x insuffisant. Destocker massivement comme le demande Sales.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : 6× est normal. Suivre Sales sans lecture KPI = décision politique, pas opérationnelle.",
          en: "Error: 6× is normal. Following Sales without KPI reading is politics, not operations.",
        },
      },
      {
        id: "scn014-rot-b",
        label: {
          fr: "CFO a raison : bloquer tout stock car 48 k$ est toujours excessif.",
          en: "CFO is right: freeze all stock because $48k is always excessive.",
        },
        answerText: "Capital 48k toujours excessif. Bloquer tout stock.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : le capital se justifie avec la rotation normale. Pas de gel aveugle.",
          en: "Error: capital is justified with normal turnover. No blind freeze.",
        },
      },
      {
        id: "scn014-rot-c",
        label: {
          fr: "Ops seulement : ignorer finance et sales, garder le status quo total.",
          en: "Ops only: ignore finance and sales, keep total status quo.",
        },
        answerText: "Ignorer finance et sales. Status quo total. Rien a faire.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : le S&OP exige un arbitrage multi-KPI, pas un status quo silencieux.",
          en: "Error: S&OP requires multi-KPI arbitration, not a silent status quo.",
        },
      },
      {
        id: "scn014-rot-d",
        label: {
          fr: "Rotation 6×, zone normale. Maintenir le stock global. Surveiller les SKU lents.",
          en: "Turnover 6×, normal zone. Maintain global stock. Watch slow SKUs.",
        },
        answerText: ROT_CORRECT,
        isCorrect: true,
        whyRight: {
          fr: "Correct : lecture neutre et professionnelle avant l’arbitrage d’initiative.",
          en: "Correct: neutral professional reading before initiative arbitration.",
        },
      },
      {
        id: "scn014-rot-e",
        label: {
          fr: "Rotation excellente → investir d’abord dans plus de stock, puis la qualité.",
          en: "Excellent turnover → invest first in more stock, then quality.",
        },
        answerText: "Rotation excellente. Investir d abord dans plus de stock.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : 6× n’appelle pas un investissement stock prioritaire face au risque erreurs.",
          en: "Error: 6× does not call for a stock-first investment versus the error risk.",
        },
      },
    ],
  },

  // ── SCN-014 · KPI_SERVICE ────────────────────────────────────────────────
  {
    scnCode: "SCN-014",
    step: "KPI_SERVICE",
    prompt: {
      fr: "Lecture service/erreurs dans le conflit CFO / Sales / Ops :",
      en: "Service/errors reading in the CFO / Sales / Ops conflict:",
    },
    options: [
      {
        id: "scn014-svc-a",
        label: {
          fr: "OTIF 95 %, excellent. Erreurs 4 %, acceptables. Suivi qualité.",
          en: "OTIF 95%, excellent. Errors 4%, acceptable. Quality follow-up.",
        },
        answerText: SVC_CORRECT,
        isCorrect: true,
        whyRight: {
          fr: "Correct : base factuelle stable pour arbitrer l’initiative qualité.",
          en: "Correct: stable factual base to arbitrate the quality initiative.",
        },
      },
      {
        id: "scn014-svc-b",
        label: {
          fr: "Service parfait → aucune initiative qualité n’est justifiable.",
          en: "Perfect service → no quality initiative is justifiable.",
        },
        answerText: "Service parfait. Aucune initiative qualite justifiable.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : service excellent n’efface pas le risque erreurs 4 % ni le besoin de suivi.",
          en: "Error: excellent service does not erase the 4% error risk or the need for follow-up.",
        },
      },
      {
        id: "scn014-svc-c",
        label: {
          fr: "Erreurs critiques → stopper le S&OP jusqu’à zéro défaut.",
          en: "Critical errors → stop S&OP until zero defects.",
        },
        answerText: "Erreurs critiques. Stopper le S et OP jusqu a zero defaut.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : 4 % n’est pas « critique ». Stopper le S&OP est disproportionné.",
          en: "Error: 4% is not “critical”. Stopping S&OP is disproportionate.",
        },
      },
      {
        id: "scn014-svc-d",
        label: {
          fr: "Sales prime : promettre 99 % OTIF immédiatement sans plan d’exécution.",
          en: "Sales wins: promise 99% OTIF immediately with no execution plan.",
        },
        answerText: "Promettre 99% OTIF immediatement sans plan. Sales prime.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : promesse sans plan d’exécution. L’arbitrage exige une action réaliste.",
          en: "Error: promise without an execution plan. Arbitration requires a realistic action.",
        },
      },
      {
        id: "scn014-svc-e",
        label: {
          fr: "CFO prime : réduire le service pour baisser le capital immobilisé.",
          en: "CFO wins: cut service to lower immobilized capital.",
        },
        answerText: "Reduire le service pour baisser le capital. CFO prime.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : sacrifier le service pour le capital est une sous-optimisation mono-acteur.",
          en: "Error: sacrificing service for capital is single-stakeholder sub-optimization.",
        },
      },
    ],
  },

  // ── SCN-014 · KPI_DIAGNOSTIC ─────────────────────────────────────────────
  {
    scnCode: "SCN-014",
    step: "KPI_DIAGNOSTIC",
    prompt: {
      fr: "Capstone S&OP — quelle initiative financer avec trade-off et horizon ?",
      en: "S&OP capstone — which initiative to fund with trade-off and horizon?",
    },
    options: [
      {
        id: "scn014-diag-a",
        label: {
          fr: "Financer uniquement un destock massif demandé par le CFO.",
          en: "Fund only a massive destock requested by the CFO.",
        },
        answerText: "Financer uniquement un destock massif. CFO gagne.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : destock massif contredit la rotation normale et ignore le risque erreurs.",
          en: "Error: massive destock contradicts normal turnover and ignores the error risk.",
        },
      },
      {
        id: "scn014-diag-b",
        label: {
          fr: "Financer uniquement l’expansion commerciale Sales, sans qualité.",
          en: "Fund only Sales commercial expansion, with no quality work.",
        },
        answerText: "Financer uniquement expansion Sales sans qualite.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : expansion sans qualité aggrave le risque erreurs sous SLA.",
          en: "Error: expansion without quality worsens the error risk under SLA.",
        },
      },
      {
        id: "scn014-diag-c",
        label: {
          fr: "Situation stable. Priorité : qualité d’exécution. Trade-off : maintenir le stock, former l’équipe, revoir OTIF/erreurs sous 90 jours.",
          en: "Stable situation. Priority: execution quality. Trade-off: maintain stock, train the team, review OTIF/errors within 90 days.",
        },
        answerText: DIAG_014,
        isCorrect: true,
        whyRight: {
          fr: "Correct : priorité qualité, trade-off explicite, horizon 90 jours — arbitrage S&OP.",
          en: "Correct: quality priority, explicit trade-off, 90-day horizon — S&OP arbitration.",
        },
      },
      {
        id: "scn014-diag-d",
        label: {
          fr: "Ne rien financer : attendre que les trois acteurs se mettent d’accord seuls.",
          en: "Fund nothing: wait until the three stakeholders agree on their own.",
        },
        answerText: "Ne rien financer. Attendre l accord des acteurs. Rien a faire.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : absence de décision. Le capstone exige une priorité financée.",
          en: "Error: no decision. The capstone requires a funded priority.",
        },
      },
      {
        id: "scn014-diag-e",
        label: {
          fr: "Tout financer en même temps : destock + expansion + qualité, sans trade-off.",
          en: "Fund everything at once: destock + expansion + quality, with no trade-off.",
        },
        answerText: "Tout financer en meme temps sans trade-off.",
        isCorrect: false,
        whyWrong: {
          fr: "Erreur : sans trade-off ni priorité, ce n’est pas un arbitrage — c’est une fuite.",
          en: "Error: without trade-off or priority, this is not arbitration — it is avoidance.",
        },
      },
    ],
  },
];

const BY_KEY = new Map<string, M4CognitiveQuestion>();
for (const q of QUESTIONS) {
  BY_KEY.set(`${q.scnCode}::${q.step}`, q);
}

export function isM4CognitiveStep(step: string | null | undefined): step is M4CognitiveStep {
  return step === "KPI_ROTATION" || step === "KPI_SERVICE" || step === "KPI_DIAGNOSTIC";
}

export function normalizeM4CognitiveScn(scnCode: string | null | undefined): M4CognitiveScn {
  const u = (scnCode ?? "SCN-012").toUpperCase();
  if (u === "SCN-013" || u === "SCN-014") return u;
  return "SCN-012";
}

export function getM4CognitiveQuestion(
  scnCode: string | null | undefined,
  step: string | null | undefined,
): M4CognitiveQuestion | null {
  if (!isM4CognitiveStep(step)) return null;
  const scn = normalizeM4CognitiveScn(scnCode);
  return BY_KEY.get(`${scn}::${step}`) ?? null;
}

export function getM4CognitiveOption(
  scnCode: string | null | undefined,
  step: string | null | undefined,
  optionId: string,
): M4CognitiveOption | null {
  const q = getM4CognitiveQuestion(scnCode, step);
  if (!q) return null;
  return q.options.find((o) => o.id === optionId) ?? null;
}

export function listM4CognitiveQuestions(): M4CognitiveQuestion[] {
  return QUESTIONS;
}

/** Penalty applied on each incorrect cognitive selection (matches M4 short-answer miss). */
export const M4_COGNITIVE_WRONG_PENALTY = -5;

export function m4CognitivePenaltyEventType(step: M4CognitiveStep): string {
  return `${step}_COGNITIVE_INCORRECT`;
}
