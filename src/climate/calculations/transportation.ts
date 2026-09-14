import type { ClimateProfile, EmissionFactors, EmissionResult } from "../types";
import { findFactor } from "../factors";
import { electricityCo2ePerKwh, electricityFactorIds } from "../geography";

const MONTHS_PER_YEAR = 12;

/**
 * Picks the driving emission factor id for a given vehicle/fuel combination.
 * Kept intentionally small for the MVP: gasoline cars are split by size class,
 * hybrids use a single blended factor, and electric vehicles are computed
 * from EV efficiency x the electricity grid factor rather than a fixed per-mile number.
 */
function carFactorId(vehicleType: ClimateProfile["transportation"]["vehicleType"], fuelType: ClimateProfile["transportation"]["fuelType"]): string {
  if (fuelType === "electric") return "ev_efficiency_kwh_per_mile";
  if (fuelType === "hybrid") return "car_hybrid";
  return vehicleType === "suv_truck" ? "car_suv_truck_gasoline" : "car_gasoline_average";
}

export function calculateTransportation(
  profile: ClimateProfile["transportation"],
  factors: EmissionFactors,
  /** Location selected on the home energy step, used for EV charging emissions. Defaults to the US average. */
  homeLocation?: Pick<ClimateProfile["home"], "countryCode" | "usStateCode">
): EmissionResult {
  const annualCarMiles = Math.max(0, profile.carMilesPerMonth) * MONTHS_PER_YEAR;
  const annualTransitMiles = Math.max(0, profile.publicTransitMilesPerMonth) * MONTHS_PER_YEAR;

  const factorId = carFactorId(profile.vehicleType, profile.fuelType);
  const transitFactor = findFactor(factors.transportation, "public_transit_average");

  let carKgCo2e: number;
  const carFactorIds: string[] = [factorId];

  if (profile.fuelType === "electric") {
    const evEfficiency = findFactor(factors.transportation, "ev_efficiency_kwh_per_mile");
    const electricityCo2ePerUnit = electricityCo2ePerKwh(homeLocation ?? {}, factors);
    carKgCo2e = annualCarMiles * evEfficiency.co2ePerUnit * electricityCo2ePerUnit;
    carFactorIds.push(...electricityFactorIds(homeLocation ?? {}));
  } else {
    const carFactor = findFactor(factors.transportation, factorId);
    carKgCo2e = annualCarMiles * carFactor.co2ePerUnit;
  }

  const transitKgCo2e = annualTransitMiles * transitFactor.co2ePerUnit;

  return {
    category: "transportation",
    kgCo2ePerYear: carKgCo2e + transitKgCo2e,
    breakdown: [
      {
        id: "transportation_car",
        label: "Driving",
        kgCo2ePerYear: carKgCo2e,
        factorIds: carFactorIds,
      },
      {
        id: "transportation_transit",
        label: "Public transit",
        kgCo2ePerYear: transitKgCo2e,
        factorIds: [transitFactor.id],
      },
    ],
  };
}
