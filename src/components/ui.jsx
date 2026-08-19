'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Bell, ChevronLeft, Home, ClipboardCheck, Trophy, TrendingUp,
  UserRound, Search, LayoutDashboard, Users, ArrowRight, Check,
  Play, Watch, Dumbbell, Zap, Calendar, ShieldCheck, MapPin,
  Cpu, BarChart3, MessageCircle, Phone, Share2, MoreHorizontal,
  Activity, Target, Timer, Award, ChevronRight, Wifi, WifiOff,
  Battery, BatteryWarning, Settings, Sparkles, Filter, X, Flame,
  Radio, Compass, Map,
} from 'lucide-react'
import { motion } from 'framer-motion'

/* ═══════════════════════════════════════════════════════
   LAYOUT  —  Role Switcher
   ═══════════════════════════════════════════════════════ */
export function RoleSwitcher() {
  const path = usePathname()
  const router = useRouter()
  const role = path?.startsWith('/scout') ? 'Scout'
    : path?.startsWith('/admin') ? 'Admin'
    : 'Athlete'
  const dest = { Athlete: '/dashboard', Scout: '/scout/dashboard', Admin: '/admin/dashboard' }
  return (
    <div className="fixed right-4 top-4 z-50 flex rounded-full bg-white p-1 shadow-float">
      {Object.keys(dest).map(x => (
        <button
          key={x}
          onClick={() => router.push(dest[x])}
          className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${role === x ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}
        >
          {x}
        </button>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   HEADER  —  Athlete screens
   ═══════════════════════════════════════════════════════ */
export function Header({ title, back = false }) {
  const router = useRouter()
  return (
    <header className="flex items-center justify-between pb-6 pt-8">
      <div className="flex items-center gap-3">
        {back && (
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-soft transition-transform hover:scale-105"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          {title ? (
            <>
              <p className="text-[10px] font-bold tracking-[.18em] text-muted">KHEL-NET</p>
              <h1 className="text-xl font-extrabold">{title}</h1>
            </>
          ) : (
            <>
              <p className="text-xs text-muted">Good morning,</p>
              <h1 className="text-xl font-extrabold">Neeraj</h1>
            </>
          )}
        </div>
      </div>
      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-soft transition-transform hover:scale-105">
        <Bell size={17} />
      </button>
    </header>
  )
}

/* ═══════════════════════════════════════════════════════
   PILL BUTTON
   ═══════════════════════════════════════════════════════ */
export function PillButton({ children, href, onClick, variant = 'dark', className = '' }) {
  const base = `pill inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold`
  const colors = {
    dark: 'bg-ink text-white',
    amber: 'bg-amber text-ink',
    white: 'bg-white text-ink',
    coral: 'bg-coral text-white',
    blue: 'bg-blue text-white',
    green: 'bg-green-deep text-white',
    outline: 'bg-transparent border-2 border-ink text-ink',
  }
  const c = `${base} ${colors[variant] || colors.dark} ${className}`
  return href
    ? <Link href={href} className={c}>{children}<ArrowRight size={14} /></Link>
    : <button onClick={onClick} className={c}>{children}</button>
}

/* ═══════════════════════════════════════════════════════
   HERO CARD  —  colored accent card
   ═══════════════════════════════════════════════════════ */
export function HeroCard({ title, subtitle, value, children, action, icon = null, color = 'blue' }) {
  const bg = { blue: 'bg-blue', green: 'bg-green', coral: 'bg-coral', amber: 'bg-amber' }[color] || 'bg-blue'
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`${bg} relative overflow-hidden rounded-[28px] p-6 text-ink shadow-float`}
    >
      {/* decorative circles */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15" />
      <div className="absolute -right-4 top-16 h-24 w-24 rounded-full bg-white/10" />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-bold backdrop-blur-sm">
          {icon} {subtitle}
        </span>
        <p className="mt-5 text-sm font-semibold">{title}</p>
        <div className="mt-2 flex items-end justify-between">
          <p className="text-[40px] font-extrabold leading-none tracking-tight">{value}</p>
          {action && (
            <PillButton href={action} variant="dark" className="!px-4 !py-2.5">
              Explore
            </PillButton>
          )}
        </div>
        {children}
      </div>
    </motion.section>
  )
}

/* ═══════════════════════════════════════════════════════
   STAT CHIP
   ═══════════════════════════════════════════════════════ */
export function StatChip({ label, value, icon = null, tone = 'bg-blue-pale' }) {
  return (
    <div className={`${tone} flex-1 rounded-2xl p-3.5`}>
      {icon && <div className="text-muted mb-1">{icon}</div>}
      <p className="text-base font-extrabold">{value}</p>
      <p className="mt-0.5 text-[10px] text-muted">{label}</p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════════════════ */
export function Progress({ value = 0, color = 'bg-ink', track = 'bg-track', className = '' }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full ${track} ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CIRCULAR ICON BUTTON
   ═══════════════════════════════════════════════════════ */
export function CircularIconButton({ icon: Icon, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-soft transition-transform hover:scale-105 ${className}`}
    >
      <Icon size={17} />
    </button>
  )
}

/* ═══════════════════════════════════════════════════════
   KPI CARD  —  Desktop dashboards
   ═══════════════════════════════════════════════════════ */
export function KpiCard({ label, value, tone = 'bg-blue-pale', chip, icon: Icon }) {
  return (
    <div className={`${tone} rounded-[22px] p-5 shadow-soft`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-muted uppercase tracking-wider">{label}</p>
        {Icon && <Icon size={16} className="text-muted" />}
      </div>
      <p className="mt-2 text-3xl font-extrabold tracking-tight">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {chip && (
        <span className="mt-3 inline-block rounded-full bg-white/70 px-2.5 py-0.5 text-[10px] font-bold text-ink">
          {chip}
        </span>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   ARC GAUGE CARD
   ═══════════════════════════════════════════════════════ */
export function ArcGaugeCard({
  title,
  subtitle,
  value = 50,
  trend = '5%',
  trendUp = true,
  color = '#4FA3D1',
}) {
  const radius = 38
  const strokeWidth = 8
  const startAngle = 135
  const endAngle = 405
  const totalAngle = endAngle - startAngle
  const currentAngle = startAngle + (totalAngle * Math.min(100, Math.max(0, value))) / 100

  const polarToCartesian = (cx, cy, r, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    }
  }

  const describeArc = (cx, cy, r, startA, endA) => {
    const start = polarToCartesian(cx, cy, r, endA)
    const end = polarToCartesian(cx, cy, r, startA)
    const largeArcFlag = endA - startA <= 180 ? '0' : '1'
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex items-center justify-between p-5"
    >
      <div>
        <h3 className="text-base font-extrabold">{title}</h3>
        <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
        <span className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
          trendUp ? 'bg-green/25 text-green-deep' : 'bg-coral-pale text-coral'
        }`}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
      </div>

      <div className="relative flex h-24 w-24 items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <path
            d={describeArc(50, 50, radius, startAngle, endAngle)}
            fill="none"
            stroke="#E5E5E8"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path
            d={describeArc(50, 50, radius, startAngle, currentAngle)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-lg font-extrabold leading-none">{value}%</span>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   WAVEFORM CARD
   ═══════════════════════════════════════════════════════ */
export function WaveformCard({
  title,
  value,
  unit = 'cm',
  comparison,
  color = 'blue',
}) {
  const bg = { blue: 'bg-blue', green: 'bg-green', coral: 'bg-coral' }[color] || 'bg-blue'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bg} relative overflow-hidden rounded-[28px] p-6 text-ink shadow-float`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-[52px] font-extrabold leading-none tracking-tight">{value}</span>
            <span className="text-lg font-bold">{unit}</span>
          </div>
        </div>
        {comparison && (
          <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold backdrop-blur-sm">
            {comparison}
          </span>
        )}
      </div>

      <div className="mt-4 h-16 w-full">
        <svg viewBox="0 0 300 60" className="h-full w-full overflow-visible">
          <path
            d="M0,35 Q30,35 45,20 T75,45 T105,10 T135,50 T165,25 T195,35 T225,15 T255,40 T300,30"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   TICK ROW CARD
   ═══════════════════════════════════════════════════════ */
export function TickRowCard({
  title,
  value,
  unit = '%',
  ticks = [60, 75, 90, 85, 95, 70, 80, 92, 88, 94, 78, 85, 90, 96, 92],
  color = 'green',
}) {
  const bg = { blue: 'bg-blue', green: 'bg-green', coral: 'bg-coral' }[color] || 'bg-green'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bg} rounded-[28px] p-6 text-ink shadow-float`}
    >
      <p className="text-xs font-bold tracking-wider">{title}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-[52px] font-extrabold leading-none tracking-tight">{value}</span>
        <span className="text-lg font-bold">{unit}</span>
      </div>

      <div className="mt-4 flex h-10 items-end justify-between gap-1">
        {ticks.map((h, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-ink/75"
            style={{ height: `${Math.max(15, h)}%` }}
          />
        ))}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   SEGMENTED RING CARD
   ═══════════════════════════════════════════════════════ */
export function SegmentedRingCard({
  title,
  subtitle,
  segments = [
    { label: 'Video', value: 20, color: '#4FA3D1' },
    { label: 'Pose', value: 22, color: '#8FCB9E' },
    { label: 'Sensor', value: 20, color: '#EAB74A' },
    { label: 'Timing', value: 18, color: '#E8735C' },
    { label: 'Device', value: 20, color: '#3FA35A' },
  ],
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  let cumulative = 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <h3 className="font-bold">{title}</h3>
      {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}

      <div className="mt-6 flex items-center gap-6">
        <div className="relative h-28 w-28 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="-rotate-90">
            {segments.map((seg, i) => {
              const dashArray = (seg.value / total) * 251.2
              const dashOffset = -((cumulative / total) * 251.2)
              cumulative += seg.value
              return (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="10"
                  strokeDasharray={`${dashArray} 251.2`}
                  strokeDashoffset={dashOffset}
                />
              )
            })}
          </svg>
        </div>

        <div className="flex-1 space-y-2">
          {segments.map(seg => (
            <div key={seg.label} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                {seg.label}
              </span>
              <b>{seg.value}%</b>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   CONTACT ROW
   ═══════════════════════════════════════════════════════ */
export function ContactRow({ name, role, tone = 'bg-blue-pale' }) {
  return (
    <div className={`${tone} flex items-center gap-4 rounded-[22px] p-4`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-muted shadow-soft">
        <UserRound size={20} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold">{name}</p>
        <p className="text-xs text-muted">{role}</p>
      </div>
      <CircularIconButton icon={MessageCircle} />
      <CircularIconButton icon={Phone} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   BOTTOM NAV  —  Athlete mobile app
   ═══════════════════════════════════════════════════════ */
export function BottomNav() {
  const path = usePathname()
  const list = [
    ['/dashboard', Home, 'Home'],
    ['/assessments', ClipboardCheck, 'Assess'],
    ['/growth', TrendingUp, 'Growth'],
    ['/events', Calendar, 'Events'],
    ['/profile', UserRound, 'Profile'],
  ]
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[430px] -translate-x-1/2 justify-around rounded-t-[26px] bg-white px-3 py-3 shadow-[0_-8px_30px_rgba(0,0,0,.07)]">
      {list.map(([href, Icon, label]) => {
        const active = path === href || (href !== '/dashboard' && path?.startsWith(href))
        return (
          <Link
            href={href}
            key={href}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${active ? 'text-white' : 'text-muted'}`}
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${active ? 'bg-ink shadow-soft' : ''}`}>
              <Icon size={17} />
            </span>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

/* ═══════════════════════════════════════════════════════
   SIDE NAV  —  Scout desktop
   ═══════════════════════════════════════════════════════ */
export function SideNav() {
  const path = usePathname()
  const links = [
    ['/scout/dashboard', LayoutDashboard, 'Overview'],
    ['/scout/discover', Search, 'Discover'],
    ['/scout/copilot', Sparkles, 'AI Copilot'],
    ['/scout/shortlists', Award, 'Shortlists'],
    ['/scout/athlete/ATH-28473', Users, 'Athletes'],
  ]
  return (
    <aside className="w-64 border-r border-track bg-white p-6 hidden md:block">
      <div className="flex items-center gap-2">
        <Activity size={20} className="text-green-deep" />
        <span className="text-xs font-bold tracking-[.18em] text-muted">KHEL-NET SCOUT</span>
      </div>
      <nav className="mt-8 space-y-1">
        {links.map(([href, Icon, label]) => {
          const active = path === href || (href !== '/scout/dashboard' && path?.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                active ? 'bg-ink text-white' : 'text-muted hover:bg-page-cool hover:text-ink'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

/* ═══════════════════════════════════════════════════════
   ADMIN SIDE NAV  —  SAI / National desktop
   ═══════════════════════════════════════════════════════ */
export function AdminSideNav() {
  const path = usePathname()
  const links = [
    ['/admin/dashboard', LayoutDashboard, 'National Overview'],
    ['/admin/talent-map', Map, 'India Talent Map'],
    ['/admin/analytics', BarChart3, 'Talent Analytics'],
    ['/admin/events', Calendar, 'Events & Live'],
    ['/admin/hardware', Cpu, 'Hardware Kits'],
    ['/admin/verification', ShieldCheck, 'Verification'],
  ]
  return (
    <aside className="w-64 border-r border-track bg-white p-6 hidden md:block">
      <div className="flex items-center gap-2">
        <ShieldCheck size={20} className="text-green-deep" />
        <span className="text-xs font-bold tracking-[.18em] text-muted">KHEL-NET SAI</span>
      </div>
      <nav className="mt-8 space-y-1">
        {links.map(([href, Icon, label]) => {
          const active = path === href || (href !== '/admin/dashboard' && path?.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                active ? 'bg-ink text-white' : 'text-muted hover:bg-page-cool hover:text-ink'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

/* ═══════════════════════════════════════════════════════
   DESK WRAPPER  —  Scout & Admin layouts
   ═══════════════════════════════════════════════════════ */
export function Desk({ children, title, subtitle, admin = false }) {
  return (
    <div className="flex min-h-screen bg-page-cool">
      {admin ? <AdminSideNav /> : <SideNav />}
      <main className="flex-1 p-6 md:p-10 max-w-7xl">
        <div>
          <p className="text-xs font-bold tracking-widest text-muted uppercase">
            {admin ? 'National Sports Intelligence' : 'Talent Assessment Network'}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   FADE IN WRAPPER
   ═══════════════════════════════════════════════════════ */
export function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
