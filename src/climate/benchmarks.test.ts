import { describe, expect, it } from "vitest";
import {
  perCapitaBenchmarkForCountry,
  worldPerCapitaBenchmark,
  treesToOffset,
  TREE_CO2_KG_PER_YEAR,
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
