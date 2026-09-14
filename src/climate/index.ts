import type {
  Category,
  ClimateProfile,
  EmissionFactors,
  EmissionResult,
  Opportunity,
  ScenarioResult,
  TotalFootprintResult,
} from "./types";
import { emissionFactors } from "./factors";
import { calculateTransportation } from "./calculations/transportation";
import { calculateFlights } from "./calculations/flights";
import { calculateHome } from "./calculations/home";
import { calculateFood } from "./calculations/food";
import { calculateShopping } from "./calculations/shopping";

export * from "./types";
export { emissionFactors } from "./factors";
export { calculateTransportation } from "./calculations/transportation";
export { calculateFlights } from "./calculations/flights";
export { calculateHome } from "./calculations/home";
export { calculateFood } from "./calculations/food";
export { calculateShopping } from "./calculations/shopping";
export { ASSUMED_ROUND_TRIP_KM } from "./calculations/flights";
export {
  ELECTRICITY_REGIONS,
  DEFAULT_ELECTRICITY_REGION_CODE,
  US_STATES,
  US_STATE_SOURCE,
  usStateElectricity,
  COUNTRY_ELECTRICITY_MIX,
  COUNTRY_MIX_SOURCE,
  electricityMixFor,
} from "./geography";
export type { ElectricityRegion, UsStateElectricity, CountryElectricityMix } from "./geography";
export {
  PER_CAPITA_BENCHMARKS,
  PER_CAPITA_SOURCE,
  perCapitaBenchmarkForCountry,
  worldPerCapitaBenchmark,
  TREE_CO2_KG_PER_YEAR,
  TREE_EQUIVALENCE_SOURCE,
  treesToOffset,
  GASOLINE_CO2_KG_PER_GALLON,
  GASOLINE_EQUIVALENCE_SOURCE,
  gallonsOfGasolineFor,
  DRIVING_CO2_KG_PER_MILE,
  DRIVING_EQUIVALENCE_SOURCE,
  milesDrivenFor,
  HOME_ELECTRICITY_CO2_KG_PER_YEAR,
  HOME_ELECTRICITY_EQUIVALENCE_SOURCE,
  homeElectricityYearsFor,
} from "./benchmarks";
export type { PerCapitaBenchmark } from "./benchmarks";

/** A reasonable, non-alarming default profile used to seed the calculator. */
export const defaultProfile: ClimateProfile = {
  transportation: {
    carMilesPerMonth: 800,
    vehicleType: "car",
    fuelType: "gasoline",
    publicTransitMilesPerMonth: 0,
  },
  flights: {
    domesticTripsPerYear: 1,
    internationalTripsPerYear: 0,
  },
  home: {
    electricityKwhPerMonth: 900,
    naturalGasThermsPerMonth: 40,
    countryCode: "US",
  },
  food: {
    beefMealsPerWeek: 4,
    chickenMealsPerWeek: 4,
    vegetarianMealsPerWeek: 4,
    veganMealsPerWeek: 1.5,
  },
  shopping: {
    clothingItemsPerMonth: 2,
    electronicsPerYear: 1,
  },
};

const CATEGORY_ORDER: Category[] = ["transportation", "flights", "home", "food", "shopping"];

export function calculateTotalFootprint(
  profile: ClimateProfile,
  factors: EmissionFactors = emissionFactors
): TotalFootprintResult {
  const categories: EmissionResult[] = [
    calculateTransportation(profile.transportation, factors, profile.home),
    calculateFlights(profile.flights, factors),
    calculateHome(profile.home, factors),
    calculateFood(profile.food, factors),
    calculateShopping(profile.shopping, factors),
  ];

  const totalKgCo2ePerYear = categories.reduce((sum, c) => sum + c.kgCo2ePerYear, 0);

  const rankedCategories = [...categories].sort((a, b) => b.kgCo2ePerYear - a.kgCo2ePerYear);

  const categoryPercentages = Object.fromEntries(
    CATEGORY_ORDER.map((category) => {
      const result = categories.find((c) => c.category === category)!;
      const percent = totalKgCo2ePerYear > 0 ? (result.kgCo2ePerYear / totalKgCo2ePerYear) * 100 : 0;
      return [category, percent];
    })
  ) as Record<Category, number>;

  return {
    totalKgCo2ePerYear,
    categories,
    rankedCategories,
    largestCategory: rankedCategories[0]?.kgCo2ePerYear > 0 ? rankedCategories[0] : null,
    categoryPercentages,
  };
}

