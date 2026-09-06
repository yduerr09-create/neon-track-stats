import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Flag } from "lucide-react";

const LINKS = [
  { to: "/", label: "Übersicht" },
  { to: "/drivers", label: "Fahrer" },
  { to: "/teams", label: "Teams" },
  { to: "/calendar", label: "Kalender" },
  { to: "/admin", label: "Admin" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Flag className="size-5 text-primary" />
          <span className="font-display text-lg tracking-[0.2em] uppercase text-foreground">
            Apex<span className="text-primary">League</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menü"
          className="rounded-md border border-border p-2 text-foreground md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-border/70 px-4 py-2 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-2 py-3 text-sm font-medium uppercase tracking-wide text-muted-foreground data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
