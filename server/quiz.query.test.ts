/**
 * RC12 Wave 2 hotfix — quiz query ordering must not throw (score.desc is invalid in Drizzle).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Quiz query builder — RC12 hotfix", () => {
  it("db.ts uses desc(quizAttempts.score) not quizAttempts.score.desc()", () => {
    const source = readFileSync(resolve(__dirname, "db.ts"), "utf8");
    expect(source).toContain("desc(quizAttempts.score)");
    expect(source).not.toMatch(/quizAttempts\.score\.desc\(\)/);
  });

  it("checkQuizPassed remains available for certification display (not runs.start gate)", () => {
    const source = readFileSync(resolve(__dirname, "db.ts"), "utf8");
    expect(source).toContain("export async function checkQuizPassed");
    expect(source).toContain("export async function checkM1QuizPassed");
  });
});
