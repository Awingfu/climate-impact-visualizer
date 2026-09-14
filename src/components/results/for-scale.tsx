import { TreePine, Fuel, Car, Home as HomeIcon } from "lucide-react";
import {
  treesToOffset,
  gallonsOfGasolineFor,
  milesDrivenFor,
  homeElectricityYearsFor,
} from "@/climate";

type ForScaleProps = {
  kgCo2ePerYear: number;
};

const ICONS = { tree: TreePine, fuel: Fuel, car: Car, home: HomeIcon };

export function ForScale({ kgCo2ePerYear }: ForScaleProps) {
  const items = [
    {
      id: "trees",
      icon: "tree" as const,
      value: Math.round(treesToOffset(kgCo2ePerYear)),
      label: "tree seedlings grown 10 years",
    },
    {
      id: "gasoline",
      icon: "fuel" as const,
      value: Math.round(gallonsOfGasolineFor(kgCo2ePerYear)),
      label: "gallons of gasoline burned",
    },
    {
      id: "miles",
      icon: "car" as const,
      value: Math.round(milesDrivenFor(kgCo2ePerYear)),
      label: "miles driven in an average gas car",
    },
    {
      id: "homes",
      icon: "home" as const,
      value: homeElectricityYearsFor(kgCo2ePerYear),
      label: "years of an average home's electricity",
      decimals: 1,
    },
  ].filter((item) => item.value > 0);

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        return (
          <div key={item.id} className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-3 text-center">
            <span className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tabular-nums">
              {item.value.toLocaleString(undefined, {
                maximumFractionDigits: item.decimals ?? 0,
                minimumFractionDigits: item.decimals ?? 0,
              })}
            </span>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
