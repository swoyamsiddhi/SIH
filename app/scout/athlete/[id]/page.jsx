'use client'
import { useState } from 'react'
import { Desk, PillButton, Progress, FadeIn, ArcGaugeCard } from '../../../../src/components/ui'
import { athlete, scoutAthletes, sportMatches } from '../../../../src/data/mockData'
import { ShieldCheck, ClipboardCheck, Check, TrendingUp } from 'lucide-react'

export default function ScoutAthleteProfile({ params }) {
  const [shortlisted, setShortlisted] = useState(false)
  const a = scoutAthletes.find(x => x.id === params.id) || scoutAthletes[0]

  return (
    <Desk title={a.id} subtitle={`${a.sport} potential · ${a.location} · Age ${a.age}`}>
      <section className="mt-7 grid gap-5 lg:grid-cols-[1.4fr_.8fr]">
        {/* ── Main: DNA + Attributes ────────────── */}
        <div className="space-y-5">
          <FadeIn>
            <div className="card p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-muted">ATHLETE DNA</p>
                  <p className="mt-1 text-[44px] font-extrabold leading-none">
                    86<span className="text-lg text-muted">/100</span>
                  </p>
                </div>
                <span className="self-start flex items-center gap-1 rounded-full bg-green/30 px-3 py-1.5 text-xs font-bold text-green-deep">
                  <ShieldCheck size={13} /> {a.verification}% Verified
                </span>
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {Object.entries(athlete.attributes).map(([name, val], i) => (
                  <div key={name}>
                    <div className="mb-1 flex justify-between text-xs font-semibold">
                      <span className="capitalize">{name}</span>
                      <b>{val}</b>
                    </div>
                    <Progress value={val} color={i < 3 ? 'bg-blue' : i < 6 ? 'bg-green' : 'bg-coral'} />
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* ── Sport Potential ──────────────────── */}
          <FadeIn delay={0.1}>
            <div className="card p-6">
              <h2 className="font-bold">Sport potential</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {sportMatches.slice(0, 3).map(x => (
                  <div className="rounded-2xl bg-page-cool p-4" key={x.sport}>
                    <p className="text-[10px] text-muted">{x.sport}</p>
                    <p className="mt-1 text-2xl font-extrabold">{x.match}%</p>
                    <div className="mt-2">
                      <Progress value={x.match} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* ── Sub-metrics ─────────────────────── */}
          <FadeIn delay={0.15}>
            <div className="grid gap-4 sm:grid-cols-2">
              <ArcGaugeCard title="Level activity" subtitle="Weekly intensity" value={72} trend="8%" trendUp={true} color="#4FA3D1" />
              <ArcGaugeCard title="Consistency" subtitle="Assessment variance" value={89} trend="3%" trendUp={true} color="#8FCB9E" />
            </div>
          </FadeIn>
        </div>

        {/* ── Sidebar ───────────────────────────── */}
        <aside className="space-y-5">
          <FadeIn delay={0.05}>
            <div className="relative overflow-hidden rounded-[24px] bg-green p-6 shadow-float text-ink">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/15" />
              <p className="text-[10px] font-bold tracking-wider">GROWTH · 90 DAYS</p>
              <p className="mt-3 text-[44px] font-extrabold leading-none">+{a.growth}%</p>
              <p className="mt-2 text-xs font-semibold">Consistent upward trajectory</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-[22px] bg-blue-pale p-5">
              <div className="flex items-center gap-2">
                <ClipboardCheck size={16} className="text-blue" />
                <p className="text-xs font-bold uppercase tracking-wider">Assessment Count</p>
              </div>
              <p className="mt-2 text-3xl font-extrabold">8</p>
              <p className="mt-1 text-xs text-muted">Last: 18 Aug 2026</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <PillButton
              onClick={() => setShortlisted(!shortlisted)}
              variant={shortlisted ? 'amber' : 'dark'}
              className="w-full"
            >
              {shortlisted ? 'SHORTLISTED' : 'ADD TO SHORTLIST'}
            </PillButton>
          </FadeIn>

          <FadeIn delay={0.2}>
            <PillButton variant="amber" className="w-full">
              REQUEST EVALUATION
            </PillButton>
          </FadeIn>

          {/* Strengths */}
          <FadeIn delay={0.25}>
            <div className="card p-5">
              <h3 className="text-sm font-bold">Strengths</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {athlete.strengths.map(s => (
                  <span className="rounded-full bg-green/25 px-3 py-1.5 text-[10px] font-bold text-green-deep" key={s}>{s}</span>
                ))}
              </div>
              <h3 className="mt-4 text-sm font-bold">Development</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {athlete.developmentAreas.map(s => (
                  <span className="rounded-full bg-amber-pale px-3 py-1.5 text-[10px] font-bold" key={s}>{s}</span>
                ))}
              </div>
            </div>
          </FadeIn>
        </aside>
      </section>
    </Desk>
  )
}
