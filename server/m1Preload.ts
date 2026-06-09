/**
 * M1 preloaded scenario bootstrap — marks steps already satisfied by seed state.
 */

type PreloadedTx = {
  docType: string;
  posted?: boolean;
};

export function getM1StepsToAutoComplete(preloaded: PreloadedTx[]): string[] {
  const steps: string[] = [];
  const hasPosted = (type: string) => preloaded.some((t) => t.docType === type && t.posted);
  if (hasPosted("PO")) steps.push("PO");
  if (hasPosted("GR")) steps.push("GR");
  return steps;
}