export function calculateScenario(
  baselineProfile: ClimateProfile,
  scenarioProfile: ClimateProfile,
  factors: EmissionFactors = emissionFactors
): ScenarioResult {
  const baselineKgCo2e = calculateTotalFootprint(baselineProfile, factors).totalKgCo2ePerYear;
  const scenarioKgCo2e = calculateTotalFootprint(scenarioProfile, factors).totalKgCo2ePerYear;
  const reductionKgCo2e = baselineKgCo2e - scenarioKgCo2e;
  const reductionPercent = baselineKgCo2e > 0 ? (reductionKgCo2e / baselineKgCo2e) * 100 : 0;

  return {
    baselineKgCo2e,
    scenarioKgCo2e,
    reductionKgCo2e,
    reductionPercent,
  };
}

type OpportunityTemplate = {
  id: string;
  category: Category;
  label: string;
  icon: string;
  description: string;
  /** Returns a modified profile, or null if this opportunity doesn't apply (e.g. user already has zero of that activity). */
  apply: (profile: ClimateProfile) => ClimateProfile | null;
};

const OPPORTUNITY_TEMPLATES: OpportunityTemplate[] = [
  {
    id: "drive_less",
    category: "transportation",
    label: "Drive 30% less",
    icon: "car",
    description: "Combine errands, carpool, or bike for short trips.",
    apply: (profile) => {
      if (profile.transportation.carMilesPerMonth <= 0) return null;
      return {
        ...profile,
        transportation: {
          ...profile.transportation,
          carMilesPerMonth: profile.transportation.carMilesPerMonth * 0.7,
        },
      };
    },
  },
  {
    id: "fewer_flights",
    category: "flights",
    label: "Take one fewer flight per year",
    icon: "plane",
    description: "Skip one international trip, or combine trips when possible.",
    apply: (profile) => {
      if (profile.flights.internationalTripsPerYear > 0) {
        return {
          ...profile,
          flights: {
            ...profile.flights,
            internationalTripsPerYear: profile.flights.internationalTripsPerYear - 1,
          },
        };
      }
      if (profile.flights.domesticTripsPerYear > 0) {
        return {
          ...profile,
          flights: {
            ...profile.flights,
            domesticTripsPerYear: profile.flights.domesticTripsPerYear - 1,
          },
        };
      }
      return null;
    },
  },
  {
    id: "eat_less_beef",
    category: "food",
    label: "Eat less beef",
    icon: "beef",
    description: "Swap half your beef meals for vegetarian meals.",
    apply: (profile) => {
      if (profile.food.beefMealsPerWeek <= 0) return null;
      const swapped = profile.food.beefMealsPerWeek / 2;
      return {
        ...profile,
        food: {
          ...profile.food,
          beefMealsPerWeek: profile.food.beefMealsPerWeek - swapped,
          vegetarianMealsPerWeek: profile.food.vegetarianMealsPerWeek + swapped,
        },
      };
    },
  },
  {
    id: "reduce_electricity",
    category: "home",
    label: "Cut home electricity use by 15%",
    icon: "zap",
    description: "LED bulbs, smart thermostats, and unplugging idle electronics add up.",
    apply: (profile) => {
      if (profile.home.electricityKwhPerMonth <= 0) return null;
      return {
        ...profile,
        home: {
          ...profile.home,
          electricityKwhPerMonth: profile.home.electricityKwhPerMonth * 0.85,
        },
      };
    },
  },
  {
    id: "buy_less_clothing",
    category: "shopping",
    label: "Buy fewer new clothes",
    icon: "shirt",
    description: "Cut new clothing purchases in half by buying less or buying secondhand.",
    apply: (profile) => {
      if (profile.shopping.clothingItemsPerMonth <= 0) return null;
      return {
        ...profile,
        shopping: {
          ...profile.shopping,
          clothingItemsPerMonth: profile.shopping.clothingItemsPerMonth * 0.5,
        },
      };
    },
  },
];

/**
 * Evaluates a small, fixed set of predefined alternative scenarios (not a general
 * optimization engine) and returns the ones that meaningfully reduce emissions,
 * ranked by potential reduction.
 */
export function getBiggestOpportunities(
  profile: ClimateProfile,
  factors: EmissionFactors = emissionFactors,
  limit = 3
): Opportunity[] {
  const opportunities: Opportunity[] = [];

  for (const template of OPPORTUNITY_TEMPLATES) {
    const scenarioProfile = template.apply(profile);
    if (!scenarioProfile) continue;

    const result = calculateScenario(profile, scenarioProfile, factors);
    if (result.reductionKgCo2e <= 0) continue;

    opportunities.push({
      id: template.id,
      category: template.category,
      label: template.label,
      description: template.description,
      icon: template.icon,
      reductionKgCo2ePerYear: result.reductionKgCo2e,
    });
  }

  return opportunities
    .sort((a, b) => b.reductionKgCo2ePerYear - a.reductionKgCo2ePerYear)
    .slice(0, limit);
}
