/**
 * Core domain types for the climate impact calculator.
 * These types are shared by the data layer (src/data/*.json), the pure
 * calculation engine (src/climate/calculations/*), and the UI.
 */

export type Category =
  | "transportation"
  | "flights"
  | "home"
  | "food"
  | "shopping";

/** A single sourced emissions factor. Every number the app shows must trace back to one of these. */
export type EmissionFactor = {
  id: string;
  category: Category;
  label: string;
  /** The activity this factor converts, e.g. "mile", "kWh", "therm", "meal", "trip", "item". */
  activityUnit: string;
  /** kg CO2e emitted per one unit of activityUnit. */
  co2ePerUnit: number;
  geography?: string;
  year: number;
  source: {
    name: string;
    url: string;
  };
  /** How this number was derived, including any assumptions layered on top of the source. */
  methodology?: string;
  /**
   * Set when a confident, precise factor was not publicly available. The UI must
   * surface this so users don't mistake the number for a precise scientific value.
   */
  isPlaceholder?: boolean;
};

export type EmissionFactors = {
  transportation: EmissionFactor[];
  flights: EmissionFactor[];
  home: EmissionFactor[];
  food: EmissionFactor[];
  shopping: EmissionFactor[];
};

export type VehicleType = "car" | "suv_truck" | "hybrid" | "electric";
export type FuelType = "gasoline" | "hybrid" | "electric";

export type ClimateProfile = {
  transportation: {
    carMilesPerMonth: number;
    vehicleType: VehicleType;
    fuelType: FuelType;
    publicTransitMilesPerMonth: number;
  };

  flights: {
    domesticTripsPerYear: number;
    internationalTripsPerYear: number;
  };

  home: {
    electricityKwhPerMonth: number;
    naturalGasThermsPerMonth?: number;
  };

  food: {
    beefMealsPerWeek: number;
    chickenMealsPerWeek: number;
    vegetarianMealsPerWeek: number;
    veganMealsPerWeek: number;
  };

  shopping: {
    clothingItemsPerMonth: number;
    electronicsPerYear: number;
  };
};

export type EmissionBreakdownItem = {
  id: string;
  label: string;
  kgCo2ePerYear: number;
  /** The factor id(s) this item traces back to, for "show your work" UI. */
  factorIds: string[];
};

export type EmissionResult = {
  category: Category;
  kgCo2ePerYear: number;
  breakdown: EmissionBreakdownItem[];
};

export type TotalFootprintResult = {
  totalKgCo2ePerYear: number;
  categories: EmissionResult[];
  /** Categories sorted descending by kgCo2ePerYear. */
  rankedCategories: EmissionResult[];
  largestCategory: EmissionResult | null;
  /** Percent (0-100) of total each category represents. */
  categoryPercentages: Record<Category, number>;
};

export type ScenarioResult = {
  baselineKgCo2e: number;
  scenarioKgCo2e: number;
  reductionKgCo2e: number;
  reductionPercent: number;
};

export type Opportunity = {
  id: string;
  category: Category;
  label: string;
  description: string;
  icon: string;
  reductionKgCo2ePerYear: number;
};
