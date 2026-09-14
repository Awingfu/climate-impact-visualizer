import type { ClimateProfile, EmissionFactors, EmissionResult } from "../types";
import { findFactor } from "../factors";
import { electricityCo2ePerKwh, electricityFactorIds } from "../geography";

const MONTHS_PER_YEAR = 12;

export function calculateHome(
  profile: ClimateProfile["home"],
  factors: EmissionFactors
): EmissionResult {
  const annualKwh = Math.max(0, profile.electricityKwhPerMonth) * MONTHS_PER_YEAR;
  const annualTherms = Math.max(0, profile.naturalGasThermsPerMonth ?? 0) * MONTHS_PER_YEAR;

  const electricityCo2ePerUnit = electricityCo2ePerKwh(profile, factors);
  const gasFactor = findFactor(factors.home, "natural_gas_therm");

  const electricityKgCo2e = annualKwh * electricityCo2ePerUnit;
  const gasKgCo2e = annualTherms * gasFactor.co2ePerUnit;

  return {
    category: "home",
    kgCo2ePerYear: electricityKgCo2e + gasKgCo2e,
    breakdown: [
      {
        id: "home_electricity",
        label: "Electricity",
        kgCo2ePerYear: electricityKgCo2e,
        factorIds: electricityFactorIds(profile),
      },
      {
        id: "home_natural_gas",
        label: "Natural gas",
        kgCo2ePerYear: gasKgCo2e,
        factorIds: [gasFactor.id],
      },
    ],
  };
}
