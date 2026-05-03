import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAnalysis, type StoredAnalysis } from "@/lib/analysisStore";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/categories";
import { ArrowLeft, RotateCcw, TrendingUp, TrendingDown, Minus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/results/$id")({
  component: ResultsPage,
});

function scoreVar(pct: number): string {
  if (pct >= 75) return "var(--score-good)";
  if (pct >= 50) return "var(--score-mid)";
  return "var(--score-bad)";
}

function scoreLabel(pct: number): string {
  if (pct >= 85) return "Excellent match";
  if (pct >= 70) return "Strong match";
  if (pct >= 50) return "Moderate match";
  if (pct >= 30) return "Weak match";
  return "Poor match";
}

function ScoreIcon({ pct }: { pct: number }) {
  if (pct >= 70) return <TrendingUp className="h-3.5 w-3.5" />;
  if (pct >= 40) return <Minus className="h-3.5 w-3.5" />;
  return <TrendingDown className="h-3.5 w-3.5" />;
}

function useAnimatedNumber(target: number, duration = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function ScoreRing({ score }: { score: number }) {
  const animated = useAnimatedNumber(score);
  const size = 220;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (animated / 100) * c;
  const color = scoreVar(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <div
        className="absolute inset-2 rounded-full blur-2xl opacity-30"
        style={{ background: color }}
      />
      <svg width={size} height={size} className="-rotate-90 relative">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          className="text-muted opacity-40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-bold tracking-tight tabular-nums">{animated}</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
          out of 100
        </div>
      </div>
    </div>
  );
}

function CategoryCard({
  label,
  score,
  outOf,
  comment,
  delay,
}: {
  label: string;
  score: number;
  outOf: number;
  comment: string;
  delay: number;
}) {
  const pct = outOf > 0 ? Math.round((score / outOf) * 100) : 0;
  const animated = useAnimatedNumber(pct, 1100);
  const color = scoreVar(pct);

  // Semicircle gauge
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = Math.PI * r; // half circle
  const offset = c - (animated / 100) * c;

  return (
    <Card
      className="p-5 relative overflow-hidden border-border/60 hover:border-border transition-colors"
      style={{ animation: `fadeInUp 0.5s ease-out ${delay}ms both` }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-80"
        style={{ background: color }}
      />
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-sm leading-tight">{label}</h3>
          <div
            className="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider"
            style={{ color, background: `color-mix(in oklab, ${color} 12%, transparent)` }}
          >
            <ScoreIcon pct={pct} />
            {scoreLabel(pct)}
          </div>
        </div>
      </div>

      <div className="flex items-end gap-4 mb-3">
        <div className="relative" style={{ width: size, height: size / 2 + 4 }}>
          <svg width={size} height={size / 2 + stroke} className="overflow-visible">
            <path
              d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
              stroke="currentColor"
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              className="text-muted opacity-40"
            />
            <path
              d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
              stroke={color}
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.05s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-end justify-center pb-0">
            <div className="text-center">
              <div className="text-2xl font-bold tabular-nums leading-none" style={{ color }}>
                {animated}
                <span className="text-xs text-muted-foreground font-medium">%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-3xl font-bold tabular-nums leading-none">{score}</div>
          <div className="text-xs text-muted-foreground mt-1">of {outOf}</div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed pt-3 border-t border-border/60">
        {comment}
      </p>
    </Card>
  );
}

function ResultsPage() {
  const { id } = useParams({ from: "/_authenticated/app/results/$id" });
  const navigate = useNavigate();
  const [data, setData] = useState<StoredAnalysis | undefined>(undefined);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    setData(getAnalysis(id));
    setResolved(true);
  }, [id]);

  if (!resolved) return null;

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Result not available</h1>
        <p className="text-muted-foreground mt-2">
          Analysis results are kept in memory only. Run the analysis again to view it.
        </p>
        <Button className="mt-6" onClick={() => navigate({ to: "/app" })}>
          Start a new analysis
        </Button>
      </div>
    );
  }

  const { result, resumeFilename, jobTitle } = data;
  const headlineColor = scoreVar(result.score);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="flex items-center justify-between mb-6">
        <Link
          to="/app"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          New analysis
        </Link>
        <Link to="/app/library" className="text-sm text-muted-foreground hover:text-foreground">
          Library
        </Link>
      </div>

      <Card className="p-8 sm:p-12 text-center bg-card border-border relative overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full opacity-[0.07] blur-3xl pointer-events-none"
          style={{ background: headlineColor }}
        />
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {resumeFilename} · {jobTitle}
          </div>
          <div className="mt-6">
            <ScoreRing score={result.score} />
          </div>
          <div
            className="inline-flex items-center gap-1.5 mt-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
            style={{
              color: headlineColor,
              background: `color-mix(in oklab, ${headlineColor} 14%, transparent)`,
            }}
          >
            <ScoreIcon pct={result.score} />
            {scoreLabel(result.score)}
          </div>
          <p className="mt-6 mx-auto max-w-2xl text-base sm:text-lg text-foreground/90 leading-relaxed">
            {result.summary}
          </p>
        </div>
      </Card>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORY_ORDER.map((key, i) => {
          const s = result.sections[key];
          if (!s) return null;
          return (
            <CategoryCard
              key={key}
              label={CATEGORY_LABELS[key]}
              score={s.score}
              outOf={s.outOf}
              comment={s.comment}
              delay={i * 80}
            />
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={() => navigate({ to: "/app" })}>
          <RotateCcw className="h-4 w-4 mr-1.5" />
          Analyze another
        </Button>
      </div>
    </div>
  );
}
