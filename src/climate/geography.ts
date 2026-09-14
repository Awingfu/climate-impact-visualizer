/**
 * Countries with a dedicated electricity grid intensity factor (see src/data/electricity.json).
 * Selecting a country only changes the electricity factor used in the "home" category;
 * other categories (transportation, flights, food, shopping) still use their existing
 * US/global-average factors. See /methodology for details and sourcing.
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
