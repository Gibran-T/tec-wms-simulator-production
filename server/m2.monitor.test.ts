import { describe, expect, it } from "vitest";
import { calculateInventory } from "./rulesEngine";
import { toScn007MonitorBusinessRows } from "./scn007";

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

  const scn007AfterSplit = [
    ...scn007Txs,
    {
      docType: "PUTAWAY",
      sku: "SKU-002",
      bin: "REC-01",
      qty: -500,
      posted: true,
      docRef: "PUT-L1",
    },
    {
      docType: "PUTAWAY",
      sku: "SKU-002",
      bin: "B-01-R1-L1",
      qty: 500,
      posted: true,
      docRef: "PUT-L1",
    },
    {
      docType: "PUTAWAY",
      sku: "SKU-002",
      bin: "REC-01",
      qty: -100,
      posted: true,
      docRef: "PUT-L2",
    },
    {
      docType: "PUTAWAY",
      sku: "SKU-002",
      bin: "B-01-R1-L2",
      qty: 100,
      posted: true,
      docRef: "PUT-L2",
    },
  ];

  it("SCN-006 preloaded ledger has 2 posted rows for monitor", () => {
    const posted = scn006Txs.filter((t) => t.posted);
    expect(posted).toHaveLength(2);
    expect(posted.map((t) => t.docRef)).toEqual(["PO-M2-001", "GR-M2-001"]);
    expect(calculateInventory(scn006Txs)["SKU-001::REC-01"]).toBe(150);
  });

  it("SCN-007 preloaded ledger is capacity-only (PO+GR 600, no FIFO preload)", () => {
    const posted = scn007Txs.filter((t) => t.posted);
    expect(posted).toHaveLength(2);
    expect(posted.map((t) => t.docRef)).toEqual(["PO-M2-002", "GR-M2-002"]);
    expect(posted.map((t) => t.docRef)).not.toContain("GR-M2-002-FIFO");
    expect(calculateInventory(scn007Txs)["SKU-002::REC-01"]).toBe(600);
    expect(calculateInventory(scn007Txs)["SKU-002::B-02-R1-L1"]).toBeUndefined();
  });

  it("SCN-007 after split shows two business PUTAWAY movements and total 600 in STOCKAGE", () => {
    const business = toScn007MonitorBusinessRows(scn007AfterSplit);
    const putaways = business.filter((r) => r.docType === "PUTAWAY");
    expect(putaways).toHaveLength(2);
    expect(putaways.map((p) => p.qty)).toEqual([500, 100]);
    expect(business.map((t) => t.docRef)).toEqual([
      "PO-M2-002",
      "GR-M2-002",
      "PUT-L1",
      "PUT-L2",
    ]);
    expect(scn007AfterSplit.some((t) => t.docRef === "GR-M2-002-FIFO")).toBe(false);
    const inv = calculateInventory(scn007AfterSplit);
    expect(inv["SKU-002::REC-01"]).toBe(0);
    expect(inv["SKU-002::B-01-R1-L1"]).toBe(500);
    expect(inv["SKU-002::B-01-R1-L2"]).toBe(100);
  });
});
