import { Header, BottomNav, PillButton, FadeIn } from '../../src/components/ui'
import { athlete, performanceHistory } from '../../src/data/mockData'
import { User, Watch, Bell, ShieldCheck, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function Profile() {
  const fields = [
    ['Age', athlete.age],
    ['Location', athlete.location],
    ['School / Academy', athlete.school],
    ['Primary Sport', athlete.sport],
    ['Height / Weight', `${athlete.height} · ${athlete.weight}`],
    ['Dominant Side', athlete.dominant],
    ['Athlete ID', athlete.id],
  ]

  return (
    <main className="phone nav-safe px-5">
      <Header title="Profile" back />

      {/* ── Avatar & Name ─────────────────────────── */}
      <FadeIn>
        <section className="card p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green text-green-deep shadow-soft ring-4 ring-green/30">
            <User size={32} />
          </div>
          <h2 className="mt-4 text-xl font-extrabold">{athlete.name}</h2>
          <p className="mt-1 text-sm text-muted">Grassroots Athlete</p>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green/25 px-3 py-1 text-[10px] font-bold text-green-deep">
            <ShieldCheck size={13} /> Verified Athlete
          </span>
        </section>
      </FadeIn>

      {/* ── Profile Data ──────────────────────────── */}
      <FadeIn delay={0.1}>
        <section className="card mt-5 divide-y divide-track px-5">
          {fields.map(([label, value]) => (
            <div className="flex justify-between gap-4 py-4 text-sm" key={label}>
              <span className="text-muted">{label}</span>
              <b className="text-right">{value}</b>
            </div>
          ))}
        </section>
      </FadeIn>

      {/* ── Assessment History Preview ─────────────── */}
      <FadeIn delay={0.15}>
        <section className="mt-5">
          <div className="mb-3 flex justify-between">
            <h2 className="font-bold">Assessment history</h2>
            <Link href="/growth/history" className="text-xs font-bold text-blue">View all</Link>
          </div>
          <div className="card divide-y divide-track">
            {performanceHistory.slice(0, 3).map((h, i) => (
              <div className="flex items-center justify-between px-5 py-4" key={i}>
                <div>
                  <p className="text-sm font-bold">{h.test}</p>
                  <p className="mt-0.5 text-xs text-muted">{h.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{h.result}</p>
                  {h.verified && (
                    <span className="text-[10px] font-bold text-green-deep">Verified</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── Quick Links ──────────────────────────── */}
      <FadeIn delay={0.2}>
        <div className="mt-5 space-y-2">
          <PillButton href="/wearable" variant="white" className="w-full !justify-between shadow-soft">
            <span className="flex items-center gap-2">
              <Watch size={16} className="text-muted" /> Manage Wearable
            </span>
          </PillButton>
          <PillButton href="/alerts" variant="white" className="w-full !justify-between shadow-soft">
            <span className="flex items-center gap-2">
              <Bell size={16} className="text-muted" /> Scout Activity &amp; Alerts
            </span>
          </PillButton>
        </div>
      </FadeIn>

      <BottomNav />
    </main>
  )
}
