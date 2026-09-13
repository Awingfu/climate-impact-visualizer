import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: "What the Climate Impact Visualizer is, and what it's not.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">About this project</h1>
      <p className="mt-4 text-muted-foreground">
        The Climate Impact Visualizer is a small, interactive tool for estimating your personal
        greenhouse-gas footprint from everyday choices (driving, flying, home energy, food, and
        shopping) and exploring how changing those choices would affect it.
      </p>
      <p className="mt-4 text-muted-foreground">
        It&apos;s intentionally simple: no account, no backend, no database. Your answers live only
        in your browser. It doesn&apos;t model every possible source of emissions, and it isn&apos;t
        a substitute for a rigorous personal carbon audit. The goal is to make the relative scale
        of everyday choices tangible and explorable, with every number traced back to a public,
        reputable source.
      </p>
      <p className="mt-4 text-muted-foreground">
        See the{" "}
        <Link href="/methodology" className="text-emerald-700 underline underline-offset-2 hover:text-emerald-800 dark:text-emerald-400">
          methodology page
        </Link>{" "}
        for the full list of data sources, assumptions, and known limitations.
      </p>
      <Button asChild size="lg" className="mt-6">
        <Link href="/calculator">
          Calculate my impact <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
    </div>
  );
}
