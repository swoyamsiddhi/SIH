import { useState, useEffect } from 'react'
import { Desk, PillButton, FadeIn } from '../../../src/components/ui'
import { api } from '../../../src/lib/api'
import { Users, ClipboardCheck, Activity, Sparkles, MapPin, Calendar, Building2, Radio } from 'lucide-react'

export default function AdminEvents() {
  const [liveMode, setLiveMode] = useState(false)
  const [events, setEvents] = useState([])
  const [liveEventId, setLiveEventId] = useState(null)
  const [telemetry, setTelemetry] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const evs = await api.events.getAll()
        setEvents(evs)
        const liveEvent = evs.find(e => e.status === 'LIVE')
        if (liveEvent) {
          setLiveEventId(liveEvent.id)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Poll for telemetry when in live mode
  useEffect(() => {
    if (!liveMode || !liveEventId) return
    async function fetchTelemetry() {
      try {
        const data = await api.admin.getLiveEventTelemetry(liveEventId)
        setTelemetry(data)
      } catch(e) {
        console.error(e)
      }
    }
    fetchTelemetry()
    const interval = setInterval(fetchTelemetry, 5000)
    return () => clearInterval(interval)
  }, [liveMode, liveEventId])

  const liveEvent = events.find(e => e.id === liveEventId)

  if (loading) return <Desk title="Loading" admin />

  return (
    <Desk title="Events & Live Mode" subtitle="Manage trials and real-time event telemetry" admin>
      {/* ── Live Event Toggle ───────────────────────── */}
      {liveEvent ? (
        <FadeIn>
          <section className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-ink p-6 text-white shadow-float">
            <div>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${liveMode ? 'bg-coral animate-pulse' : 'bg-green'}`} />
                <p className="text-xs font-bold tracking-wider uppercase text-white/70">
                  {liveMode ? 'LIVE EVENT TELEMETRY ACTIVE' : 'EVENT OPERATIONS'}
                </p>
              </div>
              <h2 className="mt-2 text-2xl font-extrabold">{liveEvent.name}</h2>
              <p className="mt-1 text-xs text-white/60">{liveEvent.organizer_name || liveEvent.organizer} · {liveEvent.capacity} Capacity</p>
            </div>
            <PillButton
              onClick={() => setLiveMode(!liveMode)}
              variant={liveMode ? 'coral' : 'amber'}
              className="!px-5 !py-3"
            >
              {liveMode ? 'EXIT LIVE MODE' : 'ENTER LIVE MODE'}
            </PillButton>
          </section>
        </FadeIn>
      ) : (
        <FadeIn>
          <section className="mt-7 rounded-[22px] bg-ink p-6 text-white shadow-float">
            <h2 className="text-2xl font-extrabold text-white/60">No Live Event</h2>
            <p className="mt-1 text-sm text-white/40">Start an event to view real-time telemetry.</p>
          </section>
        </FadeIn>
      )}

      {/* ── Live Telemetry Cards ──────────────────── */}
      {liveMode && telemetry && (
        <FadeIn delay={0}>
          <section className="mt-6">
            <div className="flex items-center gap-2">
              <Radio size={16} className="text-coral animate-pulse" />
              <h3 className="font-bold">Real-Time Event Stream</h3>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Checked in', telemetry.checked_in, Users, 'bg-blue-pale', 'text-blue'],
                ['Assessed', telemetry.assessments_completed, ClipboardCheck, 'bg-green/30', 'text-green-deep'],
                ['Testing now', telemetry.currently_testing, Activity, 'bg-coral-pale', 'text-coral'],
                ['High potential', telemetry.high_potential_detected, Sparkles, 'bg-amber-pale', 'text-amber'],
              ].map(([label, val, Icon, tone, iconColor]) => (
                <div className={`${tone} rounded-[22px] p-5 shadow-soft`} key={label}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-muted uppercase">{label}</p>
                    <Icon size={16} className={iconColor} />
                  </div>
                  <p className="mt-2 text-3xl font-extrabold">{val}</p>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ── All Scheduled Events ──────────────────── */}
      <FadeIn delay={0.1}>
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Scheduled Talent Trials</h2>
            <span className="text-xs font-bold text-muted">{events.length} active events</span>
          </div>

          <div className="mt-4 space-y-3">
            {events.map(ev => (
              <div className="card flex flex-wrap items-center justify-between gap-4 p-5" key={ev.id}>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold">{ev.name}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${ev.status === 'LIVE' ? 'bg-coral-pale text-coral' : 'bg-green/25 text-green-deep'}`}>
                      {ev.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(ev.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> Age {ev.min_age || 0}-{ev.max_age || 'Any'}</span>
                    <span className="flex items-center gap-1"><Building2 size={12} /> {ev.organizer_name || ev.organizer}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-xs">
                    <b>{ev.registered_count || 0}</b>
                    <span className="text-muted"> / {ev.capacity}</span>
                  </div>
                  <PillButton variant="white" className="!px-4 !py-2 text-xs shadow-soft">
                    Manage
                  </PillButton>
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>
    </Desk>
  )
}
