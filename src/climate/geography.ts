import usStatesData from "@/data/us-states-electricity.json";
import countryMixData from "@/data/country-electricity-mix.json";
import { findFactor } from "./factors";
import type { EmissionFactors } from "./types";

/**
 * Countries with a dedicated electricity grid intensity factor (see src/data/electricity.json).
 * Selecting a country changes the electricity factor used in the "home" category (and EV
 * charging in "transportation"); other categories still use their existing US/global-average
 * factors. See /methodology for details and sourcing.
 */
export type ElectricityRegion = {
  /** ISO 3166-1 alpha-2 code, also used as the profile's countryCode. */
  code: string;
  label: string;
  factorId: string;
};

export const ELECTRICITY_REGIONS: ElectricityRegion[] = [
  { code: "US", label: "United States", factorId: "electricity_us_average" },
  { code: "GB", label: "United Kingdom", factorId: "electricity_grid_gbr" },
  { code: "DE", label: "Germany", factorId: "electricity_grid_deu" },
  { code: "FR", label: "France", factorId: "electricity_grid_fra" },
  { code: "CA", label: "Canada", factorId: "electricity_grid_can" },
  { code: "CN", label: "China", factorId: "electricity_grid_chn" },
  { code: "IN", label: "India", factorId: "electricity_grid_ind" },
  { code: "JP", label: "Japan", factorId: "electricity_grid_jpn" },
  { code: "AU", label: "Australia", factorId: "electricity_grid_aus" },
  { code: "BR", label: "Brazil", factorId: "electricity_grid_bra" },
  { code: "KR", label: "South Korea", factorId: "electricity_grid_kor" },
  { code: "MX", label: "Mexico", factorId: "electricity_grid_mex" },
  { code: "ES", label: "Spain", factorId: "electricity_grid_esp" },
  { code: "IT", label: "Italy", factorId: "electricity_grid_ita" },
  { code: "ZA", label: "South Africa", factorId: "electricity_grid_zaf" },
  { code: "OTHER", label: "Other / not sure (world average)", factorId: "electricity_grid_world" },
];

export const DEFAULT_ELECTRICITY_REGION_CODE = "US";

export function electricityFactorIdForCountry(countryCode: string | undefined): string {
  const region = ELECTRICITY_REGIONS.find((r) => r.code === countryCode);
  return region ? region.factorId : "electricity_us_average";
}

/**
 * US state-level electricity grid data, from EPA eGRID2023 (Summary Tables, Table 3 & 4).
 * Only used when countryCode is "US" and a state is selected; otherwise the country-level
 * factor above applies. See /methodology.
 */
export type UsStateElectricity = {
  /** USPS 2-letter code. */
  code: string;
  name: string;
  co2eKgPerKwh: number;
  mixPercent: { fossil: number; nuclear: number; renewables: number; other: number };
};

export const US_STATES: UsStateElectricity[] = usStatesData;

export const US_STATE_SOURCE = {
  name: "US EPA eGRID2023 (Summary Tables)",
  url: "https://www.epa.gov/egrid/summary-data",
  methodology:
    "State-level output emission rate (Table 3) and generation resource mix (Table 4) from EPA's eGRID2023 dataset. \"Fossil\" sums coal, oil, gas, and other fossil; \"Renewables\" sums hydro, biomass, wind, solar, and geothermal. Actual intensity still varies by utility within a state.",
};

export function usStateElectricity(code: string | undefined): UsStateElectricity | undefined {
  return US_STATES.find((s) => s.code === code);
}

type HomeLocation = { countryCode?: string; usStateCode?: string };

function electricityFactorIdFor(home: HomeLocation): string {
  if (home.countryCode === "US" && home.usStateCode) {
    return `us_state_${home.usStateCode.toLowerCase()}`;
  }
  return electricityFactorIdForCountry(home.countryCode);
}

/** The kg CO2e per kWh to use for electricity (and EV charging), accounting for a selected US state. */
export function electricityCo2ePerKwh(home: HomeLocation, factors: EmissionFactors): number {
  if (home.countryCode === "US" && home.usStateCode) {
    const state = usStateElectricity(home.usStateCode);
    if (state) return state.co2eKgPerKwh;
  }
  return findFactor(factors.home, electricityFactorIdForCountry(home.countryCode)).co2ePerUnit;
}

/** Factor id(s) the electricity/EV breakdown item traces back to, for "show your work" UI. */
export function electricityFactorIds(home: HomeLocation): string[] {
  return [electricityFactorIdFor(home)];
}

/**
 * Country-level electricity generation mix (% fossil / nuclear / renewables), from Ember's
 * Global Electricity Review via Our World in Data. Covers the same countries as
 * ELECTRICITY_REGIONS, plus a world average.
 */
export type CountryElectricityMix = {
  countryCode: string;
  label: string;
  year: number;
  mixPercent: { fossil: number; nuclear: number; renewables: number };
};

export const COUNTRY_ELECTRICITY_MIX: CountryElectricityMix[] = countryMixData;

export const COUNTRY_MIX_SOURCE = {
  name: "Ember, Global Electricity Review (via Our World in Data)",
  url: "https://ourworldindata.org/electricity-mix",
};

function worldElectricityMix(): CountryElectricityMix {
  return COUNTRY_ELECTRICITY_MIX.find((m) => m.countryCode === "WORLD")!;
}

/**
 * The electricity mix to show on the results page: the selected US state's mix if one is set,
 * else the selected country's mix, else the world average. Also returns a source citation.
 */
export function electricityMixFor(home: HomeLocation): {
  label: string;
  mixPercent: { fossil: number; nuclear: number; renewables: number; other: number };
  source: { name: string; url: string };
} {
  if (home.countryCode === "US" && home.usStateCode) {
    const state = usStateElectricity(home.usStateCode);
    if (state) {
      return { label: state.name, mixPercent: state.mixPercent, source: US_STATE_SOURCE };
    }
  }
  const country =
    COUNTRY_ELECTRICITY_MIX.find((m) => m.countryCode === home.countryCode) ?? worldElectricityMix();
  return {
    label: country.label,
    mixPercent: { ...country.mixPercent, other: 0 },
    source: COUNTRY_MIX_SOURCE,
  };
}
