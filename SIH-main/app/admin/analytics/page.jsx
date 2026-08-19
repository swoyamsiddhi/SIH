import { useState, useEffect } from 'react'
import { Desk, FadeIn, Progress } from '../../../src/components/ui'
import { api } from '../../../src/lib/api'
import { Sparkles, Building2, Users, Trophy } from 'lucide-react'

export default function Analytics() {
  const [hotspots, setHotspots] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.admin.getHotspots()
        setHotspots(data)
      } catch(e) {
        console.error(e)
      }
    }
    load()
  }, [])

  if (!hotspots) return <Desk title="Loading" admin />

  return (
    <Desk title="Talent analytics" subtitle="Hotspot detection and growth trends" admin>
      {/* ── Hotspot Cards ─────────────────────────── */}
      <FadeIn>
        <section className="mt-7">
          <h2 className="mb-4 font-bold">Talent hotspots</h2>
          {hotspots.length === 0 ? (
            <p className="text-sm text-muted">No hotspots detected yet. Seed more data.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hotspots.slice(0, 5).map((h, i) => (
                <div className="card overflow-hidden" key={h.district}>
                  <div className={`p-4 ${['bg-blue-pale', 'bg-coral-pale', 'bg-amber-pale', 'bg-green/25', 'bg-blue-pale'][i % 5]}`}>
                    <p className="text-[10px] font-bold text-muted uppercase">Hotspot #{i + 1}</p>
                    <h3 className="mt-1 text-lg font-extrabold">{h.district}</h3>
                    <p className="text-xs text-muted">{h.state}</p>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Top sport</span>
                      <b>{h.sport}</b>
                    </div>
                    <div className="mt-2 flex justify-between text-xs">
                      <span className="text-muted">Athletes</span>
                      <b>{h.athletes.toLocaleString()}</b>
                    </div>
                    <div className="mt-2 flex justify-between text-xs">
                      <span className="text-muted">Growth</span>
                      <b className={h.growth > 0 ? "text-green-deep" : "text-amber"}>{h.growth > 0 ? "↑" : ""} {h.growth}%</b>
                    </div>
                    <div className="mt-3">
                      <Progress value={Math.max(0, Math.min(h.growth * 3, 100))} color={h.growth >= 10 ? 'bg-green' : 'bg-blue'} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </FadeIn>

      {/* ── Sprint Region Rankings ────────────────── */}
      <FadeIn delay={0.1}>
        <section className="card mt-8 p-6">
          <h2 className="font-bold">Top sprint regions</h2>
          <p className="mt-1 text-xs text-muted">Ranked by assessment growth rate</p>
          <div className="mt-5 space-y-4">
            {hotspots
              .filter(r => r.sport === 'Sprinting' || r.sport === 'Sprint')
              .map((r, i) => (
                <div key={r.district}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span><b>{i + 1}.</b> {r.district}, {r.state}</span>
                    <span className="font-bold text-green-deep">↑ {r.growth}%</span>
                  </div>
                  <Progress value={Math.max(0, Math.min(r.growth * 4, 100))} color={i === 0 ? 'bg-coral' : 'bg-blue'} />
                </div>
              ))}
          </div>
        </section>
      </FadeIn>

      {/* ── Emerging Region Highlight ─────────────── */}
      {hotspots.length > 0 && (
        <FadeIn delay={0.15}>
          <section className="mt-6 rounded-[22px] bg-amber-pale p-6">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber">
              <Sparkles size={14} />
              <span className="uppercase tracking-wider">Emerging Region</span>
            </div>
            <h3 className="mt-2 text-xl font-extrabold text-ink">{hotspots[0].district}, {hotspots[0].state}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              ↑ <b>{hotspots[0].growth}% growth</b> in {hotspots[0].sport.toLowerCase()} potential assessments. Recommended for priority allocation of additional training facilities, coaches, and sports science support.
            </p>
          </section>
        </FadeIn>
      )}

      {/* ── Recommendation cards ──────────────────── */}
      <FadeIn delay={0.2}>
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ['Infrastructure', 'Recommend new training centres in 3 emerging districts', Building2, 'text-blue'],
            ['Coaches & Staff', '12 districts need certified coaching staff placement', Users, 'text-green-deep'],
            ['Talent Trials', '5 underserved regions ready for talent hunt events', Trophy, 'text-amber'],
          ].map(([title, desc, Icon, iconColor]) => (
            <div className="card p-5" key={title}>
              <div className="flex items-center gap-2.5">
                <Icon size={18} className={iconColor} />
                <h3 className="text-sm font-bold">{title}</h3>
              </div>
              <p className="mt-2 text-xs text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>
      </FadeIn>
    </Desk>
  )
}
