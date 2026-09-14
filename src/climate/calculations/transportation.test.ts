import { describe, expect, it } from "vitest";
import { calculateTransportation } from "./transportation";
import { emissionFactors, findFactor } from "../factors";
import type { ClimateProfile } from "../types";

const baseProfile: ClimateProfile["transportation"] = {
  carMilesPerMonth: 0,
  vehicleType: "car",
  fuelType: "gasoline",
  publicTransitMilesPerMonth: 0,
};

describe("calculateTransportation", () => {
  it("returns zero for zero activity", () => {
    const result = calculateTransportation(baseProfile, emissionFactors);
    expect(result.kgCo2ePerYear).toBe(0);
  });

  it("converts monthly gasoline car miles to yearly emissions", () => {
    const result = calculateTransportation(
      { ...baseProfile, carMilesPerMonth: 500 },
      emissionFactors
    );
    const factor = findFactor(emissionFactors.transportation, "car_gasoline_average");
    expect(result.kgCo2ePerYear).toBeCloseTo(500 * 12 * factor.co2ePerUnit);
  });

  it("uses a higher factor for SUVs/trucks than the average car", () => {
    const car = calculateTransportation({ ...baseProfile, carMilesPerMonth: 500 }, emissionFactors);
    const suv = calculateTransportation(
      { ...baseProfile, carMilesPerMonth: 500, vehicleType: "suv_truck" },
      emissionFactors
    );
    expect(suv.kgCo2ePerYear).toBeGreaterThan(car.kgCo2ePerYear);
  });

  it("computes electric vehicle emissions from EV efficiency x grid factor", () => {
    const result = calculateTransportation(
      { ...baseProfile, carMilesPerMonth: 500, fuelType: "electric" },
      emissionFactors
    );
    const ev = findFactor(emissionFactors.transportation, "ev_efficiency_kwh_per_mile");
    const grid = findFactor(emissionFactors.home, "electricity_us_average");
    expect(result.kgCo2ePerYear).toBeCloseTo(500 * 12 * ev.co2ePerUnit * grid.co2ePerUnit);
  });

  it("uses the selected home country's grid factor for EV charging", () => {
    const result = calculateTransportation(
      { ...baseProfile, carMilesPerMonth: 500, fuelType: "electric" },
      emissionFactors,
      "FR"
    );
    const ev = findFactor(emissionFactors.transportation, "ev_efficiency_kwh_per_mile");
    const grid = findFactor(emissionFactors.home, "electricity_grid_fra");
    expect(result.kgCo2ePerYear).toBeCloseTo(500 * 12 * ev.co2ePerUnit * grid.co2ePerUnit);
  });

  it("includes public transit emissions separately in the breakdown", () => {
    const result = calculateTransportation(
      { ...baseProfile, publicTransitMilesPerMonth: 100 },
      emissionFactors
    );
    const transit = result.breakdown.find((b) => b.id === "transportation_transit")!;
    expect(transit.kgCo2ePerYear).toBeGreaterThan(0);
    expect(result.kgCo2ePerYear).toBeCloseTo(transit.kgCo2ePerYear);
  });

  it("never returns negative emissions for negative input", () => {
    const result = calculateTransportation({ ...baseProfile, carMilesPerMonth: -100 }, emissionFactors);
    expect(result.kgCo2ePerYear).toBe(0);
  });
});
