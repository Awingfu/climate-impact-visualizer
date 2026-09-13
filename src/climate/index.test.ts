import { describe, expect, it } from "vitest";
import {
  calculateTotalFootprint,
  calculateScenario,
  getBiggestOpportunities,
  defaultProfile,
  emissionFactors,
} from "./index";
import type { ClimateProfile } from "./types";

const zeroProfile: ClimateProfile = {
  transportation: { carMilesPerMonth: 0, vehicleType: "car", fuelType: "gasoline", publicTransitMilesPerMonth: 0 },
  flights: { domesticTripsPerYear: 0, internationalTripsPerYear: 0 },
  home: { electricityKwhPerMonth: 0, naturalGasThermsPerMonth: 0 },
  food: { beefMealsPerWeek: 0, chickenMealsPerWeek: 0, vegetarianMealsPerWeek: 0, veganMealsPerWeek: 0 },
  shopping: { clothingItemsPerMonth: 0, electronicsPerYear: 0 },
};

describe("calculateTotalFootprint", () => {
  it("returns zero across the board for an all-zero profile", () => {
    const result = calculateTotalFootprint(zeroProfile);
    expect(result.totalKgCo2ePerYear).toBe(0);
    expect(result.largestCategory).toBeNull();
    for (const category of result.categories) {
      expect(category.kgCo2ePerYear).toBe(0);
    }
  });

  it("sums all five categories for a typical profile", () => {
    const result = calculateTotalFootprint(defaultProfile);
    const sum = result.categories.reduce((acc, c) => acc + c.kgCo2ePerYear, 0);
    expect(result.totalKgCo2ePerYear).toBeCloseTo(sum);
    expect(result.categories).toHaveLength(5);
  });

  it("identifies the largest category and ranks categories descending", () => {
    const result = calculateTotalFootprint(defaultProfile);
    expect(result.rankedCategories[0].kgCo2ePerYear).toBeGreaterThanOrEqual(
      result.rankedCategories[1].kgCo2ePerYear
    );
    expect(result.largestCategory?.category).toBe(result.rankedCategories[0].category);
  });

  it("computes category percentages that sum to ~100", () => {
    const result = calculateTotalFootprint(defaultProfile);
    const total = Object.values(result.categoryPercentages).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(100, 5);
  });

  it("is deterministic for the same profile", () => {
    const a = calculateTotalFootprint(defaultProfile);
    const b = calculateTotalFootprint(defaultProfile);
    expect(a.totalKgCo2ePerYear).toBe(b.totalKgCo2ePerYear);
  });
});

describe("calculateScenario", () => {
  it("reports zero reduction when baseline equals scenario", () => {
    const result = calculateScenario(defaultProfile, defaultProfile);
    expect(result.reductionKgCo2e).toBe(0);
    expect(result.reductionPercent).toBe(0);
  });

  it("reports a positive reduction when driving less", () => {
    const scenarioProfile: ClimateProfile = {
      ...defaultProfile,
      transportation: {
        ...defaultProfile.transportation,
        carMilesPerMonth: defaultProfile.transportation.carMilesPerMonth * 0.7,
      },
    };
    const result = calculateScenario(defaultProfile, scenarioProfile);
    expect(result.reductionKgCo2e).toBeGreaterThan(0);
    expect(result.reductionPercent).toBeGreaterThan(0);
    expect(result.scenarioKgCo2e).toBeLessThan(result.baselineKgCo2e);
  });

  it("reports a negative reduction (increase) when a scenario adds emissions", () => {
    const scenarioProfile: ClimateProfile = {
      ...defaultProfile,
      flights: { ...defaultProfile.flights, internationalTripsPerYear: defaultProfile.flights.internationalTripsPerYear + 2 },
    };
    const result = calculateScenario(defaultProfile, scenarioProfile);
    expect(result.reductionKgCo2e).toBeLessThan(0);
  });

  it("handles an all-zero baseline without dividing by zero", () => {
    const result = calculateScenario(zeroProfile, zeroProfile, emissionFactors);
    expect(result.reductionPercent).toBe(0);
    expect(Number.isNaN(result.reductionPercent)).toBe(false);
  });
});

describe("getBiggestOpportunities", () => {
  it("returns opportunities sorted by descending reduction", () => {
    const opportunities = getBiggestOpportunities(defaultProfile);
    expect(opportunities.length).toBeGreaterThan(0);
    for (let i = 1; i < opportunities.length; i++) {
      expect(opportunities[i - 1].reductionKgCo2ePerYear).toBeGreaterThanOrEqual(
        opportunities[i].reductionKgCo2ePerYear
      );
    }
  });

  it("excludes opportunities that do not apply to a zero profile", () => {
    const opportunities = getBiggestOpportunities(zeroProfile);
    expect(opportunities).toHaveLength(0);
  });

  it("respects the limit parameter", () => {
    const opportunities = getBiggestOpportunities(defaultProfile, emissionFactors, 2);
    expect(opportunities.length).toBeLessThanOrEqual(2);
  });
});
