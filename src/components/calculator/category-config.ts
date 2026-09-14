import type { Category } from "@/climate/types";

export type CategoryConfig = {
  category: Category;
  path: string;
  title: string;
  icon: string;
  /** CSS var reference, fixed per category identity (see globals.css). */
  color: string;
};

export const CATEGORY_STEPS: CategoryConfig[] = [
  {
    category: "transportation",
    path: "/calculator/transportation",
    title: "Transportation",
    icon: "car",
    color: "var(--cat-transportation)",
  },
  { category: "flights", path: "/calculator/flights", title: "Flights", icon: "plane", color: "var(--cat-flights)" },
  { category: "home", path: "/calculator/home", title: "Home energy", icon: "home", color: "var(--cat-home)" },
  { category: "food", path: "/calculator/food", title: "Food", icon: "utensils", color: "var(--cat-food)" },
  {
    category: "shopping",
    path: "/calculator/shopping",
    title: "Shopping",
    icon: "shirt",
    color: "var(--cat-shopping)",
  },
];

export function categoryConfig(category: Category): CategoryConfig {
  return CATEGORY_STEPS.find((c) => c.category === category)!;
}

/** A step in the calculator wizard: the region step first, then one per emission category. */
export type WizardStep = {
  path: string;
  title: string;
  icon: string;
};

export const WIZARD_STEPS: WizardStep[] = [
  { path: "/calculator/region", title: "Your region", icon: "map-pin" },
  ...CATEGORY_STEPS.map(({ path, title, icon }) => ({ path, title, icon })),
];

export function wizardStepIndex(path: string): number {
  return WIZARD_STEPS.findIndex((s) => s.path === path);
}

export function stepIndex(path: string): number {
  return CATEGORY_STEPS.findIndex((s) => s.path === path);
}
