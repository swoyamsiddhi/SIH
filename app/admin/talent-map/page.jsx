'use client'
import { useState, useRef } from 'react'
import { Desk, FadeIn, Progress, PillButton } from '../../../src/components/ui'
import { indiaStatesData } from '../../../src/data/indiaMapPaths'
import { Map, Users, TrendingUp, ShieldCheck, Cpu, Activity, Search, Sparkles, Filter, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const sportColors = {
  Sprint: '#4FA3D1',
  Football: '#E8735C',
  Basketball: '#EAB74A',
  Athletics: '#8FCB9E',
  Badminton: '#3FA35A',
}

export default function TalentMap() {
  const [selectedState, setSelectedState] = useState(
    indiaStatesData.find(s => s.name === 'Tamil Nadu') || indiaStatesData[0]
  )
  const [hoveredState, setHoveredState] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [sportFilter, setSportFilter] = useState('All')
  const [viewMode, setViewMode] = useState('sport') // 'sport' | 'density' | 'growth'
  const [searchQuery, setSearchQuery] = useState('')
  const svgRef = useRef(null)

  // Color calculation based on view mode
  const getStateColor = (state) => {
    if (sportFilter !== 'All' && state.topSport !== sportFilter) {
      return '#E2E0DD' // dimmed if filtered out
    }

    if (viewMode === 'sport') {
      return sportColors[state.topSport] || '#4FA3D1'
    } else if (viewMode === 'density') {
      const a = state.athletes
      if (a >= 120000) return '#2563EB'
      if (a >= 70000) return '#4FA3D1'
      if (a >= 30000) return '#93C5FD'
      return '#D9ECF6'
    } else if (viewMode === 'growth') {
      const g = state.growth
      if (g >= 22) return '#3FA35A'
      if (g >= 16) return '#8FCB9E'
      if (g >= 12) return '#BAE6FD'
      return '#E5E5E8'
    }
    return '#4FA3D1'
  }

  // Handle mouse move for tooltip
  const handleMouseMove = (e, state) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    setTooltipPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top - 20,
    })
    setHoveredState(state)
  }

  // Filtered state list for search
  const searchResults = searchQuery.trim()
    ? indiaStatesData.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  return (
    <Desk
      title="India Talent Map"
      subtitle="Comprehensive state-level talent distribution & athletic density"
      admin
    >
      {/* ── Top Stats & Control Bar ────────────────── */}
      <FadeIn>
        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-blue-pale p-4">
            <p className="text-[10px] font-bold tracking-wider text-muted uppercase">Coverage</p>
            <p className="mt-1 text-2xl font-extrabold">{indiaStatesData.length} States &amp; UTs</p>
            <span className="mt-1 inline-block text-[10px] text-muted">Active Survey of India grid</span>
          </div>
          <div className="rounded-2xl bg-green/25 p-4">
            <p className="text-[10px] font-bold tracking-wider text-muted uppercase">Top Volume State</p>
            <p className="mt-1 text-2xl font-extrabold">Maharashtra</p>
            <span className="mt-1 inline-block text-[10px] font-bold text-green-deep">198,400 verified athletes</span>
          </div>
          <div className="rounded-2xl bg-coral-pale p-4">
            <p className="text-[10px] font-bold tracking-wider text-muted uppercase">Fastest Growth</p>
            <p className="mt-1 text-2xl font-extrabold">Ladakh &amp; Haryana</p>
            <span className="mt-1 inline-block text-[10px] font-bold text-coral">↑ +25–28% (90d)</span>
          </div>
          <div className="rounded-2xl bg-amber-pale p-4">
            <p className="text-[10px] font-bold tracking-wider text-muted uppercase">Selected Region</p>
            <p className="mt-1 text-2xl font-extrabold truncate">{selectedState?.name}</p>
            <span className="mt-1 inline-block text-[10px] font-bold text-amber">
              {selectedState?.athletes?.toLocaleString()} athletes
            </span>
          </div>
        </section>
      </FadeIn>

      {/* ── Map Filters & View Modes ──────────────── */}
      <FadeIn delay={0.08}>
        <section className="card mt-5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted">View Mode:</span>
              <div className="flex rounded-full bg-page-cool p-1">
                {[
                  ['sport', 'Dominant Sport'],
                  ['density', 'Talent Density'],
                  ['growth', 'Growth Velocity'],
                ].map(([mode, label]) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                      viewMode === mode ? 'bg-ink text-white shadow-soft' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* State Search */}
            <div className="relative w-full max-w-xs sm:w-auto">
              <input
                type="text"
                placeholder="Search state or UT..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-page-cool px-3.5 py-2 text-xs font-semibold outline-none transition-all focus:ring-2 focus:ring-blue/30"
              />
              {searchResults.length > 0 && (
                <div className="absolute right-0 top-full z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-2xl bg-white p-2 shadow-float border border-track">
                  {searchResults.map(s => (
                    <button
                      key={s.name}
                      onClick={() => {
                        setSelectedState(s)
                        setSearchQuery('')
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold hover:bg-page-cool"
                    >
                      <span>{s.name}</span>
                      <span className="text-muted">{s.athletes.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sport Filter Chips */}
          {viewMode === 'sport' && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-track pt-3">
              <span className="text-xs font-bold text-muted mr-1">Filter Sport:</span>
              {['All', 'Sprint', 'Football', 'Basketball', 'Athletics', 'Badminton'].map(sport => {
                const isActive = sportFilter === sport
                const color = sport !== 'All' ? sportColors[sport] : '#1A1A1A'
                return (
                  <button
                    key={sport}
                    onClick={() => setSportFilter(sport)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                      isActive ? 'bg-ink text-white shadow-soft' : 'bg-page-cool text-muted hover:bg-page-cool/80 hover:text-ink'
                    }`}
                  >
                    {sport !== 'All' && (
                      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                    )}
                    {sport}
                  </button>
                )
              })}
            </div>
          )}

          {/* Legend for Density / Growth */}
          {viewMode === 'density' && (
            <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-track pt-3 text-xs">
              <span className="font-bold text-muted">Density:</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-md bg-[#2563EB]" /> &gt; 120,000</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-md bg-[#4FA3D1]" /> 70,000 – 120,000</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-md bg-[#93C5FD]" /> 30,000 – 70,000</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-md bg-[#D9ECF6]" /> &lt; 30,000</span>
            </div>
          )}
          {viewMode === 'growth' && (
            <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-track pt-3 text-xs">
              <span className="font-bold text-muted">Growth:</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-md bg-[#3FA35A]" /> &gt; 22% (High Velocity)</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-md bg-[#8FCB9E]" /> 16% – 22%</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-md bg-[#BAE6FD]" /> 12% – 16%</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-md bg-[#E5E5E8]" /> &lt; 12%</span>
            </div>
          )}
        </section>
      </FadeIn>

      {/* ── Main Map + Detail Split ────────────────── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        {/* ── Left: Interactive SVG India Map ───────── */}
        <FadeIn delay={0.12}>
          <div className="card relative overflow-hidden p-6 shadow-float">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold">Interactive State Boundaries</h2>
                <p className="text-xs text-muted">Hover to inspect, click to drill down</p>
              </div>
              <span className="rounded-full bg-page-cool px-2.5 py-1 text-[10px] font-bold text-muted">
                Official Survey of India Grid
              </span>
            </div>

            {/* SVG Canvas Container */}
            <div className="relative mt-2 flex justify-center overflow-hidden" ref={svgRef}>
              <svg
                viewBox="0 0 620 700"
                className="w-full max-w-[620px] h-auto drop-shadow-sm select-none"
                style={{ maxHeight: 640 }}
              >
                <defs>
                  <filter id="stateHoverGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.25" />
                  </filter>
                </defs>

                {/* State Paths */}
                {indiaStatesData.map(state => {
                  const isSelected = selectedState?.name === state.name
                  const isHovered = hoveredState?.name === state.name
                  const fillColor = getStateColor(state)

                  return (
                    <g key={state.name} className="transition-all duration-200">
                      <path
                        d={state.path}
                        fill={fillColor}
                        stroke={isSelected ? '#1A1A1A' : isHovered ? '#1A1A1A' : '#FFFFFF'}
                        strokeWidth={isSelected ? 3 : isHovered ? 2 : 1.2}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className="cursor-pointer transition-all duration-200"
                        style={{
                          filter: isSelected || isHovered ? 'url(#stateHoverGlow)' : 'none',
                          opacity: sportFilter !== 'All' && state.topSport !== sportFilter ? 0.35 : 1,
                        }}
                        onClick={() => setSelectedState(state)}
                        onMouseEnter={e => handleMouseMove(e, state)}
                        onMouseMove={e => handleMouseMove(e, state)}
                        onMouseLeave={() => setHoveredState(null)}
                      />
                    </g>
                  )
                })}

                {/* Subtle Centroid Dot for Major States */}
                {indiaStatesData.map(state => {
                  if (state.athletes < 40000) return null
                  const [cx, cy] = state.centroid
                  const isSelected = selectedState?.name === state.name

                  return (
                    <circle
                      key={`dot-${state.name}`}
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 4 : 2.5}
                      fill={isSelected ? '#1A1A1A' : '#FFFFFF'}
                      stroke="#1A1A1A"
                      strokeWidth={isSelected ? 1.5 : 0.8}
                      pointerEvents="none"
                    />
                  )
                })}
              </svg>

              {/* Floating Tooltip */}
              {hoveredState && (
                <div
                  className="pointer-events-none absolute z-30 rounded-2xl bg-ink/95 px-3.5 py-2.5 text-white shadow-float backdrop-blur-md transition-transform duration-75"
                  style={{
                    left: `${Math.min(tooltipPos.x, 380)}px`,
                    top: `${Math.max(tooltipPos.y, 10)}px`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: sportColors[hoveredState.topSport] || '#4FA3D1' }} />
                    <p className="text-xs font-bold">{hoveredState.name}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[10px] text-white/80">
                    <span>{hoveredState.athletes.toLocaleString()} athletes</span>
                    <span className="font-bold text-green">↑ +{hoveredState.growth}%</span>
                  </div>
                  <div className="mt-1 text-[9px] text-white/60">
                    Primary: <b className="text-white">{hoveredState.topSport}</b>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* ── Right: State Intelligence Detail Panel ─ */}
        <aside className="space-y-5">
          {selectedState ? (
            <FadeIn key={selectedState.name} delay={0.05}>
              {/* State Hero Card */}
              <div
                className="relative overflow-hidden rounded-[28px] p-6 shadow-float text-ink transition-colors duration-300"
                style={{
                  background:
                    selectedState.topSport === 'Sprint' ? '#D9ECF6'
                    : selectedState.topSport === 'Football' ? '#F9D9D1'
                    : selectedState.topSport === 'Basketball' ? '#F8EAD6'
                    : '#D5ECD9',
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold backdrop-blur-sm">
                      <span className="h-2 w-2 rounded-full" style={{ background: sportColors[selectedState.topSport] }} />
                      {selectedState.topSport} Hub
                    </span>
                    <h3 className="mt-3 text-2xl font-extrabold">{selectedState.name}</h3>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1.5 text-xs font-extrabold">
                    <ShieldCheck size={13} className="text-green-deep" /> {selectedState.verifiedRate}% Verified
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider font-semibold">Assessed Pool</p>
                    <p className="text-[38px] font-extrabold leading-none tracking-tight">
                      {selectedState.athletes.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-green/30 px-3 py-1 text-xs font-bold text-green-deep">
                      ↑ +{selectedState.growth}% (90d)
                    </span>
                  </div>
                </div>
              </div>

              {/* Sport Distribution in Selected State */}
              <div className="card mt-5 p-5">
                <h3 className="text-sm font-bold">Sport Distribution</h3>
                <p className="mt-0.5 text-xs text-muted">Talent potential breakdown</p>
                <div className="mt-4 space-y-3">
                  {selectedState.sports &&
                    Object.entries(selectedState.sports).map(([sport, pct], i) => (
                      <div key={sport}>
                        <div className="mb-1 flex justify-between text-xs font-semibold">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full" style={{ background: sportColors[sport] || '#4FA3D1' }} />
                            {sport}
                          </span>
                          <span>
                            <b>{pct}%</b>
                            <span className="ml-1 text-[10px] text-muted">
                              ({Math.round((selectedState.athletes * pct) / 100).toLocaleString()})
                            </span>
                          </span>
                        </div>
                        <Progress
                          value={pct}
                          color={['bg-blue', 'bg-coral', 'bg-amber', 'bg-green'][i % 4]}
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Top Talent Districts Hotspots */}
              <div className="card mt-5 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold">District Hotspots</h3>
                  <span className="text-[10px] font-bold text-blue">Verified Testing Centers</span>
                </div>
                <div className="mt-3 divide-y divide-track">
                  {selectedState.hotspots &&
                    selectedState.hotspots.map((district, idx) => (
                      <div className="flex items-center justify-between py-2.5 text-xs" key={district}>
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-page-cool text-[9px] font-bold text-muted">
                            #{idx + 1}
                          </span>
                          <span className="font-semibold">{district}</span>
                        </div>
                        <span className="text-green-deep font-bold">Active</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Top Verified Athletes from this state */}
              {selectedState.topAthletes && selectedState.topAthletes.length > 0 && (
                <div className="card mt-5 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold">Top Verified Profiles</h3>
                    <Link href="/scout/discover" className="text-[10px] font-bold text-blue">
                      View all →
                    </Link>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedState.topAthletes.map(athId => (
                      <Link
                        key={athId}
                        href={`/scout/athlete/${athId}`}
                        className="flex items-center gap-2 rounded-2xl bg-page-cool px-3 py-2 text-xs font-bold transition-all hover:bg-ink hover:text-white"
                      >
                        <span>{athId}</span>
                        <span className="text-[10px] text-green-deep">Top 5%</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Hardware Kits in State */}
              <div className="mt-4 rounded-2xl bg-page-cool p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Hardware Kits Deployed:</span>
                  <b className="text-ink">{selectedState.kits || 2} Units Active</b>
                </div>
              </div>
            </FadeIn>
          ) : (
            <div className="card p-6 text-center">
              <p className="mt-3 font-bold">Select a State</p>
              <p className="mt-1 text-xs text-muted">Click any state on the map to view regional talent analytics</p>
            </div>
          )}
        </aside>
      </div>
    </Desk>
  )
}
