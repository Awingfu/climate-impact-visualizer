import { describe, expect, it } from "vitest";
import { calculateFlights, ASSUMED_ROUND_TRIP_KM } from "./flights";
import { emissionFactors, findFactor } from "../factors";
import type { ClimateProfile } from "../types";

const baseProfile: ClimateProfile["flights"] = {
  domesticTripsPerYear: 0,
  internationalTripsPerYear: 0,
};

describe("calculateFlights", () => {
  it("returns zero for zero trips", () => {
    const result = calculateFlights(baseProfile, emissionFactors);
    expect(result.kgCo2ePerYear).toBe(0);
  });

  it("scales linearly with domestic trip count", () => {
    const one = calculateFlights({ ...baseProfile, domesticTripsPerYear: 1 }, emissionFactors);
    const three = calculateFlights({ ...baseProfile, domesticTripsPerYear: 3 }, emissionFactors);
    expect(three.kgCo2ePerYear).toBeCloseTo(one.kgCo2ePerYear * 3);
  });

  it("computes domestic trip emissions from the assumed distance and DEFRA factor", () => {
    const result = calculateFlights({ ...baseProfile, domesticTripsPerYear: 2 }, emissionFactors);
    const factor = findFactor(emissionFactors.flights, "flight_domestic_per_km");
    expect(result.kgCo2ePerYear).toBeCloseTo(2 * ASSUMED_ROUND_TRIP_KM.domestic * factor.co2ePerUnit);
  });

  it("weighs international trips more heavily than domestic trips", () => {
    const domestic = calculateFlights({ ...baseProfile, domesticTripsPerYear: 1 }, emissionFactors);
    const international = calculateFlights(
      { ...baseProfile, internationalTripsPerYear: 1 },
      emissionFactors
    );
    expect(international.kgCo2ePerYear).toBeGreaterThan(domestic.kgCo2ePerYear);
  });

  it("never returns negative emissions for negative input", () => {
    const result = calculateFlights({ domesticTripsPerYear: -2, internationalTripsPerYear: -1 }, emissionFactors);
    expect(result.kgCo2ePerYear).toBe(0);
  });
});
