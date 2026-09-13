import type { ClimateProfile, EmissionFactors, EmissionResult } from "../types";
import { findFactor } from "../factors";

const MONTHS_PER_YEAR = 12;

export function calculateShopping(
  profile: ClimateProfile["shopping"],
  factors: EmissionFactors
): EmissionResult {
  const annualClothingItems = Math.max(0, profile.clothingItemsPerMonth) * MONTHS_PER_YEAR;
  const annualElectronics = Math.max(0, profile.electronicsPerYear);

  const clothingFactor = findFactor(factors.shopping, "clothing_item");
  const electronicsFactor = findFactor(factors.shopping, "electronics_item");

  const clothingKgCo2e = annualClothingItems * clothingFactor.co2ePerUnit;
  const electronicsKgCo2e = annualElectronics * electronicsFactor.co2ePerUnit;

  return {
    category: "shopping",
    kgCo2ePerYear: clothingKgCo2e + electronicsKgCo2e,
    breakdown: [
      {
        id: "shopping_clothing",
        label: "Clothing",
        kgCo2ePerYear: clothingKgCo2e,
        factorIds: [clothingFactor.id],
      },
      {
        id: "shopping_electronics",
        label: "Electronics",
        kgCo2ePerYear: electronicsKgCo2e,
        factorIds: [electronicsFactor.id],
      },
    ],
  };
}
