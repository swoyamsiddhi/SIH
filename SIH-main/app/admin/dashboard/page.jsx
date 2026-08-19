import { useState, useEffect } from 'react'
import { Desk, KpiCard, FadeIn } from '../../../src/components/ui'
import { api } from '../../../src/lib/api'
import { Map, BarChart3, Calendar, Cpu, Users, Activity, Trophy } from 'lucide-react'
import Link from 'next/link'

export default function AdminDash() {
  const [stats, setStats] = useState(null)
  
  useEffect(() => {
    async function load() {
      try {
        const data = await api.admin.getKPIs()
        setStats(data)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  if (!stats) return <Desk title="Loading" admin />

  return (
    <Desk title="National overview" subtitle="Real-time sports intelligence" admin>
      {/* ── KPI Grid ──────────────────────────────── */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Athletes assessed" value={stats.athletes_assessed} tone="bg-blue-pale" chip="All India" icon={Users} />
        <KpiCard label="Active athletes" value={stats.active_athletes} tone="bg-green/30" chip="Last 90 days" icon={Activity} />
        <KpiCard label="High potential" value={stats.high_potential} tone="bg-amber-pale" chip="Top 2.3%" icon={Trophy} />
        <KpiCard label="Events conducted" value={stats.events} tone="bg-coral-pale" chip="This year" icon={Calendar} />
        <KpiCard label="Assessments today" value={stats.assessments_today} tone="bg-blue-pale" chip="Live Telemetry" icon={Activity} />
        <KpiCard label="Regions covered" value={stats.regions_covered} tone="bg-green/30" chip="36 States & UTs" icon={Map} />
      </section>

      {/* ── Quick Nav ─────────────────────────────── */}
      <FadeIn delay={0.15}>
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['India Talent Map', '/admin/talent-map', 'Interactive state athlete density', Map, 'bg-blue-pale', 'text-blue'],
            ['Talent Analytics', '/admin/analytics', 'Hotspot & growth velocity analysis', BarChart3, 'bg-amber-pale', 'text-amber'],
            ['Event Management', '/admin/events', 'Trials schedule & live testing mode', Calendar, 'bg-green/25', 'text-green-deep'],
            ['Hardware Infrastructure', '/admin/hardware', 'Testing kit telemetry & status', Cpu, 'bg-coral-pale', 'text-coral'],
          ].map(([label, href, desc, Icon, tone, textColor]) => (
            <Link key={href} href={href} className={`${tone} rounded-[22px] p-5 transition-all hover:-translate-y-0.5 hover:shadow-float block`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white ${textColor} mb-3 shadow-soft`}>
                <Icon size={20} />
              </div>
              <h3 className="text-base font-bold text-ink">{label}</h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">{desc}</p>
            </Link>
          ))}
        </section>
      </FadeIn>

      {/* ── Recent Activity ───────────────────────── */}
      <FadeIn delay={0.2}>
        <section className="card mt-8 p-6">
          <h2 className="font-bold">Recent platform telemetry</h2>
          <div className="mt-4 divide-y divide-track">
            {[
              [`${stats.assessments_today} assessments completed today across ${stats.regions_covered} regions`, '2 min ago', 'bg-green-deep'],
              ['Khelo Talent Hunt Chennai — Check-ins active', '1 hour ago', 'bg-blue'],
              [`${stats.high_potential} high-potential athletes flagged total`, '3 hours ago', 'bg-amber'],
              ['KIT-002 battery low alert logged in Delhi facility', '4 hours ago', 'bg-coral'],
            ].map(([text, time, dotColor], i) => (
              <div className="flex items-center gap-3 py-3.5" key={i}>
                <span className={`h-2 w-2 rounded-full ${dotColor} flex-shrink-0`} />
                <p className="flex-1 text-sm">{text}</p>
                <span className="text-xs text-muted">{time}</span>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>
    </Desk>
  )
}
