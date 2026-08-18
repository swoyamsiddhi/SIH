'use client'
import { Header, BottomNav, FadeIn, PillButton, StatChip } from '../../src/components/ui'
import { growthHistory, personalBests } from '../../src/data/mockData'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { TrendingUp, Trophy, RotateCcw, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Growth() {
  const chartData = growthHistory.months.map((m, i) => ({
    month: m,
    Overall: growthHistory.overall[i],
    Power: growthHistory.power[i],
  }))

  return (
    <main className="phone nav-safe px-5">
      <Header title="My progress" back />

      {/* ── Stat Chips ────────────────────────────── */}
      <FadeIn>
        <div className="flex gap-3">
          <StatChip icon={<TrendingUp size={16} />} value="+14%" label="90-day growth" tone="bg-green/25" />
          <StatChip icon={<Trophy size={16} />} value="4" label="Personal bests" tone="bg-amber-pale" />
          <StatChip icon={<RotateCcw size={16} />} value="8" label="Assessments" tone="bg-blue-pale" />
        </div>
      </FadeIn>

      {/* ── Performance Chart ─────────────────────── */}
      <FadeIn delay={0.1}>
        <section className="card mt-5 p-5">
          <div className="flex justify-between">
            <div>
              <h2 className="font-bold">Performance trend</h2>
              <p className="mt-1 text-xs text-muted">Overall DNA vs Power over 6 months</p>
            </div>
          </div>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4FA3D1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4FA3D1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCoral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E8735C" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#E8735C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E8" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8B8B90' }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#8B8B90' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.08)', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="Overall" stroke="#4FA3D1" strokeWidth={2.5} fill="url(#gBlue)" dot={{ r: 4, fill: '#4FA3D1' }} />
                <Area type="monotone" dataKey="Power" stroke="#E8735C" strokeWidth={2.5} fill="url(#gCoral)" dot={{ r: 4, fill: '#E8735C' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-center gap-5 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue" />Overall DNA</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-coral" />Power</span>
          </div>
        </section>
      </FadeIn>

      {/* ── AI Insight ────────────────────────────── */}
      <FadeIn delay={0.15}>
        <section className="mt-4 rounded-[22px] bg-blue-pale p-5 text-ink">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-blue" />
            <p className="text-xs font-bold uppercase tracking-wider">DEVELOPMENT INSIGHT</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed">
            Your explosive power improved <b>12%</b> over the last 3 assessments. Focus on sustained endurance work to unlock your next DNA milestone.
          </p>
        </section>
      </FadeIn>

      {/* ── Personal Bests ────────────────────────── */}
      <FadeIn delay={0.2}>
        <section className="mt-5">
          <h2 className="mb-3 font-bold">Personal bests</h2>
          <div className="grid grid-cols-2 gap-3">
            {personalBests.map((pb, i) => (
              <div className="card p-4" key={i}>
                <p className="text-xs text-muted">{pb.metric}</p>
                <p className="mt-1 text-lg font-extrabold">{pb.value}</p>
                <p className="mt-1 text-[10px] text-muted">{pb.date}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── History Link ──────────────────────────── */}
      <FadeIn delay={0.25}>
        <PillButton href="/growth/history" variant="white" className="mt-5 w-full shadow-soft">
          View full history
        </PillButton>
      </FadeIn>

      <BottomNav />
    </main>
  )
}
