import type { ClimateProfile, EmissionFactors, EmissionResult } from "../types";
import { findFactor } from "../factors";

/**
 * Users report trips per year, not distances, so we need an assumed average
 * round-trip distance per trip type. These are estimation assumptions (documented
 * on /methodology), not published emission factors, and are kept separate from
 * the sourced DEFRA per-passenger-km factors in flights.json.
 */
export const ASSUMED_ROUND_TRIP_KM = {
  /** ~1,255 km average one-way US domestic flight (industry flight-distance data, 2024), round trip. */
  domestic: 2510,
  /** Representative long-haul international round trip (e.g. US-Europe or US-Asia). A rough assumption. */
  international: 12000,
} as const;

export function calculateFlights(
  profile: ClimateProfile["flights"],
  factors: EmissionFactors
): EmissionResult {
  const domesticTrips = Math.max(0, profile.domesticTripsPerYear);
  const internationalTrips = Math.max(0, profile.internationalTripsPerYear);

  const domesticFactor = findFactor(factors.flights, "flight_domestic_per_km");
  const longHaulFactor = findFactor(factors.flights, "flight_long_haul_per_km");

  const domesticKgCo2e = domesticTrips * ASSUMED_ROUND_TRIP_KM.domestic * domesticFactor.co2ePerUnit;
  const internationalKgCo2e =
    internationalTrips * ASSUMED_ROUND_TRIP_KM.international * longHaulFactor.co2ePerUnit;

  return {
    category: "flights",
    kgCo2ePerYear: domesticKgCo2e + internationalKgCo2e,
    breakdown: [
      {
        id: "flights_domestic",
        label: "Domestic flights",
        kgCo2ePerYear: domesticKgCo2e,
        factorIds: [domesticFactor.id],
      },
      {
        id: "flights_international",
        label: "International flights",
        kgCo2ePerYear: internationalKgCo2e,
        factorIds: [longHaulFactor.id],
      },
    ],
  };
}
