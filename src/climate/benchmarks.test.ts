import { describe, expect, it } from "vitest";
import {
  perCapitaBenchmarkForCountry,
  worldPerCapitaBenchmark,
  treesToOffset,
  TREE_CO2_KG_PER_YEAR,
  gallonsOfGasolineFor,
  GASOLINE_CO2_KG_PER_GALLON,
  milesDrivenFor,
  DRIVING_CO2_KG_PER_MILE,
  homeElectricityYearsFor,
  HOME_ELECTRICITY_CO2_KG_PER_YEAR,
} from "./benchmarks";

describe("perCapitaBenchmarkForCountry", () => {
  it("returns the matching country's benchmark", () => {
    const result = perCapitaBenchmarkForCountry("FR");
    expect(result.countryCode).toBe("FR");
    expect(result.tonnesCo2ePerYear).toBeGreaterThan(0);
  });

  it("falls back to the world average for an unrecognized country", () => {
    const result = perCapitaBenchmarkForCountry("OTHER");
    expect(result).toEqual(worldPerCapitaBenchmark());
  });

  it("falls back to the world average when no country is given", () => {
    const result = perCapitaBenchmarkForCountry(undefined);
    expect(result).toEqual(worldPerCapitaBenchmark());
  });
});

describe("treesToOffset", () => {
  it("divides kg CO2e by the annual per-tree sequestration rate", () => {
    expect(treesToOffset(TREE_CO2_KG_PER_YEAR * 10)).toBeCloseTo(10);
  });

  it("never returns a negative count", () => {
    expect(treesToOffset(-500)).toBe(0);
  });

  it("returns zero for zero emissions", () => {
    expect(treesToOffset(0)).toBe(0);
  });
});

describe("gallonsOfGasolineFor", () => {
  it("divides kg CO2 by the per-gallon rate", () => {
    expect(gallonsOfGasolineFor(GASOLINE_CO2_KG_PER_GALLON * 5)).toBeCloseTo(5);
  });

  it("never returns a negative amount", () => {
    expect(gallonsOfGasolineFor(-100)).toBe(0);
  });
});

describe("milesDrivenFor", () => {
  it("divides kg CO2e by the per-mile rate", () => {
    expect(milesDrivenFor(DRIVING_CO2_KG_PER_MILE * 1000)).toBeCloseTo(1000);
  });

  it("never returns a negative amount", () => {
    expect(milesDrivenFor(-100)).toBe(0);
  });
});

describe("homeElectricityYearsFor", () => {
  it("divides kg CO2 by the annual per-home rate", () => {
    expect(homeElectricityYearsFor(HOME_ELECTRICITY_CO2_KG_PER_YEAR * 2)).toBeCloseTo(2);
  });

  it("never returns a negative amount", () => {
    expect(homeElectricityYearsFor(-100)).toBe(0);
  });
});
