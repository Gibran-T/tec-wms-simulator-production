/** Refusal templates — Manifesto §6.6 (FR/EN bilingual parity) */

export const REFUSAL_DIRECT_ANSWER = {
  fr: "En mode professionnel, je ne peux pas fournir la réponse directe. Qu'observez-vous dans le moniteur ou le cockpit en ce moment?",
  en: "In professional mode, I cannot provide the direct answer. What do you observe in the monitor or cockpit right now?",
};

export const REFUSAL_OPERATIONAL_COLLEAGUE = {
  fr: "Je ne peux pas te donner la valeur à saisir ni exécuter la mission à ta place. Consulte la Fiche Mission, le cockpit et les preuves opérationnelles — qu'est-ce que tu observes?",
  en: "I cannot give you the value to enter or execute the mission for you. Consult the Mission Sheet, cockpit, and operational evidence — what do you observe?",
};

export const REFUSAL_LOT_REQUEST = {
  fr: "Je ne peux pas te donner la valeur à saisir. Consulte les données opérationnelles de la mission et identifie le lot associé à la réception.",
  en: "I cannot give you the value to enter. Consult the mission operational data and identify the lot linked to the receipt.",
};

export const REFUSAL_BIN_REQUEST = {
  fr: "Je ne peux pas indiquer l'emplacement exact. Quels critères de rangement ou de traçabilité t'aideraient à choisir un emplacement conforme?",
  en: "I cannot indicate the exact bin. What putaway or traceability criteria would help you choose a compliant location?",
};

export const REFUSAL_QUANTITY_REQUEST = {
  fr: "Je ne peux pas te donner la quantité à saisir. Quelle preuve documentaire ou cockpit te permet de la déterminer toi-même?",
  en: "I cannot give you the quantity to enter. What documentary or cockpit evidence lets you determine it yourself?",
};

export const REFUSAL_TRANSACTION_SEQUENCE = {
  fr: "Je ne peux pas te donner la séquence d'exécution. Regarde l'état actuel du cockpit : quel document est déjà posté et quelle opération reste nécessaire pour stabiliser le flux?",
  en: "I cannot give you the execution sequence. Look at the current cockpit state: which document is already posted and which operation is still needed to stabilize the flow?",
};

export const REFUSAL_COMPLETE_FOR_ME = {
  fr: "Je ne peux pas compléter la mission à ta place — tu restes responsable de la décision. Quelle étape te bloque et quelle preuve as-tu déjà consultée?",
  en: "I cannot complete the mission for you — you remain responsible for the decision. Which step blocks you and what evidence have you already consulted?",
};

export const REFUSAL_HINT_BUDGET = {
  fr: "Vous avez atteint la limite d'indices pour cette étape. Consultez votre enseignant ou la Fiche Mission.",
  en: "You have reached the hint limit for this step. Consult your instructor or the Mission Sheet.",
};

export const REFUSAL_CERTIFICATION = {
  fr: "Aucun responsable Concorde Logistics n'est disponible pendant cette session — jugement professionnel indépendant requis. Un débrief sera disponible après la mission.",
  en: "No Concorde Logistics supervisor is available during this session — independent professional judgment is required. A debrief will be available after the mission.",
};

export const REFUSAL_COHORT_DISABLED = {
  fr: "La consultation interne est désactivée pour votre cohorte. Consultez la Fiche Mission et le panneau OIL F.",
  en: "Internal consultation is disabled for your cohort. Consult the Mission Sheet and OIL Panel F.",
};

export const REFUSAL_NOT_INTEGRATED = {
  fr: "Votre responsable Concorde Logistics sera bientôt disponible. En attendant, utilisez la Fiche Mission, le moniteur et le panneau OIL.",
  en: "Your Concorde Logistics supervisor will be available soon. Meanwhile, use the Mission Sheet, monitor, and OIL panel.",
};

export const REFUSAL_UI_BYPASS = {
  fr: "Je ne guide pas les clics — je développe votre jugement. Quelle décision professionnelle envisagez-vous et sur quelle preuve?",
  en: "I don't guide clicks — I develop your judgment. What professional decision are you considering, and on what evidence?",
};
