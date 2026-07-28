/**
 * Closed-item formative scoring only.
 * No free-text answers and no short-answer text correction.
 */
import {
  M4_CONS_ACTIONS,
  M4_CONS_DECISION_PAIRS,
  M4_CONS_KPI_COLORS,
  M4_CONS_PRIORITY_RISK,
  M4_CONS_TRUE_FALSE,
  M4_LAYERS,
  M4_PREP_FRAGMENTS,
  M4_PREP_KPI_QUESTIONS,
  M4_PREP_MISSING,
  M5_CONS_ACTIONS,
  M5_CONS_ASSOC,
  M5_CONS_EVIDENCE_COLORS,
  M5_CONS_PATH,
  M5_CONS_PATH_LABELS,
  M5_CONS_TRUE_FALSE,
  M5_PREP_ASSOC,
  M5_PREP_STOCK_BASE,
  M5_PREP_TRAFFIC,
  M5_PREP_TRUE_FALSE,
} from "./content";
import { isCompleteOrdering } from "./orderingState";
import type {
  FormativeExerciseId,
  FormativeFeedbackItem,
  FormativeScoreResult,
  LocalizedText,
} from "./types";

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function fb(
  id: string,
  kind: FormativeFeedbackItem["kind"],
  title: LocalizedText,
  body: LocalizedText,
): FormativeFeedbackItem {
  return { id, kind, title, body };
}

