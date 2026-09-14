"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw, TreePine } from "lucide-react";
import { useProfile } from "@/components/profile-provider";
import {
  calculateTotalFootprint,
  getBiggestOpportunities,
  ELECTRICITY_REGIONS,
  perCapitaBenchmarkForCountry,
  worldPerCapitaBenchmark,
  treesToOffset,
  PER_CAPITA_SOURCE,
} from "@/climate";
import { CategoryBarChart } from "@/components/charts/category-bar-chart";
import { PerCapitaComparison } from "@/components/charts/per-capita-comparison";
import { Opportunities } from "@/components/results/opportunities";
import { Button } from "@/components/ui/button";
import { categoryConfig } from "@/components/calculator/category-config";
import { formatTonnes, formatPercent } from "@/lib/format";

export default function ResultsPage() {
  const { profile, resetProfile } = useProfile();
  const footprint = calculateTotalFootprint(profile);
  const opportunities = getBiggestOpportunities(profile);
  const hasAnyData = footprint.totalKgCo2ePerYear > 0;

  const countryCode = profile.home.countryCode ?? "US";
  const countryRegion = ELECTRICITY_REGIONS.find((r) => r.code === countryCode);
  const countryBenchmark = perCapitaBenchmarkForCountry(countryCode);
  const worldBenchmark = worldPerCapitaBenchmark();
  const countryIsWorld = countryCode === "OTHER" || countryBenchmark.countryCode === worldBenchmark.countryCode;
  const trees = Math.round(treesToOffset(footprint.totalKgCo2ePerYear));

  if (!hasAnyData) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-semibold">No estimate yet</h1>
        <p className="mt-2 text-muted-foreground">
          Answer a few questions in the calculator and your results will show up here.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/calculator">
            Start the calculator <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Your estimated footprint
        </p>
        <p className="mt-2 text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl">
          {formatTonnes(footprint.totalKgCo2ePerYear)}
        </p>
        <p className="text-lg text-muted-foreground">tonnes CO₂e / year</p>
        {trees > 0 && (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <TreePine className="size-4 shrink-0" aria-hidden="true" />
            That&apos;s roughly what {trees.toLocaleString()} tree seedlings would absorb in a year, for scale
            (see <Link href="/methodology" className="underline underline-offset-2 hover:text-foreground">methodology</Link>).
          </p>
        )}
        {footprint.largestCategory && (
          <p className="mt-3 text-sm text-muted-foreground">
            Your biggest source is{" "}
            <span className="font-medium text-foreground">
              {categoryConfig(footprint.largestCategory.category).title}
            </span>{" "}
            at {formatPercent(footprint.categoryPercentages[footprint.largestCategory.category])} of your total.
          </p>
        )}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-muted-foreground">Breakdown by category</h2>
        <div className="mt-2">
          <CategoryBarChart categories={footprint.rankedCategories} totalKgCo2ePerYear={footprint.totalKgCo2ePerYear} />
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {footprint.rankedCategories.map((c) => (
            <li key={c.category} className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: categoryConfig(c.category).color }}
                aria-hidden="true"
              />
              {categoryConfig(c.category).title}: {formatPercent(footprint.categoryPercentages[c.category])}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-muted-foreground">
          How you compare{countryRegion && !countryIsWorld ? ` (${countryRegion.label})` : ""}
        </h2>
        <div className="mt-4">
          <PerCapitaComparison
            yourKgCo2ePerYear={footprint.totalKgCo2ePerYear}
            countryLabel={countryRegion?.label ?? "Your country"}
            countryTonnesPerYear={countryBenchmark.tonnesCo2ePerYear}
            worldTonnesPerYear={worldBenchmark.tonnesCo2ePerYear}
            countryIsWorld={countryIsWorld}
          />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Country and world averages cover a person&apos;s total footprint across the whole economy
          (industry, government, exports, and more), not just the categories in this calculator, so
          they&apos;re usually much bigger than your number above even for an average lifestyle. Source:{" "}
          <a
            href={PER_CAPITA_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {PER_CAPITA_SOURCE.name}
          </a>
          , {countryBenchmark.year}.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Your biggest opportunities</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A few realistic changes and the difference they&apos;d make to your annual footprint.
        </p>
        <div className="mt-4">
          <Opportunities profile={profile} opportunities={opportunities} />
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-medium">Curious where these numbers come from?</p>
          <p className="text-sm text-muted-foreground">
            Every factor used above is sourced and documented on the methodology page.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/methodology">
            View methodology <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button asChild variant="ghost">
          <Link href="/calculator">Edit my answers</Link>
        </Button>
        <Button variant="ghost" onClick={resetProfile}>
          <RotateCcw data-icon="inline-start" /> Reset my data
        </Button>
      </div>
    </div>
  );
}
