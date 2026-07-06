import { describe, expect, it, afterEach } from "vitest";
import { getStudentEntryPath, isConcordeConnectEnabled } from "./concordeConnect";

describe("RC20-A.1 — Concorde Connect feature gate", () => {
  const original = import.meta.env.VITE_ENABLE_CONCORDE_CONNECT;

  afterEach(() => {
    import.meta.env.VITE_ENABLE_CONCORDE_CONNECT = original;
  });

  it("defaults OFF when env var is unset", () => {
    import.meta.env.VITE_ENABLE_CONCORDE_CONNECT = undefined;
    expect(isConcordeConnectEnabled()).toBe(false);
  });

  it("defaults OFF when env var is not true", () => {
    import.meta.env.VITE_ENABLE_CONCORDE_CONNECT = "false";
    expect(isConcordeConnectEnabled()).toBe(false);
  });

  it("enables only when explicitly true", () => {
    import.meta.env.VITE_ENABLE_CONCORDE_CONNECT = "true";
    expect(isConcordeConnectEnabled()).toBe(true);
  });

  it("routes students to connect when enabled", () => {
    import.meta.env.VITE_ENABLE_CONCORDE_CONNECT = "true";
    expect(getStudentEntryPath()).toBe("/student/connect");
  });

  it("routes students to scenarios when disabled", () => {
    import.meta.env.VITE_ENABLE_CONCORDE_CONNECT = "false";
    expect(getStudentEntryPath()).toBe("/student/scenarios");
  });
});
