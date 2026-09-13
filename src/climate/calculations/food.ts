import type { ClimateProfile, EmissionFactors, EmissionResult } from "../types";
import { findFactor } from "../factors";

const WEEKS_PER_YEAR = 52;

export function calculateFood(
  profile: ClimateProfile["food"],
  factors: EmissionFactors
): EmissionResult {
  const beefFactor = findFactor(factors.food, "meal_beef");
  const chickenFactor = findFactor(factors.food, "meal_chicken");
  const vegetarianFactor = findFactor(factors.food, "meal_vegetarian");
  const veganFactor = findFactor(factors.food, "meal_vegan");

  const beefKgCo2e = Math.max(0, profile.beefMealsPerWeek) * WEEKS_PER_YEAR * beefFactor.co2ePerUnit;
  const chickenKgCo2e =
    Math.max(0, profile.chickenMealsPerWeek) * WEEKS_PER_YEAR * chickenFactor.co2ePerUnit;
  const vegetarianKgCo2e =
    Math.max(0, profile.vegetarianMealsPerWeek) * WEEKS_PER_YEAR * vegetarianFactor.co2ePerUnit;
  const veganKgCo2e = Math.max(0, profile.veganMealsPerWeek) * WEEKS_PER_YEAR * veganFactor.co2ePerUnit;

  return {
    category: "food",
    kgCo2ePerYear: beefKgCo2e + chickenKgCo2e + vegetarianKgCo2e + veganKgCo2e,
    breakdown: [
      {
        id: "food_beef",
        label: "Beef meals",
        kgCo2ePerYear: beefKgCo2e,
        factorIds: [beefFactor.id],
      },
      {
        id: "food_chicken",
        label: "Chicken meals",
        kgCo2ePerYear: chickenKgCo2e,
        factorIds: [chickenFactor.id],
      },
      {
        id: "food_vegetarian",
        label: "Vegetarian meals",
        kgCo2ePerYear: vegetarianKgCo2e,
        factorIds: [vegetarianFactor.id],
      },
      {
        id: "food_vegan",
        label: "Vegan meals",
        kgCo2ePerYear: veganKgCo2e,
        factorIds: [veganFactor.id],
      },
    ],
  };
}
