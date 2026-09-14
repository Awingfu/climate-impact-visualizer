import perCapitaData from "@/data/per-capita-emissions.json";

/**
 * Comparison benchmarks, distinct from EmissionFactor: these aren't multiplied against a
 * user-reported activity, they're reference points the user's own total gets compared to.
 */
export type PerCapitaBenchmark = {
  countryCode: string;
  label: string;
  tonnesCo2ePerYear: number;
  year: number;
};

export const PER_CAPITA_BENCHMARKS: PerCapitaBenchmark[] = perCapitaData;

export const PER_CAPITA_SOURCE = {
  name: "Jones et al., National contributions to climate change (via Our World in Data)",
  url: "https://ourworldindata.org/grapher/per-capita-ghg-emissions",
  methodology:
    "Per capita greenhouse gas emissions including land use, in tonnes CO2e (100-year GWP, AR6 factors). This is a total national average across every sector of the economy (industry, agriculture, government, exports, and more), not just the personal-consumption categories this calculator covers, so it will typically run well above your estimate here even if your lifestyle is average.",
};

const WORLD_CODE = "WORLD";

/** Looks up the per-capita benchmark for a country code (e.g. from the home energy step), falling back to the world average. */
export function perCapitaBenchmarkForCountry(countryCode: string | undefined): PerCapitaBenchmark {
  const match = PER_CAPITA_BENCHMARKS.find((b) => b.countryCode === countryCode);
  return match ?? PER_CAPITA_BENCHMARKS.find((b) => b.countryCode === WORLD_CODE)!;
}

export function worldPerCapitaBenchmark(): PerCapitaBenchmark {
  return PER_CAPITA_BENCHMARKS.find((b) => b.countryCode === WORLD_CODE)!;
}

const EPA_EQUIVALENCIES_SOURCE = {
  name: "US EPA Greenhouse Gas Equivalencies Calculator",
  url: "https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references",
};

/**
 * Average annual CO2 sequestered by one urban tree, in kg. EPA's weighted average across
 * coniferous and deciduous trees grown for 10 years in a US urban/suburban setting.
 */
export const TREE_CO2_KG_PER_YEAR = 60;

export const TREE_EQUIVALENCE_SOURCE = {
  ...EPA_EQUIVALENCIES_SOURCE,
  methodology:
    "EPA's weighted-average carbon sequestration rate for an urban tree (coniferous or deciduous) over its first 10 years of growth, converted to CO2. A rough equivalence for scale, not a real offset: actual sequestration varies enormously by species, climate, and age, and a tree takes years to reach this rate.",
};

/** How many tree-years of average urban-tree sequestration it would take to offset a given amount of CO2e. */
export function treesToOffset(kgCo2ePerYear: number): number {
  return Math.max(0, kgCo2ePerYear) / TREE_CO2_KG_PER_YEAR;
}

/** kg CO2 per gallon of gasoline burned, from the carbon content of the fuel. */
export const GASOLINE_CO2_KG_PER_GALLON = 8.887;

export const GASOLINE_EQUIVALENCE_SOURCE = {
  ...EPA_EQUIVALENCIES_SOURCE,
  methodology:
    "EPA/DOT's standard conversion factor (8,887 g CO2 per gallon of gasoline), based on the fuel's carbon content and assuming complete combustion.",
};

export function gallonsOfGasolineFor(kgCo2ePerYear: number): number {
  return Math.max(0, kgCo2ePerYear) / GASOLINE_CO2_KG_PER_GALLON;
}

/** kg CO2e per mile driven by the average US gasoline-powered passenger vehicle. */
export const DRIVING_CO2_KG_PER_MILE = 0.393;

export const DRIVING_EQUIVALENCE_SOURCE = {
  ...EPA_EQUIVALENCIES_SOURCE,
  methodology:
    "EPA's per-mile CO2e rate for the average gasoline-powered passenger vehicle: the gasoline factor above divided by the 2022 fleet-average fuel economy (22.8 mpg), adjusted for methane and nitrous oxide.",
};

export function milesDrivenFor(kgCo2ePerYear: number): number {
  return Math.max(0, kgCo2ePerYear) / DRIVING_CO2_KG_PER_MILE;
}

/** kg CO2 for one average US home's electricity use for one year. */
export const HOME_ELECTRICITY_CO2_KG_PER_YEAR = 4798;

export const HOME_ELECTRICITY_EQUIVALENCE_SOURCE = {
  ...EPA_EQUIVALENCIES_SOURCE,
  methodology:
    "EPA's estimate for the average US home's annual electricity use (12,194 kWh in 2022) at the national average grid emission rate. Uses EPA's own equivalencies-calculator assumptions, which differ slightly from the electricity factor used elsewhere in this app.",
};

export function homeElectricityYearsFor(kgCo2ePerYear: number): number {
  return Math.max(0, kgCo2ePerYear) / HOME_ELECTRICITY_CO2_KG_PER_YEAR;
}
