"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Car, Plane, Home as HomeIcon, Utensils, Shirt, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WIZARD_STEPS, wizardStepIndex } from "./category-config";
import { formatCo2e } from "@/lib/format";
import { useProfile } from "@/components/profile-provider";
import { calculateTotalFootprint } from "@/climate";
import { cn } from "cn";

const ICONS = { car: Car, plane: Plane, home: HomeIcon, utensils: Utensils, shirt: Shirt, "map-pin": MapPin };

type CalculatorShellProps = {
  path: string;
  subtitle: string;
  /** Omit for steps that aren't an emission category (e.g. the region step). */
  categoryKgCo2ePerYear?: number;
  children: React.ReactNode;
};

export function CalculatorShell({ path, subtitle, categoryKgCo2ePerYear, children }: CalculatorShellProps) {
  const { profile } = useProfile();
  const index = wizardStepIndex(path);
  const step = WIZARD_STEPS[index];
  const prev = index > 0 ? WIZARD_STEPS[index - 1] : null;
  const next = index < WIZARD_STEPS.length - 1 ? WIZARD_STEPS[index + 1] : null;
  const Icon = ICONS[step.icon as keyof typeof ICONS];
  const runningTotal = calculateTotalFootprint(profile).totalKgCo2ePerYear;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <ol className="mb-8 flex items-center gap-1.5" aria-label="Calculator progress">
        {WIZARD_STEPS.map((s, i) => (
          <li key={s.path} className="flex-1">
            <span
              className={cn(
                "block h-1.5 rounded-full",
                i <= index ? "bg-emerald-600" : "bg-muted"
              )}
              aria-hidden="true"
            />
          </li>
        ))}
      </ol>
      <span className="sr-only" role="status">
        Step {index + 1} of {WIZARD_STEPS.length}: {step.title}
      </span>

      <div
        className="sticky top-14 z-30 -mx-4 mb-6 flex items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6"
        role="status"
        aria-live="polite"
      >
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Running total</span>
        <span className="text-base font-semibold tabular-nums">{formatCo2e(runningTotal)}/yr</span>
      </div>

      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Step {index + 1} of {WIZARD_STEPS.length}
            </p>
            <h1 className="text-2xl font-semibold">{step.title}</h1>
          </div>
        </div>
        {!!categoryKgCo2ePerYear && categoryKgCo2ePerYear > 0 && (
          <div className="shrink-0 rounded-xl border border-border bg-muted/50 px-3 py-2 text-right">
            <p className="text-xs text-muted-foreground">This category</p>
            <p className="text-sm font-semibold tabular-nums">{formatCo2e(categoryKgCo2ePerYear)}/yr</p>
          </div>
        )}
      </div>

      <p className="mb-8 text-muted-foreground">{subtitle}</p>

      <div className="space-y-10">{children}</div>

      <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
        {prev ? (
          <Button asChild variant="outline" size="lg">
            <Link href={prev.path}>
              <ArrowLeft data-icon="inline-start" /> {prev.title}
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" size="lg">
            <Link href="/calculator">
              <ArrowLeft data-icon="inline-start" /> Overview
            </Link>
          </Button>
        )}
        <Button asChild size="lg">
          <Link href={next ? next.path : "/results"}>
            {next ? next.title : "See my results"} <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
