import transportationData from "@/data/transportation.json";
import flightsData from "@/data/flights.json";
import electricityData from "@/data/electricity.json";
import foodData from "@/data/food.json";
import shoppingData from "@/data/shopping.json";
import type { EmissionFactor, EmissionFactors } from "./types";

/** All emission factors, normalized from local JSON. No runtime network requests. */
export const emissionFactors: EmissionFactors = {
  transportation: transportationData as EmissionFactor[],
  flights: flightsData as EmissionFactor[],
  home: electricityData as EmissionFactor[],
  food: foodData as EmissionFactor[],
  shopping: shoppingData as EmissionFactor[],
};

export function findFactor(factors: EmissionFactor[], id: string): EmissionFactor {
  const factor = factors.find((f) => f.id === id);
  if (!factor) {
    throw new Error(`Unknown emission factor id: ${id}`);
  }
  return factor;
}

export function allFactors(factors: EmissionFactors = emissionFactors): EmissionFactor[] {
  return [
    ...factors.transportation,
    ...factors.flights,
    ...factors.home,
    ...factors.food,
    ...factors.shopping,
  ];
}
