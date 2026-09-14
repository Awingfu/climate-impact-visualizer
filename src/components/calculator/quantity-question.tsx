"use client";

import { useMemo, useState } from "react";
import { cn } from "cn";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export type QuickOption = {
  label: string;
  value: number;
};

type QuantityQuestionProps = {
  question: string;
  helpText?: string;
  value: number;
  onChange: (value: number) => void;
  quickOptions: QuickOption[];
  min: number;
  max: number;
  step: number;
  unit: string;
  formatValue?: (value: number) => string;
};

const EPSILON = 0.001;

/**
 * A progressive question: a small set of plain-language quick choices, with an
 * "enter an exact number" fallback for users who know their number. Favors
 * estimation over requiring precise data (per product spec section 9).
 */
export function QuantityQuestion({
  question,
  helpText,
  value,
  onChange,
  quickOptions,
  min,
  max,
  step,
  unit,
  formatValue,
}: QuantityQuestionProps) {
  const matchesQuickOption = useMemo(
    () => quickOptions.some((opt) => Math.abs(opt.value - value) < EPSILON),
    [quickOptions, value]
  );
  const [mode, setMode] = useState<"quick" | "exact">(matchesQuickOption ? "quick" : "exact");

  const display = formatValue ? formatValue(value) : `${Math.round(value * 10) / 10} ${unit}`;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{question}</h3>
        {helpText && <p className="mt-1 text-sm text-muted-foreground">{helpText}</p>}
      </div>

      {mode === "quick" ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={question}>
            {quickOptions.map((opt) => {
              const isSelected = Math.abs(opt.value - value) < EPSILON;
              return (
                <button
                  key={opt.label}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onChange(opt.value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-border bg-background hover:bg-muted"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setMode("exact")}
            className="text-sm font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
          >
            Or enter an exact number
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor={`${question}-number`} className="sr-only">
              {question} ({unit})
            </Label>
            <div className="flex items-baseline gap-2">
              <input
                id={`${question}-number`}
                type="number"
                inputMode="decimal"
                value={Number.isFinite(value) ? value : ""}
                min={min}
                step={step}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "") return;
                  const parsed = Number(raw);
                  if (Number.isFinite(parsed)) onChange(Math.max(min, parsed));
                }}
                className="w-28 rounded-lg border border-input bg-background px-2 py-1 text-2xl font-semibold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
            <span className="text-sm text-muted-foreground">{display}</span>
          </div>
          <Slider
            id={`${question}-slider`}
            value={[Math.min(value, max)]}
            min={min}
            max={max}
            step={step}
            onValueChange={([v]) => onChange(v)}
            aria-label={`${question}, in ${unit}`}
          />
          {value > max && (
            <p className="text-xs text-muted-foreground">
              The slider tops out at {max.toLocaleString()}, but your typed value of{" "}
              {value.toLocaleString()} is still being used.
            </p>
          )}
          <button
            type="button"
            onClick={() => setMode("quick")}
            className="text-sm font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
          >
            Use quick choices instead
          </button>
        </div>
      )}
    </div>
  );
}
