import { describe, expect, it } from "vitest";
import { getRotationBand } from "@/components/m5/m5KpiDisplayUtils";
import { getModuleById } from "@/data/modules";
import { ANNEXE_A_KPI_GUIDE } from "@/data/m4KpiControlTower";
import { rotationBandLabel } from "@/data/m4KpiBandUtils";
import {
  M4_ROTATION_BAND_WORDING_FR,
  M4_ROTATION_BAND_WORDING_SHORT_FR,
  M4_ROTATION_FORBIDDEN_FR,
  M4_ROTATION_HIGH_PEDAGOGY_FR,
} from "@/data/m4RotationBandWording";

describe("M4 rotation band wording hotfix", () => {
  it("classifies 6× as normal band", () => {
    expect(getRotationBand(6)).toBe("normal");
    expect(rotationBandLabel("normal", "FR")).toBe("Normal (4–12×/an)");
  });

  it("classifies 3× as overstock risk (low turnover)", () => {
    expect(getRotationBand(3)).toBe("critical");
    const label = rotationBandLabel("surstock", "FR");
    expect(label).toMatch(/risque de surstock/i);
    expect(label).toMatch(/<4×/);
    expect(label).not.toMatch(/sous-performance/);
  });

  it("classifies 15× as high turnover / tight-stock risk", () => {
    expect(getRotationBand(15)).toBe("critical");
    const label = rotationBandLabel("sous-performance", "FR");
    expect(label).toMatch(/stock trop serré|rotation élevée/i);
    expect(label).toMatch(/>12×/);
    expect(label).not.toMatch(/sous-performance/);
  });

  it("M4 slide 2 uses risk framing (not categorical sous-performance)", () => {
    const slide2 = getModuleById(4)?.slides?.find((s) => s.id === 2);
    expect(slide2).toBeTruthy();
    const body = (slide2!.bodyFr ?? []).join("\n");
    expect(body).toContain(M4_ROTATION_BAND_WORDING_FR);
    expect(body).toContain(M4_ROTATION_HIGH_PEDAGOGY_FR);
    for (const forbidden of M4_ROTATION_FORBIDDEN_FR) {
      expect(body).not.toContain(forbidden);
    }
    expect(body).not.toMatch(/>12 sous-performance/);
    expect(body).not.toMatch(/<4 surstock/);
  });

  it("Annexe A rotation row uses risk wording aligned with short form", () => {
    const rotationRow = ANNEXE_A_KPI_GUIDE.rows[0];
    expect(rotationRow.kpi.fr).toMatch(/rotation/i);
    expect(rotationRow.critical.fr).toMatch(/risque de surstock/i);
    expect(rotationRow.excellent.fr).toMatch(/risque stock trop serré|rotation élevée/i);
    expect(rotationRow.excellent.fr).not.toMatch(/sous-performance/);
    expect(rotationRow.critical.fr).not.toMatch(/sous-performance/);
    expect(M4_ROTATION_BAND_WORDING_SHORT_FR).toMatch(/risque de surstock/);
    expect(M4_ROTATION_BAND_WORDING_SHORT_FR).toMatch(/risque de stock trop serré/);
  });

  it("no client M4 display label exposes categorical sous-performance wording", () => {
    expect(rotationBandLabel("sous-performance", "FR")).not.toContain("sous-performance");
    expect(rotationBandLabel("sous-performance", "EN")).not.toMatch(/under-performance|underperformance/i);
  });
});
