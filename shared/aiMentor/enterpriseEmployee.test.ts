import { describe, expect, it } from "vitest";
import {
  FORBIDDEN_STUDENT_AI_TERMS,
  getEnterpriseEmployeeForLanguage,
  getEnterpriseEmployeeProfile,
} from "./enterpriseEmployee";
import { resolvePersonaForScenario } from "./personaMap";

describe("RC23-E — enterprise employee immersion", () => {
  it("maps M1 receiving to Marc-André Tremblay", () => {
    const persona = resolvePersonaForScenario("SCN-001", 1);
    const employee = getEnterpriseEmployeeForLanguage(persona, "fr");
    expect(employee.name).toBe("Marc-André Tremblay");
    expect(employee.title).toBe("Superviseur d'entrepôt");
    expect(employee.department).toBe("Entrepôt");
    expect(employee.consultButtonLabel).toBe("Consulter Marc-André");
  });

  it("maps M2 putaway to Marc-André Tremblay", () => {
    const persona = resolvePersonaForScenario("SCN-006", 2);
    const employee = getEnterpriseEmployeeForLanguage(persona, "fr");
    expect(employee.name).toBe("Marc-André Tremblay");
  });

  it("maps M3 inventory to Sophie Bouchard", () => {
    const persona = resolvePersonaForScenario("SCN-009", 3);
    const employee = getEnterpriseEmployeeForLanguage(persona, "fr");
    expect(employee.name).toBe("Sophie Bouchard");
    expect(employee.title).toBe("Responsable inventaire");
    expect(employee.department).toBe("Inventaire");
    expect(employee.consultButtonLabel).toBe("Consulter Sophie");
  });

  it("maps M4 operations to Élise Beaumont", () => {
    const persona = resolvePersonaForScenario("SCN-012", 4);
    const employee = getEnterpriseEmployeeForLanguage(persona, "fr");
    expect(employee.name).toBe("Élise Beaumont");
    expect(employee.title).toBe("Directrice des opérations");
    expect(employee.department).toBe("Opérations");
    expect(employee.consultButtonLabel).toBe("Consulter Élise");
  });

  it("maps M5 integrated simulation by scenario binding", () => {
    const crisisPersona = resolvePersonaForScenario("SCN-017", 5);
    expect(getEnterpriseEmployeeProfile(crisisPersona).name).toBe("Élise Beaumont");

    const floorPersona = resolvePersonaForScenario("SCN-015", 5);
    expect(getEnterpriseEmployeeProfile(floorPersona).name).toBe("Marc-André Tremblay");
  });

  it("never exposes forbidden AI vocabulary in student-facing employee strings", () => {
    const personas = [
      resolvePersonaForScenario("SCN-001", 1),
      resolvePersonaForScenario("SCN-009", 3),
      resolvePersonaForScenario("SCN-012", 4),
      resolvePersonaForScenario("SCN-017", 5),
    ];

    for (const persona of personas) {
      for (const lang of ["fr", "en"] as const) {
        const employee = getEnterpriseEmployeeForLanguage(persona, lang);
        const bundle = [
          employee.name,
          employee.title,
          employee.department,
          employee.consultButtonLabel,
          employee.availabilityNote,
        ].join(" ");
        expect(bundle).not.toMatch(FORBIDDEN_STUDENT_AI_TERMS);
        expect(bundle).not.toMatch(/chatbot|assistant|openai|mentor ia/i);
      }
    }
  });

  it("provides avatar initials for each employee", () => {
    expect(getEnterpriseEmployeeForLanguage("FLOOR_MENTOR", "en").avatarInitials).toBe("MT");
    expect(getEnterpriseEmployeeForLanguage("INVENTORY_ADVISOR", "en").avatarInitials).toBe("SB");
    expect(getEnterpriseEmployeeForLanguage("PERFORMANCE_COACH", "en").avatarInitials).toBe("EB");
  });
});
