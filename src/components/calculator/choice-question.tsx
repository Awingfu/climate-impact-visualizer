"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "cn";

export type Choice<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

type ChoiceQuestionProps<T extends string> = {
  question: string;
  helpText?: string;
  value: T;
  onChange: (value: T) => void;
  choices: Choice<T>[];
};

export function ChoiceQuestion<T extends string>({
  question,
  helpText,
  value,
  onChange,
  choices,
}: ChoiceQuestionProps<T>) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-medium">{question}</h3>
        {helpText && <p className="mt-1 text-sm text-muted-foreground">{helpText}</p>}
      </div>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as T)}
        className="grid gap-2 sm:grid-cols-2"
      >
        {choices.map((choice) => {
          const isSelected = choice.value === value;
          return (
            <label
              key={choice.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors hover:bg-muted",
                isSelected ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" : "border-border"
              )}
            >
              <RadioGroupItem value={choice.value} className="mt-1" />
              <span>
                <span className="block text-sm font-medium">{choice.label}</span>
                {choice.description && (
                  <span className="block text-xs text-muted-foreground">{choice.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
