import { describe, expect, it } from "vitest";
import { calculateFood } from "./food";
import { emissionFactors, findFactor } from "../factors";
import type { ClimateProfile } from "../types";

const baseProfile: ClimateProfile["food"] = {
  beefMealsPerWeek: 0,
  chickenMealsPerWeek: 0,
  vegetarianMealsPerWeek: 0,
  veganMealsPerWeek: 0,
};

describe("calculateFood", () => {
  it("returns zero for zero meals", () => {
    const result = calculateFood(baseProfile, emissionFactors);
    expect(result.kgCo2ePerYear).toBe(0);
  });

  it("converts weekly beef meals to yearly emissions", () => {
    const result = calculateFood({ ...baseProfile, beefMealsPerWeek: 3 }, emissionFactors);
    const factor = findFactor(emissionFactors.food, "meal_beef");
    expect(result.kgCo2ePerYear).toBeCloseTo(3 * 52 * factor.co2ePerUnit);
  });

  it("ranks beef meals as more carbon-intensive than vegan meals for the same frequency", () => {
    const beef = calculateFood({ ...baseProfile, beefMealsPerWeek: 5 }, emissionFactors);
    const vegan = calculateFood({ ...baseProfile, veganMealsPerWeek: 5 }, emissionFactors);
    expect(beef.kgCo2ePerYear).toBeGreaterThan(vegan.kgCo2ePerYear);
  });

  it("sums emissions across all four meal categories", () => {
    const result = calculateFood(
      { beefMealsPerWeek: 1, chickenMealsPerWeek: 1, vegetarianMealsPerWeek: 1, veganMealsPerWeek: 1 },
      emissionFactors
    );
    const sum = result.breakdown.reduce((acc, b) => acc + b.kgCo2ePerYear, 0);
    expect(result.kgCo2ePerYear).toBeCloseTo(sum);
  });
});
