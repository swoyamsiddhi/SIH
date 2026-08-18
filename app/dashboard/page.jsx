import { Header, HeroCard, BottomNav, PillButton, Progress, FadeIn, StatChip } from '../../src/components/ui'
import { athlete, sportMatches, events, scoutAlerts } from '../../src/data/mockData'
import { Dumbbell, TrendingUp, Trophy, Activity, Calendar, ShieldCheck, ArrowRight, Bell, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const unreadAlerts = scoutAlerts.filter(a => !a.read).length

  return (
    <main className="phone nav-safe px-5">
      <Header />

      {/* ── Athlete DNA Hero ──────────────────────── */}
      <HeroCard
        title="ATHLETE DNA"
        subtitle="Potential Score"
        value={`${athlete.athleteDNA}/100`}
        action="/dna"
        color="green"
        icon={<Activity size={14} className="text-green-deep inline" />}
      >
        <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-bold backdrop-blur-sm">
          <TrendingUp size={12} className="text-green-deep" /> +{athlete.dnaChangePercent}% this month
        </span>
      </HeroCard>

      {/* ── Quick Stats Row ───────────────────────── */}
      <FadeIn delay={0.1}>
        <div className="mt-5 flex gap-3">
          <StatChip icon={<Dumbbell size={16} />} value="8" label="Assessments" tone="bg-blue-pale" />
          <StatChip icon={<TrendingUp size={16} />} value="+14%" label="Growth (90d)" tone="bg-green/30" />
          <StatChip icon={<Trophy size={16} />} value="3" label="Events" tone="bg-amber-pale" />
        </div>
      </FadeIn>

      {/* ── Potential Sports ──────────────────────── */}
      <FadeIn delay={0.15}>
        <section className="mt-6">
          <div className="mb-3 flex justify-between">
            <h2 className="font-bold">Potential sports</h2>
            <Link href="/sports" className="text-xs font-bold text-blue">See all</Link>
          </div>
          <div className="card p-4">
            {sportMatches.slice(0, 3).map((x, i) => (
              <Link href={`/sports/${x.sport.toLowerCase()}`} className="mb-4 block last:mb-0" key={x.sport}>
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{x.sport}</span>
                  <b>{x.match}% match</b>
                </div>
                <div className="mt-1.5">
                  <Progress value={x.match} color={['bg-blue', 'bg-coral', 'bg-amber'][i]} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── Next Assessment ───────────────────────── */}
      <FadeIn delay={0.2}>
        <div className="card mt-5 flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-pale text-blue">
              <Activity size={20} />
            </span>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-muted">NEXT ASSESSMENT</p>
              <h2 className="mt-0.5 font-bold">Vertical Jump</h2>
              <p className="mt-0.5 text-xs text-muted">Build your Athlete DNA</p>
            </div>
          </div>
          <PillButton href="/assessments/vertical-jump">Start</PillButton>
        </div>
      </FadeIn>

      {/* ── Upcoming Event ────────────────────────── */}
      <FadeIn delay={0.25}>
        <div className="card mt-4 flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-pale text-amber">
              <Calendar size={20} />
            </span>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-muted">UPCOMING EVENT</p>
              <h2 className="mt-0.5 font-bold">{events[0].name}</h2>
              <p className="mt-0.5 text-xs text-muted">{events[0].location} · {events[0].date}</p>
            </div>
          </div>
          <PillButton href="/events" variant="amber">View</PillButton>
        </div>
      </FadeIn>

      {/* ── Scout Status ──────────────────────────── */}
      <FadeIn delay={0.3}>
        <Link href="/alerts" className="mt-4 block rounded-[22px] bg-blue-pale p-5 transition-all hover:shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-blue" />
              <p className="text-xs font-bold">SCOUT STATUS</p>
            </div>
            {unreadAlerts > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[9px] font-bold text-white">
                {unreadAlerts}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm">
            {unreadAlerts > 0
              ? `${unreadAlerts} new scout interest alerts — tap to view`
              : 'Profile active and verified for scout discovery.'}
          </p>
        </Link>
      </FadeIn>

      <BottomNav />
    </main>
  )
}
