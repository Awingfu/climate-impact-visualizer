import type { ClimateProfile, EmissionFactors, EmissionResult } from "../types";
import { findFactor } from "../factors";
import { electricityFactorIdForCountry } from "../geography";

const MONTHS_PER_YEAR = 12;

export function calculateHome(
  profile: ClimateProfile["home"],
  factors: EmissionFactors
): EmissionResult {
  const annualKwh = Math.max(0, profile.electricityKwhPerMonth) * MONTHS_PER_YEAR;
  const annualTherms = Math.max(0, profile.naturalGasThermsPerMonth ?? 0) * MONTHS_PER_YEAR;

  const electricityFactor = findFactor(factors.home, electricityFactorIdForCountry(profile.countryCode));
  const gasFactor = findFactor(factors.home, "natural_gas_therm");

  const electricityKgCo2e = annualKwh * electricityFactor.co2ePerUnit;
  const gasKgCo2e = annualTherms * gasFactor.co2ePerUnit;

  return {
    category: "home",
    kgCo2ePerYear: electricityKgCo2e + gasKgCo2e,
    breakdown: [
      {
        id: "home_electricity",
        label: "Electricity",
        kgCo2ePerYear: electricityKgCo2e,
        factorIds: [electricityFactor.id],
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
