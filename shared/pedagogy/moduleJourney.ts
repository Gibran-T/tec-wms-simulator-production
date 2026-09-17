/** Shared M1–M3 (and reusable M4/M5) student-journey copy. FR/EN only. */

export type JourneyVariant =
  | "hub"
  | "prep"
  | "cons"
  | "mission"
  | "glossary"
  | "teacher";

export type Localized = { fr: string; en: string };

export const JOURNEY_STEPS: Array<{ id: string; title: Localized; body: Localized }> = [
  {
    id: "slides",
    title: { fr: "1. Slides", en: "1. Slides" },
    body: {
      fr: "Vous recevez les concepts, la séquence opérationnelle et les règles. Les slides préparent le raisonnement — elles ne donnent pas la réponse des missions.",
      en: "You receive the concepts, operational sequence and rules. Slides prepare your reasoning — they do not give the mission answers.",
    },
  },
  {
    id: "pre",
    title: { fr: "2. Pré-teste", en: "2. Pre-test" },
    body: {
      fr: "Diagnostic avant les missions. Il identifie vos connaissances de départ. Ce n’est pas la note finale du module et ce n’est pas un échec.",
      en: "A diagnostic before the missions. It identifies your starting knowledge. It is not the module’s final grade and it is not a failure.",
    },
  },
  {
    id: "missions",
    title: { fr: "3. Missions", en: "3. Missions" },
    body: {
      fr: "Vous traitez une issue opérationnelle : analyser les données, choisir une action (A–D), observer la conséquence. Un feedback automatique suit chaque choix.",
      en: "You handle an operational issue: analyze the data, choose an action (A–D), observe the consequence. Automatic feedback follows each choice.",
    },
  },
  {
    id: "feedback",
    title: { fr: "4. Feedback", en: "4. Feedback" },
    body: {
      fr: "Réponse incorrecte : message rouge, règle violée, conséquence, points diminués. Réponse correcte : confirmation verte et poursuite de la mission.",
      en: "Incorrect answer: red message, rule violated, consequence, points reduced. Correct answer: green confirmation and the mission continues.",
    },
  },
  {
    id: "post",
    title: { fr: "5. Pós-teste", en: "5. Post-test" },
    body: {
      fr: "Après les missions, mesurez votre évolution et confirmez les concepts pratiqués. Toujours formatif — hors moyenne officielle.",
      en: "After the missions, measure your evolution and confirm the concepts you practiced. Still formative — outside the official average.",
    },
  },
  {
    id: "exam",
    title: { fr: "6. Examen du module", en: "6. Module exam" },
    body: {
      fr: "L’évaluation formelle reste l’Examen 1 (M1–M3) puis l’Examen 2 en clôture. Pas de nouvelle tentative automatique : seulement avec autorisation explicite du professeur.",
      en: "Formal assessment remains Exam 1 (M1–M3) then Exam 2 at close-out. No automatic retake: only with explicit teacher authorization.",
    },
  },
];

export const JOURNEY_SECTIONS: Record<
  "how" | "assessed" | "feedback" | "glossary",
  { title: Localized; body: Localized }
> = {
  how: {
    title: { fr: "Comment fonctionne ce module ?", en: "How does this module work?" },
    body: {
      fr: "Parcours : Slides → Pré-teste → Missions → Pós-teste → Examen. Le Pré-teste ne bloque pas les missions. Les missions sont des issues à résoudre, pas un quiz déguisé. Le glossaire reste disponible tout au long du parcours.",
      en: "Path: Slides → Pre-test → Missions → Post-test → Exam. The pre-test does not block missions. Missions are issues to solve, not a disguised quiz. The glossary stays available throughout the path.",
    },
  },
  assessed: {
    title: { fr: "Qu’est-ce qui sera évalué ?", en: "What will be assessed?" },
    body: {
      fr: "Formatif (Pré, Pós, feedback des missions) : pour apprendre, hors moyenne officielle. Missions officielles : score et conformité du scénario. Examen 1 et 2 : note officielle, historique conservé, reprise seulement si le professeur l’autorise. Silver/Gold : critères inchangés.",
      en: "Formative (Pre, Post, mission feedback): for learning, outside the official average. Official missions: scenario score and compliance. Exams 1 and 2: official grade, history kept, retake only if the teacher authorizes it. Silver/Gold: criteria unchanged.",
    },
  },
  feedback: {
    title: { fr: "Comment utiliser le feedback ?", en: "How to use the feedback?" },
    body: {
      fr: "Lisez d’abord le contexte de l’issue, puis choisissez. Le rouge explique pourquoi la décision est inadéquate et quelle règle opérationnelle a été violée. Le vert confirme le raisonnement. Relisez la règle, puis continuez — n’essayez pas au hasard.",
      en: "Read the issue context first, then choose. Red explains why the decision is inadequate and which operational rule was violated. Green confirms the reasoning. Re-read the rule, then continue — do not guess at random.",
    },
  },
  glossary: {
    title: { fr: "Comment utiliser le Glossaire ?", en: "How to use the Glossary?" },
    body: {
      fr: "Outil de consultation du langage professionnel : définition simple, sens opérationnel, exemple, lien au processus WMS et au module. Il n’est pas un substitut des slides et il ne révèle pas la bonne réponse de la mission.",
      en: "A consultation tool for professional language: simple definition, operational meaning, example, link to the WMS process and module. It does not replace the slides and it does not reveal the correct mission answer.",
    },
  },
};

export const JOURNEY_PREP_HINT: Localized = {
  fr: "Pré-teste — diagnostic initial. Vous pouvez ensuite ouvrir les missions même sans l’avoir terminé. Résultat hors note officielle.",
  en: "Pre-test — initial diagnostic. You may still open the missions even if you have not finished it. Result is outside the official grade.",
};

export const JOURNEY_CONS_HINT: Localized = {
  fr: "Pós-teste — après les missions. Il mesure l’évolution par rapport au Pré-teste. Toujours formatif.",
  en: "Post-test — after the missions. It measures evolution versus the pre-test. Still formative.",
};

export const JOURNEY_MISSION_HINT: Localized = {
  fr: "Mission = issue opérationnelle. Analysez, choisissez A–D, lisez le feedback, puis exécutez la transaction. Une erreur diminue les points selon le mode (apprentissage réduit / évaluation intégrale).",
  en: "Mission = operational issue. Analyze, choose A–D, read the feedback, then execute the transaction. An error reduces points according to the mode (reduced in learning / full in evaluation).",
};

export const JOURNEY_TEACHER_HINT: Localized = {
  fr: "Suivi pédagogique : Pré vs Pós, questions à fort taux d’erreur, alternative incorrecte la plus choisie, élèves à accompagner. Les Examens 1 et 2 restent sans reprise automatique.",
  en: "Pedagogical monitoring: Pre vs Post, high-error questions, most chosen incorrect alternative, students needing support. Exams 1 and 2 remain without automatic retake.",
};
