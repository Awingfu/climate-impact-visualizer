import { describe, expect, it } from "vitest";
import { calculateShopping } from "./shopping";
import { emissionFactors, findFactor } from "../factors";
import type { ClimateProfile } from "../types";

const baseProfile: ClimateProfile["shopping"] = {
  clothingItemsPerMonth: 0,
  electronicsPerYear: 0,
};

describe("calculateShopping", () => {
  it("returns zero for zero purchases", () => {
    const result = calculateShopping(baseProfile, emissionFactors);
    expect(result.kgCo2ePerYear).toBe(0);
  });

  it("converts monthly clothing purchases to yearly emissions", () => {
    const result = calculateShopping({ ...baseProfile, clothingItemsPerMonth: 2 }, emissionFactors);
    const factor = findFactor(emissionFactors.shopping, "clothing_item");
    expect(result.kgCo2ePerYear).toBeCloseTo(2 * 12 * factor.co2ePerUnit);
  });

  it("treats electronics purchases as already annual (no monthly conversion)", () => {
    const result = calculateShopping({ ...baseProfile, electronicsPerYear: 2 }, emissionFactors);
    const factor = findFactor(emissionFactors.shopping, "electronics_item");
    expect(result.kgCo2ePerYear).toBeCloseTo(2 * factor.co2ePerUnit);
  });
});
