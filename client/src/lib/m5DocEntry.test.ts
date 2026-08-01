import { describe, expect, it } from "vitest";
import { pickM5DocEntryScenario, resolveM5ModuleScenariosForActor } from "./m5DocEntry";

const legacy = [
  { id: 37, moduleId: 5, name: "M5 — Scénario 1", isActive: true },
  { id: 38, moduleId: 5, name: "M5 — Scénario 2", isActive: true },
  { id: 39, moduleId: 5, name: "M5 — Scénario 3", isActive: true },
];

const doc = {
  id: 86,
  moduleId: 5,
  name: "M5-DOC — SCN-015-DOC : Ouvrir et superviser une demande",
  isActive: true,
  initialStateJson: {
    interactionModel: "supervision-doc-v1",
    scnCode: "SCN-015-DOC",
    module: 5,
  },
};

describe("m5DocEntry routing", () => {
  it("picks cumulative DOC entry with 70% target", () => {
    const entry = pickM5DocEntryScenario([...legacy, doc]);
    expect(entry?.id).toBe(86);
    expect(entry?.targetScore).toBe(70);
    expect(entry?.name).toMatch(/Superviseur d'exploitation/);
  });

  it("routes allowlisted students to DOC entry only", () => {
    const rows = resolveM5ModuleScenariosForActor([...legacy, doc], {
      docFeatureEnabled: true,
      studentAllowlisted: true,
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe(86);
  });

  it("keeps legacy board for non-allowlisted students", () => {
    const rows = resolveM5ModuleScenariosForActor([...legacy, doc], {
      docFeatureEnabled: true,
      studentAllowlisted: false,
    });
    expect(rows.map((r) => r.id).sort()).toEqual([37, 38, 39]);
  });
});