function arrayEqualUnordered(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

function scoreMapExact(
  items: Array<{ id: string; expected: string; label: LocalizedText }>,
  answers: Record<string, string>,
  okTitle: LocalizedText,
  badTitle: LocalizedText,
  whyOk: (label: LocalizedText) => LocalizedText,
  whyBad: (label: LocalizedText) => LocalizedText,
): { score: number; feedback: FormativeFeedbackItem[] } {
  let correct = 0;
  const feedback: FormativeFeedbackItem[] = [];
  for (const item of items) {
    const chosen = answers[item.id];
    if (!chosen) {
      feedback.push(
        fb(
          `${item.id}-empty`,
          "incomplete",
          { fr: "Réponse incomplète", en: "Incomplete answer" },
          {
            fr: `Sélectionnez une option pour « ${item.label.fr} ».`,
            en: `Select an option for “${item.label.en}”.`,
          },
        ),
      );
      continue;
    }
    const ok = chosen === item.expected;
    if (ok) correct += 1;
    feedback.push(
      fb(
        item.id,
        ok ? "correct" : "incorrect",
        ok ? okTitle : badTitle,
        ok ? whyOk(item.label) : whyBad(item.label),
      ),
    );
  }
  return {
    score: items.length ? (correct / items.length) * 100 : 0,
    feedback,
  };
}

function scoreOrdering(
  expected: string[],
  order: string[],
  labels: Record<string, LocalizedText>,
): { score: number; feedback: FormativeFeedbackItem[] } {
  // Incomplete only when the payload is absent/malformed, missing IDs,
  // unexpected IDs, or duplicates — never when a full non-canonical order exists.
  if (!isCompleteOrdering(expected, order)) {
    return {
      score: 0,
      feedback: [
        fb(
          "order-empty",
          "incomplete",
          { fr: "Réponse incomplète", en: "Incomplete answer" },
          {
            fr: "Ordonnez toutes les étapes.",
            en: "Order all steps.",
          },
        ),
      ],
    };
  }
  let matches = 0;
  for (let i = 0; i < expected.length; i += 1) {
    if (order[i] === expected[i]) matches += 1;
  }
  const perfect = matches === expected.length;
  return {
    score: (matches / expected.length) * 100,
    feedback: [
      fb(
        "order",
        perfect ? "correct" : "incorrect",
        {
          fr: perfect ? "Ordre correct" : "Ordre incorrect",
          en: perfect ? "Correct order" : "Incorrect order",
        },
        {
          fr: perfect
            ? `Parcours attendu : ${expected.map((id) => labels[id]?.fr ?? id).join(" → ")}.`
            : "Repositionnez les étapes dans l’ordre professionnel.",
          en: perfect
            ? `Expected path: ${expected.map((id) => labels[id]?.en ?? id).join(" → ")}.`
            : "Reposition the steps in the professional order.",
        },
      ),
    ],
  };
}

function scoreMissing(answers: Record<string, string[]>): {
  score: number;
  feedback: FormativeFeedbackItem[];
} {
  let total = 0;
  const feedback: FormativeFeedbackItem[] = [];
  for (const item of M4_PREP_MISSING) {
    const selected = answers[item.id] ?? [];
    if (!selected.length) {
      feedback.push(
        fb(
          `miss-${item.id}-empty`,
          "incomplete",
          { fr: "Réponse incomplète", en: "Incomplete answer" },
          {
            fr: "Sélectionnez les couches manquantes.",
            en: "Select the missing layers.",
          },
        ),
      );
      continue;
    }
    const ok = arrayEqualUnordered(selected, item.expectedMissing);
    total += ok ? 100 : 0;
    feedback.push(
      fb(
        `miss-${item.id}`,
        ok ? "correct" : "incorrect",
        {
          fr: ok ? "Couches manquantes correctes" : "Couches manquantes incorrectes",
          en: ok ? "Correct missing layers" : "Incorrect missing layers",
        },
        {
          fr: `${item.explanation.fr} Règle : une structure professionnelle couvre toute la chaîne.`,
          en: `${item.explanation.en} Rule: a professional structure covers the full chain.`,
        },
      ),
    );
  }
  return { score: total / M4_PREP_MISSING.length, feedback };
}

function scoreTrueFalse(
  items: Array<{
    id: string;
    answer: boolean;
    why: LocalizedText;
    rule: LocalizedText;
  }>,
  answers: Record<string, boolean | string>,
): { score: number; feedback: FormativeFeedbackItem[] } {
  let correct = 0;
  const feedback: FormativeFeedbackItem[] = [];
  for (const item of items) {
    const raw = answers[item.id];
    if (raw === undefined || raw === "") {
      feedback.push(
        fb(
          `${item.id}-empty`,
          "incomplete",
          { fr: "Réponse incomplète", en: "Incomplete answer" },
          { fr: "Choisissez Vrai ou Faux.", en: "Choose True or False." },
        ),
      );
      continue;
    }
    const chosen = raw === true || raw === "true";
    const ok = chosen === item.answer;
    if (ok) correct += 1;
    feedback.push(
      fb(
        item.id,
        ok ? "correct" : "incorrect",
        {
          fr: ok ? "Correct" : "Incorrect",
          en: ok ? "Correct" : "Incorrect",
        },
        {
          fr: `${item.why.fr} ${item.rule.fr}`,
          en: `${item.why.en} ${item.rule.en}`,
        },
      ),
    );
  }
  return {
    score: items.length ? (correct / items.length) * 100 : 0,
    feedback,
  };
}

function scoreSingleChoice(
  correctId: string,
  chosen: string | undefined,
  labels: { ok: LocalizedText; bad: LocalizedText },
): { score: number; feedback: FormativeFeedbackItem[] } {
  if (!chosen) {
    return {
      score: 0,
      feedback: [
        fb(
          "single-empty",
          "incomplete",
          { fr: "Réponse incomplète", en: "Incomplete answer" },
          { fr: "Sélectionnez une option.", en: "Select an option." },
        ),
      ],
    };
  }
  const ok = chosen === correctId;
  return {
    score: ok ? 100 : 0,
    feedback: [
      fb("single", ok ? "correct" : "incorrect", ok ? labels.ok : labels.bad, {
        fr: ok
          ? "Choix aligné avec la règle professionnelle."
          : "Ce n’est pas le choix prioritaire dans ce cas.",
        en: ok
          ? "Choice aligned with the professional rule."
          : "This is not the priority choice in this case.",
      }),
    ],
  };
}

export function scoreFormativeExercise(
  exerciseId: FormativeExerciseId,
  answers: Record<string, unknown>,
): FormativeScoreResult {
  const partScores: Record<string, number> = {};
  const feedback: FormativeFeedbackItem[] = [];

  if (exerciseId === "M4-PREP-KPI-RESPONSE") {
    const c1 = scoreMapExact(
      M4_PREP_FRAGMENTS.map((f) => ({
        id: f.id,
        expected: f.layer,
        label: f.text,
      })),
      (answers.classification as Record<string, string>) ?? {},
      { fr: "Association correcte", en: "Correct association" },
      { fr: "Association incorrecte", en: "Incorrect association" },
      (label) => ({
        fr: `« ${label.fr} » est bien classé. Règle : une couche = un rôle dans la chaîne.`,
        en: `“${label.en}” is correctly classified. Rule: one layer = one role in the chain.`,
      }),
      (label) => ({
        fr: `« ${label.fr} » ne correspond pas à la couche choisie.`,
        en: `“${label.en}” does not match the chosen layer.`,
      }),
    );
    const layerLabels = Object.fromEntries(
      M4_LAYERS.map((id) => [
        id,
        {
          fr: id,
          en: id,
        },
      ]),
    );
    const c2 = scoreOrdering(
      [...M4_LAYERS],
      (answers.ordering as string[]) ?? [],
      layerLabels,
    );
    const c3 = scoreMissing((answers.missing as Record<string, string[]>) ?? {});
    const c4 = scoreMapExact(
      M4_PREP_KPI_QUESTIONS.map((k) => ({
        id: k.id,
        expected: k.questionId,
        label: k.kpi,
      })),
      (answers.kpiQuestions as Record<string, string>) ?? {},
      { fr: "Question correcte", en: "Correct question" },
      { fr: "Question incorrecte", en: "Incorrect question" },
      (label) => ({
        fr: `Le KPI « ${label.fr} » est associé à la bonne question professionnelle.`,
        en: `KPI “${label.en}” is linked to the right professional question.`,
      }),
      (label) => ({
        fr: `Revoir la question professionnelle liée à « ${label.fr} ».`,
        en: `Revisit the professional question linked to “${label.en}”.`,
      }),
    );
    partScores.classification = c1.score;
    partScores.ordering = c2.score;
    partScores.missing = c3.score;
    partScores.kpiQuestions = c4.score;
    feedback.push(...c1.feedback, ...c2.feedback, ...c3.feedback, ...c4.feedback);
    return {
      formativeScore: clampScore((c1.score + c2.score + c3.score + c4.score) / 4),
      feedback,
      partScores,
    };
  }

  if (exerciseId === "M4-CONS-SAME-KPI-DIFF-DECISION") {
    const c1 = scoreMapExact(
      M4_CONS_KPI_COLORS.map((k) => ({
        id: k.id,
        expected: k.color,
        label: k.label,
      })),
      (answers.kpiColors as Record<string, string>) ?? {},
      { fr: "Classification couleur correcte", en: "Correct color classification" },
      { fr: "Classification couleur incorrecte", en: "Incorrect color classification" },
      (label) => ({
        fr: `« ${label.fr} » est bien classé. Règle : Vert conforme, Ambre à surveiller, Rouge critique.`,
        en: `“${label.en}” is correctly classified. Rule: Green compliant, Amber watch, Red critical.`,
      }),
      (label) => ({
        fr: `Reclasser « ${label.fr} » selon Vert / Ambre / Rouge.`,
        en: `Reclassify “${label.en}” as Green / Amber / Red.`,
      }),
    );
    const c2 = scoreSingleChoice(
      M4_CONS_PRIORITY_RISK.correctId,
      answers.priorityRisk as string | undefined,
      {
        ok: { fr: "Risque prioritaire correct", en: "Correct priority risk" },
        bad: { fr: "Risque prioritaire incorrect", en: "Incorrect priority risk" },
      },
    );
    const c3 = scoreTrueFalse(M4_CONS_TRUE_FALSE, (answers.trueFalse as Record<string, boolean>) ?? {});
    const c4 = scoreMapExact(
      M4_CONS_ACTIONS.map((a) => ({
        id: a.id,
        expected: a.bucket,
        label: a.label,
      })),
      (answers.actionBuckets as Record<string, string>) ?? {},
      { fr: "Action bien classée", en: "Action correctly classified" },
      { fr: "Action mal classée", en: "Action misclassified" },
      (label) => ({
        fr: `« ${label.fr} » est au bon levier. Règle : priorité / suivi / mauvais levier.`,
        en: `“${label.en}” is in the right bucket. Rule: priority / follow-up / wrong lever.`,
      }),
      (label) => ({
        fr: `Reclasser « ${label.fr} » (priorité, suivi ou mauvais levier).`,
        en: `Reclassify “${label.en}” (priority, follow-up or wrong lever).`,
      }),
    );
    const c5 = scoreMapExact(
      M4_CONS_DECISION_PAIRS.map((d) => ({
        id: d.id,
        expected: d.justificationId,
        label: d.decision,
      })),
      (answers.decisionPairs as Record<string, string>) ?? {},
      { fr: "Justification correcte", en: "Correct justification" },
      { fr: "Justification incorrecte", en: "Incorrect justification" },
      (label) => ({
        fr: `La décision « ${label.fr} » est bien justifiée.`,
        en: `Decision “${label.en}” is correctly justified.`,
      }),
      (label) => ({
        fr: `Associez la bonne justification à « ${label.fr} ».`,
        en: `Link the right justification to “${label.en}”.`,
      }),
    );
    partScores.kpiColors = c1.score;
    partScores.priorityRisk = c2.score;
    partScores.trueFalse = c3.score;
    partScores.actionBuckets = c4.score;
    partScores.decisionPairs = c5.score;
    feedback.push(...c1.feedback, ...c2.feedback, ...c3.feedback, ...c4.feedback, ...c5.feedback);
    return {
      formativeScore: clampScore((c1.score + c2.score + c3.score + c4.score + c5.score) / 5),
      feedback,
      partScores,
    };
  }

  if (exerciseId === "M5-PREP-EVIDENCE-TO-DECISION") {
    const c1 = scoreMapExact(
      M5_PREP_TRAFFIC.map((t) => ({
        id: t.id,
        expected: t.color,
        label: t.prompt,
      })),
      (answers.traffic as Record<string, string>) ?? {},
      { fr: "Feu correct", en: "Correct traffic light" },
      { fr: "Feu incorrect", en: "Incorrect traffic light" },
      (label) => ({
        fr: `« ${label.fr} » est bien classé. Règle : Vert décider, Ambre vérifier, Rouge bloquer.`,
        en: `“${label.en}” is correctly classified. Rule: Green decide, Amber verify, Red block.`,
      }),
      (label) => ({
        fr: `Revoir le feu pour « ${label.fr} ».`,
        en: `Revisit the traffic light for “${label.en}”.`,
      }),
    );
    const c2 = scoreSingleChoice(M5_PREP_STOCK_BASE.correctId, answers.stockBase as string | undefined, {
      ok: { fr: "Base correcte", en: "Correct base" },
      bad: { fr: "Base incorrecte", en: "Incorrect base" },
    });
    const c3 = scoreMapExact(
      M5_PREP_ASSOC.map((a) => ({
        id: a.id,
        expected: a.consequenceId,
        label: a.evidence,
      })),
      (answers.associations as Record<string, string>) ?? {},
      { fr: "Conséquence correcte", en: "Correct consequence" },
      { fr: "Conséquence incorrecte", en: "Incorrect consequence" },
      (label) => ({
        fr: `Preuve « ${label.fr} » bien associée.`,
        en: `Evidence “${label.en}” correctly associated.`,
      }),
      (label) => ({
        fr: `Revoir la conséquence de « ${label.fr} ».`,
        en: `Revisit the consequence of “${label.en}”.`,
      }),
    );
    const c4 = scoreTrueFalse(M5_PREP_TRUE_FALSE, (answers.trueFalse as Record<string, boolean>) ?? {});
    partScores.traffic = c1.score;
    partScores.stockBase = c2.score;
    partScores.associations = c3.score;
    partScores.trueFalse = c4.score;
    feedback.push(...c1.feedback, ...c2.feedback, ...c3.feedback, ...c4.feedback);
    return {
      formativeScore: clampScore((c1.score + c2.score + c3.score + c4.score) / 4),
      feedback,
      partScores,
    };
  }

  // M5 consolidation
  const c1 = scoreMapExact(
    M5_CONS_EVIDENCE_COLORS.map((e) => ({
      id: e.id,
      expected: e.color,
      label: e.label,
    })),
    (answers.evidenceColors as Record<string, string>) ?? {},
    { fr: "Preuve bien classée", en: "Evidence correctly classified" },
    { fr: "Preuve mal classée", en: "Evidence misclassified" },
    (label) => ({
      fr: `« ${label.fr} » est correctement coloré.`,
      en: `“${label.en}” is correctly colored.`,
    }),
    (label) => ({
      fr: `Reclasser « ${label.fr} » (Vert / Ambre / Rouge).`,
      en: `Reclassify “${label.en}” (Green / Amber / Red).`,
    }),
  );
  const c2 = scoreOrdering(
    [...M5_CONS_PATH],
    (answers.ordering as string[]) ?? [],
    M5_CONS_PATH_LABELS as unknown as Record<string, LocalizedText>,
  );
  const c3 = scoreMapExact(
    M5_CONS_ASSOC.map((a) => ({
      id: a.id,
      expected: a.decisionId,
      label: a.evidence,
    })),
    (answers.associations as Record<string, string>) ?? {},
    { fr: "Décision associée correcte", en: "Correct associated decision" },
    { fr: "Décision associée incorrecte", en: "Incorrect associated decision" },
    (label) => ({
      fr: `Preuve « ${label.fr} » liée à la bonne décision.`,
      en: `Evidence “${label.en}” linked to the right decision.`,
    }),
    (label) => ({
      fr: `Revoir la décision pour « ${label.fr} ».`,
      en: `Revisit the decision for “${label.en}”.`,
    }),
  );
  const c4 = scoreTrueFalse(M5_CONS_TRUE_FALSE, (answers.trueFalse as Record<string, boolean>) ?? {});
  const c5 = scoreMapExact(
    M5_CONS_ACTIONS.map((a) => ({
      id: a.id,
      expected: a.bucket,
      label: a.label,
    })),
    (answers.actionBuckets as Record<string, string>) ?? {},
    { fr: "Action bien classée", en: "Action correctly classified" },
    { fr: "Action mal classée", en: "Action misclassified" },
    (label) => ({
      fr: `« ${label.fr} » est au bon statut (maintenir / surveiller / rejeter).`,
      en: `“${label.en}” is in the right status (maintain / monitor / reject).`,
    }),
    (label) => ({
      fr: `Reclasser « ${label.fr} ».`,
      en: `Reclassify “${label.en}”.`,
    }),
  );
  partScores.evidenceColors = c1.score;
  partScores.ordering = c2.score;
  partScores.associations = c3.score;
  partScores.trueFalse = c4.score;
  partScores.actionBuckets = c5.score;
  feedback.push(...c1.feedback, ...c2.feedback, ...c3.feedback, ...c4.feedback, ...c5.feedback);
  return {
    formativeScore: clampScore((c1.score + c2.score + c3.score + c4.score + c5.score) / 5),
    feedback,
    partScores,
  };
}
