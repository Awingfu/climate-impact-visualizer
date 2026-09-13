import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 text-sm text-muted-foreground sm:px-6">
        <p>
          Every estimate on this site is a rough approximation traced to a public emissions dataset.
          See the{" "}
          <Link href="/methodology" className="underline underline-offset-2 hover:text-foreground">
            methodology
          </Link>{" "}
          page for sources, assumptions, and limitations.
        </p>
        <p>No account, no backend, no tracking: your inputs stay in your browser.</p>
      </div>
    </footer>
  );
}
