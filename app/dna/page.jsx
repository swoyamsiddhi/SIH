import { Header, HeroCard, BottomNav, Progress, ArcGaugeCard, FadeIn } from '../../src/components/ui'
import { athlete } from '../../src/data/mockData'
import { Activity, TrendingUp, Sparkles, Target } from 'lucide-react'

export default function DNA() {
  const attrColors = ['bg-blue', 'bg-blue', 'bg-blue', 'bg-green', 'bg-green', 'bg-green', 'bg-coral', 'bg-coral']

  return (
    <main className="phone nav-safe px-5">
      <Header title="Athlete DNA" back />

      {/* ── Hero: Overall Potential ────────────────── */}
      <HeroCard
        title="OVERALL POTENTIAL"
        subtitle="Verified Movement Profile"
        value={`${athlete.athleteDNA}/100`}
        color="blue"
        icon={<Activity size={14} className="text-blue inline" />}
      >
        <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-bold backdrop-blur-sm">
          <TrendingUp size={12} className="text-green-deep" /> +{athlete.dnaChangePercent}% this month
        </span>
      </HeroCard>

      {/* ── Sub-metric Arc Gauges ─────────────────── */}
      <FadeIn delay={0.1}>
        <div className="mt-5 space-y-3">
          <ArcGaugeCard
            title="Level activity"
            subtitle="Weekly movement intensity"
            value={38}
            trend="5%"
            trendUp={true}
            color="#4FA3D1"
          />
          <ArcGaugeCard
            title="Success endurance"
            subtitle="Sustained performance"
            value={54}
            trend="5%"
            trendUp={false}
            color="#E8735C"
          />
        </div>
      </FadeIn>

      {/* ── Attributes ────────────────────────────── */}
      <FadeIn delay={0.15}>
        <section className="card mt-5 p-5">
          <h2 className="font-bold">Your attributes</h2>
          <p className="mt-1 text-xs text-muted">Built from verified assessments</p>
          <div className="mt-5 space-y-4">
            {Object.entries(athlete.attributes).map(([name, val], i) => (
              <div key={name}>
                <div className="mb-1.5 flex justify-between text-xs font-semibold">
                  <span className="capitalize">{name}</span>
                  <b>{val}</b>
                </div>
                <Progress value={val} color={attrColors[i]} />
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── Strengths ─────────────────────────────── */}
      <FadeIn delay={0.2}>
        <h2 className="mb-3 mt-6 font-bold">Strengths</h2>
        <div className="flex flex-wrap gap-2">
          {athlete.strengths.map(x => (
            <span className="rounded-full bg-green/30 px-3.5 py-1.5 text-xs font-bold text-green-deep" key={x}>
              {x}
            </span>
          ))}
        </div>
      </FadeIn>

      {/* ── Development Areas ─────────────────────── */}
      <FadeIn delay={0.25}>
        <h2 className="mb-3 mt-6 font-bold">Development areas</h2>
        <div className="flex flex-wrap gap-2">
          {athlete.developmentAreas.map(x => (
            <span className="rounded-full bg-amber-pale px-3.5 py-1.5 text-xs font-bold text-ink" key={x}>
              {x}
            </span>
          ))}
        </div>
      </FadeIn>

      <p className="mt-8 text-center text-[10px] text-muted">
        Last updated today · Based on 8 verified assessments
      </p>

      <BottomNav />
    </main>
  )
}
