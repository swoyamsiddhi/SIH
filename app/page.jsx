'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Activity, Search, BarChart3, ArrowRight, Play, Pause,
  Volume2, VolumeX, ShieldCheck, MapPin, Sparkles, Trophy,
  Users, Dumbbell, Calendar, Smartphone, ChevronRight, Zap,
  TrendingUp, Bell, Home as HomeIcon, ClipboardCheck, UserRound,
  Check, Camera, Radio, Award
} from 'lucide-react'
import { athlete, sportMatches, events, scoutAlerts } from '../src/data/mockData'

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [activeScreen, setActiveScreen] = useState('dashboard') // 'dashboard' | 'dna' | 'test'
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay policy prevented playback, keep muted and ready
            setIsPlaying(false)
          })
      }
    }
  }, [])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const unreadAlerts = scoutAlerts.filter(a => !a.read).length

  const roles = [
    {
      name: 'Athlete Portal',
      role: 'Athletes & Parents',
      href: '/dashboard',
      desc: 'Standardized physical tests, real-time pose tracking, personalized Athlete DNA, and developmental progress.',
      Icon: Activity,
      accent: 'bg-[#8FCB9E]',
      badge: 'Mobile App Experience',
    },
    {
      name: 'Scout & Coach Hub',
      role: 'Talent Scouts & Academies',
      href: '/scout/dashboard',
      desc: 'Multi-parameter talent discovery, AI Scout Copilot natural query engine, verified movement data, and shortlisting.',
      Icon: Search,
      accent: 'bg-[#4FA3D1]',
      badge: 'Scout Intelligence',
    },
    {
      name: 'SAI National Dashboard',
      role: 'Sports Authority of India',
      href: '/admin/dashboard',
      desc: 'Interactive 36-state India talent density map, district hotspot analytics, live event telemetry, and sensor kit monitoring.',
      Icon: BarChart3,
      accent: 'bg-[#E8735C]',
      badge: 'National Infrastructure',
    },
  ]

  return (
    <div className="relative min-h-screen w-full bg-ink text-white selection:bg-green selection:text-ink">
      {/* ═══════════════════════════════════════════════════════
          FULL-SCREEN CINEMATIC BACKGROUND VIDEO
          ═══════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover scale-105 transition-transform duration-1000"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        {/* Cinematic Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* ═══════════════════════════════════════════════════════
          FLOATING TOP GLASSMORPHIC NAVIGATION BAR
          ═══════════════════════════════════════════════════════ */}
      <header className="relative z-30 pt-6 px-4 sm:px-8">
        <nav className="glass-nav mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3 shadow-2xl transition-all">
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green text-ink shadow-soft group-hover:scale-105 transition-transform">
              <Activity size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                KHEL-NET
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/15 text-green">IN</span>
              </span>
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden items-center gap-6 md:flex text-xs font-semibold text-white/80">
            <Link href="/dashboard" className="transition-colors hover:text-white">
              Athlete App
            </Link>
            <Link href="/assessments" className="transition-colors hover:text-white">
              Assessments
            </Link>
            <Link href="/admin/talent-map" className="transition-colors hover:text-white">
              India Talent Map
            </Link>
            <Link href="/scout/copilot" className="transition-colors hover:text-white">
              AI Scout Copilot
            </Link>
            <Link href="/admin/analytics" className="transition-colors hover:text-white">
              Talent Analytics
            </Link>
            <Link href="/events" className="transition-colors hover:text-white">
              Trials &amp; Events
            </Link>
          </div>

          {/* Right: Quick Entry CTA */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-ink transition-all hover:bg-green hover:shadow-soft"
            >
              <span>Launch App</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </nav>
      </header>

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION — ATHLEATS & INDIAN SPORTS INSPIRATION
          ═══════════════════════════════════════════════════════ */}
      <main className="relative z-10 mx-auto max-w-6xl px-5 pt-10 pb-24 md:pt-16 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
          {/* Left Column: Headline & Value Proposition */}
          <section className="space-y-6">
            {/* Tag / Country context */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md border border-white/15">
              <span className="flex h-2 w-2 rounded-full bg-green animate-pulse" />
              <span>National Grassroots Sports Talent Discovery</span>
            </div>

            {/* Editorial Luxury Headline */}
            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-[1.08]">
              Performance driven intelligence for Indian athletes.
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-sm sm:text-base leading-relaxed text-white/80">
              Unearthing champions from 36 States &amp; Union Territories. AI camera pose kinematics, standardized physical benchmarks, and verified athlete profiles — connecting grassroots talent directly with SAI coaches and national scouts.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2.5 rounded-full bg-green px-7 py-3.5 text-sm font-extrabold text-ink transition-all hover:scale-105 hover:bg-[#a1d9af] hover:shadow-float-lg"
              >
                <Smartphone size={16} />
                <span>Open Athlete App</span>
              </Link>
              <Link
                href="/admin/talent-map"
                className="inline-flex items-center gap-2.5 rounded-full bg-white/15 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white hover:text-ink"
              >
                <MapPin size={16} />
                <span>Explore India Map</span>
              </Link>
            </div>

            {/* Interactive Screen Switcher for Phone Mockup */}
            <div className="pt-3">
              <p className="text-[11px] font-bold tracking-wider uppercase text-white/60 mb-2.5">
                Preview Live Mobile Experience:
              </p>
              <div className="inline-flex rounded-full bg-white/10 p-1 backdrop-blur-md border border-white/15">
                {[
                  ['dashboard', 'Home Dashboard'],
                  ['dna', 'Athlete DNA'],
                  ['test', 'Live Test AI'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setActiveScreen(id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                      activeScreen === id
                        ? 'bg-white text-ink shadow-soft'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Assurance Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-white/70">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-green" /> 5-Point Verification
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={16} className="text-amber" /> Real-time Pose AI
              </span>
              <span className="flex items-center gap-1.5">
                <Trophy size={16} className="text-blue" /> Khelo India Aligned
              </span>
            </div>
          </section>

          {/* Right Column: Floating Phone Mockup with the EXACT Live Dashboard UI */}
          <aside className="relative flex justify-center lg:justify-end">
            {/* Phone Frame */}
            <div className="relative w-full max-w-[340px] rounded-[48px] bg-black p-3.5 shadow-[0_30px_90px_rgba(0,0,0,0.9)] border-[4px] border-white/20 backdrop-blur-2xl transition-all">
              {/* Dynamic Island */}
              <div className="mx-auto mb-2 h-4 w-28 rounded-full bg-white/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-black/60 mr-2" />
                <div className="h-1.5 w-1.5 rounded-full bg-blue animate-pulse" />
              </div>

              {/* Inside Phone Viewport — Scrollable Container */}
              <div className="relative h-[560px] overflow-y-auto rounded-[36px] bg-[#f1efec] text-ink scrollbar-none shadow-inner">
                {/* Status Bar */}
                <div className="sticky top-0 z-20 flex items-center justify-between bg-[#f1efec]/95 px-5 pt-3 pb-2 backdrop-blur-md text-xs font-bold text-ink">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span>5G</span>
                    <div className="h-2 w-4 rounded-sm border border-ink p-0.5">
                      <div className="h-full w-full bg-ink rounded-xs" />
                    </div>
                  </div>
                </div>

                {/* ── ACTIVE SCREEN 1: FULL ATHLETE DASHBOARD UI ── */}
                {activeScreen === 'dashboard' && (
                  <div className="px-4 pb-20 pt-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold tracking-[.18em] text-muted">KHEL-NET</p>
                        <h2 className="text-lg font-extrabold">Good morning, Swoyam</h2>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-soft">
                        <Bell size={16} />
                      </div>
                    </div>

                    {/* Athlete DNA Hero Card */}
                    <div className="relative overflow-hidden rounded-[24px] bg-green p-5 text-ink shadow-float">
                      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15" />
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm">
                        <Activity size={12} className="text-green-deep" /> Potential Score
                      </span>
                      <p className="mt-3 text-xs font-semibold">ATHLETE DNA</p>
                      <div className="mt-1 flex items-end justify-between">
                        <p className="text-[36px] font-extrabold leading-none tracking-tight">86<span className="text-xs font-bold text-ink/70">/100</span></p>
                        <Link href="/dna" className="pill bg-ink text-white px-3 py-1.5 text-[11px] font-bold inline-flex items-center gap-1">
                          Explore <ArrowRight size={11} />
                        </Link>
                      </div>
                      <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[9px] font-bold">
                        <TrendingUp size={11} className="text-green-deep" /> +14% this month
                      </span>
                    </div>

                    {/* Quick Stats Chips */}
                    <div className="flex gap-2">
                      <div className="bg-blue-pale flex-1 rounded-xl p-2.5 text-center">
                        <Dumbbell size={14} className="mx-auto text-blue mb-1" />
                        <p className="text-sm font-extrabold">8</p>
                        <p className="text-[9px] text-muted">Assessments</p>
                      </div>
                      <div className="bg-green/30 flex-1 rounded-xl p-2.5 text-center">
                        <TrendingUp size={14} className="mx-auto text-green-deep mb-1" />
                        <p className="text-sm font-extrabold">+14%</p>
                        <p className="text-[9px] text-muted">Growth (90d)</p>
                      </div>
                      <div className="bg-amber-pale flex-1 rounded-xl p-2.5 text-center">
                        <Trophy size={14} className="mx-auto text-amber mb-1" />
                        <p className="text-sm font-extrabold">3</p>
                        <p className="text-[9px] text-muted">Events</p>
                      </div>
                    </div>

                    {/* Potential Sports */}
                    <div className="card p-3.5">
                      <div className="mb-2.5 flex justify-between items-center text-xs">
                        <h3 className="font-bold">Potential sports</h3>
                        <Link href="/sports" className="text-[10px] font-bold text-blue">See all</Link>
                      </div>
                      {sportMatches.slice(0, 3).map((x, i) => (
                        <div className="mb-2.5 last:mb-0 text-xs" key={x.sport}>
                          <div className="flex justify-between font-semibold text-[11px]">
                            <span>{x.sport}</span>
                            <b>{x.match}% match</b>
                          </div>
                          <div className="mt-1 h-1.5 w-full rounded-full bg-track overflow-hidden">
                            <div
                              className={`h-full rounded-full ${['bg-blue', 'bg-coral', 'bg-amber'][i]}`}
                              style={{ width: `${x.match}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Next Assessment Card */}
                    <div className="card flex items-center justify-between p-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-pale text-blue">
                          <Activity size={18} />
                        </span>
                        <div>
                          <p className="text-[9px] font-bold text-muted uppercase">NEXT ASSESSMENT</p>
                          <h4 className="font-bold text-xs">Vertical Jump</h4>
                          <p className="text-[10px] text-muted">Explosive leg power</p>
                        </div>
                      </div>
                      <Link href="/assessments/vertical-jump" className="pill bg-ink text-white px-3 py-1.5 text-[10px] font-bold">
                        Start
                      </Link>
                    </div>

                    {/* Upcoming Event */}
                    <div className="card flex items-center justify-between p-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-pale text-amber">
                          <Calendar size={18} />
                        </span>
                        <div>
                          <p className="text-[9px] font-bold text-muted uppercase">UPCOMING TRIAL</p>
                          <h4 className="font-bold text-xs">{events[0].name}</h4>
                          <p className="text-[10px] text-muted">{events[0].location} · {events[0].date}</p>
                        </div>
                      </div>
                      <Link href="/events" className="pill bg-amber text-ink px-3 py-1.5 text-[10px] font-bold">
                        View
                      </Link>
                    </div>

                    {/* Scout Status */}
                    <div className="rounded-2xl bg-blue-pale p-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Bell size={13} className="text-blue" />
                          <p className="text-[10px] font-bold uppercase">Scout Status</p>
                        </div>
                        {unreadAlerts > 0 && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-coral text-[8px] font-bold text-white">
                            {unreadAlerts}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs font-semibold">
                        {unreadAlerts > 0 ? `${unreadAlerts} new scout interest — tap to view` : 'Profile verified for discovery'}
                      </p>
                    </div>
                  </div>
                )}

                {/* ── ACTIVE SCREEN 2: ATHLETE DNA DETAILS ── */}
                {activeScreen === 'dna' && (
                  <div className="px-4 pb-20 pt-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-extrabold">Athlete DNA Profile</h2>
                      <span className="rounded-full bg-green/30 px-2.5 py-0.5 text-[10px] font-bold text-green-deep">
                        ✓ 97% Verified
                      </span>
                    </div>

                    <div className="card p-4 text-center">
                      <p className="text-[10px] font-bold text-muted">OVERALL ATHLETE POTENTIAL</p>
                      <p className="mt-1 text-4xl font-extrabold">86<span className="text-xs text-muted">/100</span></p>
                      <p className="mt-1 text-[11px] text-green-deep font-bold">↑ Top 5% National Percentile</p>
                    </div>

                    <div className="card p-4 space-y-3">
                      <h3 className="font-bold text-xs">Verified Attributes</h3>
                      {Object.entries(athlete.attributes).slice(0, 5).map(([name, val], i) => (
                        <div key={name} className="text-xs">
                          <div className="flex justify-between font-semibold text-[11px]">
                            <span>{name}</span>
                            <b>{val}</b>
                          </div>
                          <div className="mt-1 h-1.5 w-full rounded-full bg-track overflow-hidden">
                            <div
                              className="h-full rounded-full bg-blue"
                              style={{ width: `${val}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl bg-amber-pale p-3.5 text-xs">
                      <p className="font-bold">Key Strengths</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {athlete.strengths.map(s => (
                          <span key={s} className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── ACTIVE SCREEN 3: LIVE CAMERA TEST ── */}
                {activeScreen === 'test' && (
                  <div className="px-4 pb-20 pt-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-extrabold">Vertical Jump Test</h2>
                      <span className="flex items-center gap-1 rounded-full bg-green px-2 py-0.5 text-[10px] font-bold text-ink">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-deep animate-ping" /> Live
                      </span>
                    </div>

                    <div className="relative flex h-52 items-center justify-center rounded-2xl bg-ink text-white p-4 text-center overflow-hidden">
                      <div className="absolute top-2 left-2 right-2 flex justify-between text-[8px] font-semibold text-white/70">
                        <span className="bg-white/20 px-1.5 py-0.5 rounded">Pose 30fps</span>
                        <span className="bg-white/20 px-1.5 py-0.5 rounded">IMU Synced</span>
                      </div>
                      <div>
                        <Camera size={32} className="mx-auto mb-2 text-white/60" />
                        <p className="text-xs font-bold">Pose Tracking Active</p>
                        <p className="text-[10px] text-white/50">Skeleton aligned</p>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-white/90 p-2 text-ink text-left">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>Jump Height</span>
                          <span className="text-green-deep">47 cm (Peak)</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-white p-3 shadow-sm text-center">
                        <p className="text-[9px] text-muted font-bold">FORM SCORE</p>
                        <p className="text-xl font-extrabold">88%</p>
                      </div>
                      <div className="rounded-xl bg-white p-3 shadow-sm text-center">
                        <p className="text-[9px] text-muted font-bold">REPETITIONS</p>
                        <p className="text-xl font-extrabold">6 / 6</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom App Navigation inside phone */}
                <div className="absolute bottom-0 left-0 right-0 z-30 flex justify-around border-t border-black/5 bg-white/95 py-2.5 backdrop-blur-md text-[9px] font-semibold text-muted">
                  <div className="flex flex-col items-center gap-0.5 text-ink">
                    <HomeIcon size={15} />
                    <span>Home</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <ClipboardCheck size={15} />
                    <span>Assess</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <TrendingUp size={15} />
                    <span>Growth</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <Calendar size={15} />
                    <span>Events</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <UserRound size={15} />
                    <span>Profile</span>
                  </div>
                </div>
              </div>

              {/* Home bar indicator */}
              <div className="mx-auto mt-2.5 h-1 w-28 rounded-full bg-white/30" />
            </div>

            {/* Floating Glass Pill Badges around Phone */}
            <div className="absolute -bottom-4 -left-6 hidden sm:flex items-center gap-2.5 rounded-2xl bg-black/80 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xl border border-white/20 shadow-float">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue text-white">
                <MapPin size={13} />
              </span>
              <div>
                <p className="text-[10px] text-muted leading-tight">National Scout</p>
                <p className="text-white">Active in Chennai Hub</p>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2 rounded-full bg-green px-3.5 py-1.5 text-xs font-extrabold text-ink shadow-float">
              <ShieldCheck size={14} />
              <span>Survey of India Grid</span>
            </div>
          </aside>
        </div>

        {/* ═══════════════════════════════════════════════════════
            NATIONAL TALENT TELEMETRY METRICS BAR
            ═══════════════════════════════════════════════════════ */}
        <section className="mt-16 sm:mt-24 rounded-3xl glass-card p-6 sm:p-8 backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/60">Grassroots Assessed</p>
              <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">1,248,291</p>
              <p className="mt-1 text-[11px] text-green flex items-center gap-1 font-semibold">
                ↑ +12,829 completed today
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/60">Sovereign Grid</p>
              <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">36 / 36</p>
              <p className="mt-1 text-[11px] text-white/70 font-semibold">
                States &amp; UTs mapped
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/60">AI Verification</p>
              <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">97.4%</p>
              <p className="mt-1 text-[11px] text-green flex items-center gap-1 font-semibold">
                5-point tamper check
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/60">Testing Centers</p>
              <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">412</p>
              <p className="mt-1 text-[11px] text-amber flex items-center gap-1 font-semibold">
                Active sensor hubs
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PORTAL ACCESS CARDS (ATHLETE / SCOUT / SAI ADMIN)
            ═══════════════════════════════════════════════════════ */}
        <section className="mt-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-green uppercase">Integrated Ecosystem</p>
              <h2 className="mt-1 font-editorial text-3xl sm:text-4xl text-white font-medium">
                Choose your portal
              </h2>
            </div>
            <p className="text-xs text-white/60 max-w-sm">
              Role-based architecture connecting athletes, coaches, talent scouts, and SAI administrators.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {roles.map(({ name, role, href, desc, Icon, accent, badge }) => (
              <Link
                key={name}
                href={href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl glass-card p-7 transition-all duration-300 hover:-translate-y-2 hover:border-white/30 hover:shadow-float-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent} text-ink shadow-soft`}>
                      <Icon size={24} />
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-white/80 backdrop-blur-sm border border-white/10">
                      {badge}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-white">{name}</h3>
                  <p className="mt-1 text-xs font-bold text-green">{role}</p>
                  <p className="mt-3 text-xs leading-relaxed text-white/70">{desc}</p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-xs font-bold text-white transition-all group-hover:text-green">
                  <span>Enter Portal</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════
          BOTTOM CORNER VIDEO CONTROLS
          ═══════════════════════════════════════════════════════ */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
          className="flex h-10 w-10 items-center justify-center rounded-full glass-nav text-white transition-all hover:scale-110 hover:bg-white hover:text-ink"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute Video Audio' : 'Mute Video Audio'}
          className="flex h-10 w-10 items-center justify-center rounded-full glass-nav text-white transition-all hover:scale-110 hover:bg-white hover:text-ink"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/10 bg-black/60 px-5 py-8 text-center text-xs text-white/50 backdrop-blur-md">
        <p>KHEL-NET · National Sports Talent Assessment Network · Smart India Hackathon</p>
        <p className="mt-1 text-[11px] text-white/40">
          Official Survey of India Cartographic Grid · Powered by AI Computer-Vision &amp; IMU Telemetry
        </p>
      </footer>
    </div>
  )
}
