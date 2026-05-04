import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Sparkles, Target, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Resume Screener — See the fit before the interview" },
      {
        name: "description",
        content:
          "Upload a resume, paste a job description, and get an honest, AI-graded match across five dimensions. Built for recruiters who read between the lines.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    return <Navigate to={user.username === "admin" ? "/admin" : "/app"} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* subtle grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
        }}
      />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[image:var(--gradient-primary)] shadow-[var(--shadow-elegant)]" />
          <span className="text-base font-semibold tracking-tight">Resume Screener</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/register">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        {/* HERO */}
        <section className="grid gap-12 py-20 md:grid-cols-12 md:gap-8 md:py-28">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--score-good)]" />
              A quieter way to evaluate candidates
            </div>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              See the fit
              <br />
              <span className="italic font-light text-muted-foreground">before</span>{" "}
              the interview.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Drop in a resume, paste a job description, and get an honest, structured
              read on the match — across five dimensions that actually matter.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/register">
                  Try it free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/login">I have an account</Link>
              </Button>
            </div>
          </div>

          {/* Asymmetric preview card */}
          <div className="relative md:col-span-5">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-[image:var(--gradient-primary)] opacity-20 blur-2xl" />
            <div className="rotate-[1.5deg] rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-elegant)]">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Match report
                </div>
                <div className="rounded-full bg-[color-mix(in_oklab,var(--score-good)_18%,transparent)] px-2 py-0.5 text-xs font-medium text-[var(--score-good)]">
                  Excellent
                </div>
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-6xl font-semibold tracking-tight">87</span>
                <span className="text-muted-foreground">/ 100</span>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  ["Skills alignment", 92, "good"],
                  ["Experience depth", 84, "good"],
                  ["Domain relevance", 71, "mid"],
                  ["Education", 88, "good"],
                  ["Soft signals", 66, "mid"],
                ].map(([label, value, tone]) => (
                  <div key={label as string}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium tabular-nums">{value}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${value}%`,
                          background:
                            tone === "good"
                              ? "var(--score-good)"
                              : tone === "mid"
                                ? "var(--score-mid)"
                                : "var(--score-bad)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HOW */}
        <section className="border-t border-border py-20">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                How it works
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Three steps.
                <br />
                No fluff.
              </h2>
            </div>
            <div className="grid gap-6 md:col-span-8 md:grid-cols-3">
              {[
                {
                  n: "01",
                  icon: FileText,
                  title: "Upload",
                  body: "Drop in a PDF or DOCX. We keep your library tidy and downloadable.",
                },
                {
                  n: "02",
                  icon: Target,
                  title: "Describe",
                  body: "Add the job title and description. The more context, the sharper the read.",
                },
                {
                  n: "03",
                  icon: Sparkles,
                  title: "Decide",
                  body: "Get a score, a summary, and a five-category breakdown — in seconds.",
                },
              ].map(({ n, icon: Icon, title, body }) => (
                <div
                  key={n}
                  className="group rounded-xl border border-border bg-card/40 p-5 transition-colors hover:bg-card"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-mono text-xs text-muted-foreground">{n}</span>
                  </div>
                  <div className="mt-6 text-base font-medium">{title}</div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section className="border-t border-border py-20">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                What we believe
              </div>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Hiring tools should{" "}
                <span className="italic font-light text-muted-foreground">
                  inform you
                </span>
                , not decide for you.
              </h2>
              <p className="mt-5 max-w-md text-muted-foreground">
                We grade resumes the way a thoughtful colleague would — explaining
                what's strong, what's thin, and where to dig deeper.
              </p>
            </div>
            <div className="space-y-6 md:pt-12">
              {[
                {
                  icon: ShieldCheck,
                  title: "Private by default",
                  body: "Your uploads stay in your library. No training, no resale, no surprises.",
                },
                {
                  icon: Target,
                  title: "Calibrated scoring",
                  body: "Five weighted categories — not one black-box number you can't argue with.",
                },
                {
                  icon: Sparkles,
                  title: "Built to be skimmed",
                  body: "Clear summaries that respect the fact you have a hundred more to read.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-4">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{title}</div>
                    <p className="text-sm text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-16">
            <div
              aria-hidden
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[image:var(--gradient-primary)] opacity-30 blur-3xl"
            />
            <div className="relative max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
                Read the next resume{" "}
                <span className="italic font-light text-muted-foreground">faster.</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Free to try. No credit card. Your library, ready when you are.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/register">
                    Create your account <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">Sign in</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-md bg-[image:var(--gradient-primary)]" />
            <span>Resume Screener</span>
          </div>
          <div>© {new Date().getFullYear()} — Quietly opinionated hiring tools.</div>
        </div>
      </footer>
    </div>
  );
}
