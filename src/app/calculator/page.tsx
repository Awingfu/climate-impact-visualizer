"use client";

import Link from "next/link";
import { ArrowRight, Car, Plane, Home as HomeIcon, Utensils, Shirt } from "lucide-react";
import { useProfile } from "@/components/profile-provider";
import { Button } from "@/components/ui/button";
import { CATEGORY_STEPS } from "@/components/calculator/category-config";
import {
  calculateTransportation,
  calculateFlights,
  calculateHome,
  calculateFood,
  calculateShopping,
  emissionFactors,
} from "@/climate";
import { formatCo2e } from "@/lib/format";

const ICONS = { car: Car, plane: Plane, home: HomeIcon, utensils: Utensils, shirt: Shirt };

export default function CalculatorOverviewPage() {
  const { profile } = useProfile();

  const results = {
    transportation: calculateTransportation(profile.transportation, emissionFactors),
    flights: calculateFlights(profile.flights, emissionFactors),
    home: calculateHome(profile.home, emissionFactors),
    food: calculateFood(profile.food, emissionFactors),
    shopping: calculateShopping(profile.shopping, emissionFactors),
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Let&apos;s estimate your footprint</h1>
      <p className="mt-2 text-muted-foreground">
        We&apos;ve started you off with typical US averages for each category. Jump into any of
        them, adjust the answers to match your own life, and watch the estimate update instantly.
      </p>

      <ul className="mt-8 space-y-3">
        {CATEGORY_STEPS.map((step) => {
          const Icon = ICONS[step.icon as keyof typeof ICONS];
          const result = results[step.category];
          return (
            <li key={step.path}>
              <Link
                href={step.path}
                className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-medium">{step.title}</span>
                </span>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  {formatCo2e(result.kgCo2ePerYear)}/yr
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href={CATEGORY_STEPS[0].path}>
            Start with transportation <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/results">See my results</Link>
        </Button>
      </div>
    </div>
  );
}
