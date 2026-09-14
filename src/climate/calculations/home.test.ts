import { describe, expect, it } from "vitest";
import { calculateHome } from "./home";
import { emissionFactors, findFactor } from "../factors";
import type { ClimateProfile } from "../types";

const baseProfile: ClimateProfile["home"] = {
  electricityKwhPerMonth: 0,
  naturalGasThermsPerMonth: 0,
};

describe("calculateHome", () => {
  it("returns zero for zero usage", () => {
    const result = calculateHome(baseProfile, emissionFactors);
    expect(result.kgCo2ePerYear).toBe(0);
  });

  it("converts monthly electricity usage to yearly emissions", () => {
    const result = calculateHome({ ...baseProfile, electricityKwhPerMonth: 900 }, emissionFactors);
    const factor = findFactor(emissionFactors.home, "electricity_us_average");
    expect(result.kgCo2ePerYear).toBeCloseTo(900 * 12 * factor.co2ePerUnit);
  });

  it("handles missing (optional) natural gas usage as zero", () => {
    const result = calculateHome({ electricityKwhPerMonth: 500 }, emissionFactors);
    const gasBreakdown = result.breakdown.find((b) => b.id === "home_natural_gas")!;
    expect(gasBreakdown.kgCo2ePerYear).toBe(0);
  });

  it("adds natural gas emissions on top of electricity", () => {
    const electricityOnly = calculateHome({ ...baseProfile, electricityKwhPerMonth: 500 }, emissionFactors);
    const withGas = calculateHome(
      { electricityKwhPerMonth: 500, naturalGasThermsPerMonth: 40 },
      emissionFactors
    );
    expect(withGas.kgCo2ePerYear).toBeGreaterThan(electricityOnly.kgCo2ePerYear);
  });

  it("uses the selected country's grid factor instead of the US average", () => {
    const result = calculateHome(
      { ...baseProfile, electricityKwhPerMonth: 900, countryCode: "FR" },
      emissionFactors
    );
    const factor = findFactor(emissionFactors.home, "electricity_grid_fra");
    expect(result.kgCo2ePerYear).toBeCloseTo(900 * 12 * factor.co2ePerUnit);
  });

  it("falls back to the world average factor for an unrecognized country", () => {
    const result = calculateHome(
      { ...baseProfile, electricityKwhPerMonth: 900, countryCode: "OTHER" },
      emissionFactors
    );
    const factor = findFactor(emissionFactors.home, "electricity_grid_world");
    expect(result.kgCo2ePerYear).toBeCloseTo(900 * 12 * factor.co2ePerUnit);
  });
});
