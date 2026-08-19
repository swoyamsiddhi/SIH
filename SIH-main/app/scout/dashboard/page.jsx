'use client'
import { Desk, KpiCard, FadeIn } from '../../../src/components/ui'
import { Search, Sparkles, Award, Users, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getScoutDashboard, discoverScoutAthletes } from '../../../src/lib/api/scouts'

export default function ScoutDash() {
  const [stats, setStats] = useState(null)
  const [athletes, setAthletes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const dashboardStats = await getScoutDashboard()
        setStats(dashboardStats)
        
        // Fetch top 6 athletes (no strict filters needed to just populate dashboard list)
        const topAthletes = await discoverScoutAthletes({})
        setAthletes(topAthletes.slice(0, 6))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <Desk title="Talent overview" subtitle="Loading pipeline..."><div className="p-8 text-center text-muted">Loading scout data...</div></Desk>
  }

  return (
    <Desk title="Talent overview" subtitle="Your verified athlete pipeline">
      {/* ── KPI Cards ─────────────────────────────── */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Athletes assessed" value={stats?.athletes_assessed || 0} tone="bg-blue-pale" chip="Updated today" icon={Users} />
        <KpiCard label="High potential" value={stats?.high_potential || 0} tone="bg-green/30" chip="Alerted" icon={Sparkles} />
        <KpiCard label="New alerts" value={stats?.new_alerts || 0} tone="bg-coral-pale" chip="Unread" icon={Award} />
        <KpiCard label="Upcoming trials" value={stats?.upcoming_events || 0} tone="bg-amber-pale" chip="Next 30 days" icon={Search} />
      </section>

      {/* ── High-Potential Athletes ────────────────── */}
      <FadeIn delay={0.15}>
        <section className="card mt-6 p-6">
          <div className="flex justify-between">
            <div>
              <h2 className="font-bold">High-potential athletes</h2>
              <p className="mt-1 text-xs text-muted">Recently verified, top-scoring profiles</p>
            </div>
            <Link href="/scout/discover" className="text-xs font-bold text-blue">
              Discover more →
            </Link>
          </div>
          <div className="mt-5 divide-y divide-track">
            {athletes.map(res => {
              const x = res.athlete;
              return (
                <Link
                  href={`/scout/athlete/${x.id}`}
                  className="flex items-center justify-between py-4 transition-colors hover:bg-page-cool/50 rounded-xl px-2"
                  key={x.id}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-pale text-xs font-extrabold text-blue">
                      {String(x.id).slice(-3)}
                    </div>
                    <div>
                      <b className="text-sm">{x.name || x.id}</b>
                      <p className="mt-0.5 text-xs text-muted">{res.sport_potential ? "Multiple Sports" : "Unassigned"} · {x.location} · Age {x.age}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <b className="text-lg">{res.sport_potential || 0}%</b>
                    <p className="text-[10px] font-bold text-green-deep">{res.growth_trend === 'improving' ? '↑ Improving' : res.growth_trend}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </FadeIn>

      {/* ── Quick Actions ─────────────────────────── */}
      <FadeIn delay={0.2}>
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ['Talent Search', '/scout/discover', Search, 'bg-blue-pale', 'text-blue'],
            ['AI Scout Copilot', '/scout/copilot', Sparkles, 'bg-amber-pale', 'text-amber'],
            ['Shortlisted Squads', '/scout/shortlists', Award, 'bg-green/25', 'text-green-deep'],
          ].map(([label, href, Icon, tone, textColor]) => (
            <Link key={label} href={href} className={`${tone} flex items-center gap-3 rounded-[22px] p-5 transition-all hover:shadow-float`}>
              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-white ${textColor}`}>
                <Icon size={20} />
              </span>
              <span className="text-sm font-bold text-ink">{label}</span>
            </Link>
          ))}
        </section>
      </FadeIn>
    </Desk>
  )
}

