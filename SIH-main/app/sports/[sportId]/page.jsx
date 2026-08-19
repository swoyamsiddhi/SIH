'use client'
import { useState, useEffect } from 'react'
import { Header, PillButton, Progress, FadeIn } from '../../../src/components/ui'
import { api } from '../../../src/lib/api'

export default function Sport({ params }) {
  const [s, setS] = useState(null)
  const colors = ['bg-blue', 'bg-green', 'bg-coral', 'bg-amber']

  useEffect(() => {
    async function loadData() {
      const matches = await api.athletes.getSportPotential()
      const match = matches.find(x => x.sport.toLowerCase() === params.sportId) || matches[0]
      setS(match)
    }
    loadData()
  }, [params.sportId])

  if (!s) return <div className="p-10 text-center text-muted">Loading sport details...</div>

  const attrs = s.contributingAttrs || { 'Data Missing': 0 }

  return (
    <main className="phone min-h-screen px-5 pb-10">
      <Header title={`Why ${s.sport}?`} back />

      {/* ── Hero: Suitability Match ───────────────── */}
      <section className="relative overflow-hidden rounded-[28px] bg-coral p-6 shadow-float">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15" />
        <div className="absolute -right-2 top-14 h-20 w-20 rounded-full bg-white/10" />
        <div className="relative">
          <p className="text-xs font-bold tracking-wider">SUITABILITY MATCH</p>
          <p className="mt-4 text-[52px] font-extrabold leading-none tracking-tight">{s.match}%</p>
          <p className="mt-4 text-sm leading-relaxed">
            Your verified movement profile aligns strongly with the core demands of {s.sport}.
          </p>
        </div>
      </section>

      {/* ── Contributing Attributes ───────────────── */}
      <FadeIn delay={0.1}>
        <section className="card mt-5 p-5">
          <h2 className="font-bold">What contributes</h2>
          <p className="mt-1 text-xs text-muted">Attributes that drive this match</p>
          <div className="mt-5 space-y-4">
            {Object.entries(attrs).map(([name, val], i) => (
              <div key={name}>
                <div className="mb-1.5 flex justify-between text-xs font-semibold">
                  <span>{name}</span>
                  <b>{val}</b>
                </div>
                <Progress value={val} color={colors[i % colors.length]} />
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── Disclaimer ────────────────────────────── */}
      <FadeIn delay={0.15}>
        <p className="mt-5 rounded-2xl bg-white p-4 text-xs leading-relaxed text-muted shadow-soft">
          This score describes potential and suitability based on current assessment data. It is not a guarantee of selection, performance, or future success.
        </p>
      </FadeIn>

      <PillButton href="/dna" variant="amber" className="mt-6 w-full !py-4">
        VIEW DEVELOPMENT PLAN
      </PillButton>
    </main>
  )
}
