import { describe, expect, it } from "vitest";
import { calculateInventory } from "./rulesEngine";

/** Monitor reads the same transaction ledger as runs.state.inventory. */
describe("M2 monitor transaction alignment", () => {
  const scn006Txs = [
    { docType: "PO", sku: "SKU-001", bin: "REC-01", qty: 150, posted: true, docRef: "PO-M2-001" },
    { docType: "GR", sku: "SKU-001", bin: "REC-01", qty: 150, posted: true, docRef: "GR-M2-001" },
  ];

  const scn007Txs = [
    { docType: "PO", sku: "SKU-002", bin: "REC-01", qty: 600, posted: true, docRef: "PO-M2-002" },
    { docType: "GR", sku: "SKU-002", bin: "REC-01", qty: 600, posted: true, docRef: "GR-M2-002" },
  ];

  it("SCN-006 preloaded ledger has 2 posted rows for monitor", () => {
    const posted = scn006Txs.filter((t) => t.posted);
    expect(posted).toHaveLength(2);
    expect(posted.map((t) => t.docRef)).toEqual(["PO-M2-001", "GR-M2-001"]);
    expect(calculateInventory(scn006Txs)["SKU-001::REC-01"]).toBe(150);
  });

  it("SCN-007 preloaded ledger has 2 posted rows for monitor", () => {
    const posted = scn007Txs.filter((t) => t.posted);
    expect(posted).toHaveLength(2);
    expect(posted.map((t) => t.docRef)).toEqual(["PO-M2-002", "GR-M2-002"]);
    expect(calculateInventory(scn007Txs)["SKU-002::REC-01"]).toBe(600);
  });
});
