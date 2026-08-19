import { useState, useEffect } from 'react'
import { Header, PillButton, FadeIn } from '../../../src/components/ui'
import { api } from '../../../src/lib/api'
import { MapPin, Calendar, Users, Trophy, Ticket, QrCode, Check } from 'lucide-react'

export default function EventDetail({ params }) {
  const [ev, setEv] = useState(null)
  const [registered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.events.getById(params.eventId)
        setEv(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.eventId])

  const handleRegister = async () => {
    try {
      // In a real app we'd get the actual user ID. We use athlete 1 for demo purposes.
      await api.events.register(params.eventId, 1)
      setRegistered(true)
      // refresh capacity
      const data = await api.events.getById(params.eventId)
      setEv(data)
    } catch(e) {
      alert("Registration failed. Please check eligibility or capacity.")
    }
  }

  if (loading || !ev) {
    return <main className="phone min-h-screen px-5 pb-10"><Header title="Loading" back /></main>
  }

  return (
    <main className="phone min-h-screen px-5 pb-10">
      <Header title={ev.name} back />

      {/* ── Hero ──────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[28px] bg-blue p-6 shadow-float text-ink">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15" />
        <div className="relative">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-bold">
            <Trophy size={12} /> {ev.status}
          </span>
          <h2 className="mt-4 text-2xl font-extrabold">{ev.name}</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(ev.date).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Users size={12} /> Age {ev.min_age || 0}-{ev.max_age || 'Any'}</span>
          </div>
        </div>
      </section>

      {/* ── Details ──────────────────────────────── */}
      <FadeIn delay={0.1}>
        <section className="card mt-5 divide-y divide-track px-5">
          {[
            ['Organizer', ev.organizer_name || ev.organizer],
            ['Capacity', `${ev.registered_count || 0} / ${ev.capacity}`],
            ['Age Group', `${ev.min_age || 0}-${ev.max_age || 'Any'}`],
          ].map(([l, v]) => (
            <div className="flex justify-between py-3.5 text-sm" key={l}>
              <span className="text-muted">{l}</span>
              <b>{v}</b>
            </div>
          ))}
        </section>
      </FadeIn>

      {/* ── Sports ────────────────────────────────── */}
      <FadeIn delay={0.15}>
        <section className="mt-5">
          <h3 className="mb-2 text-sm font-bold">Eligible Sports</h3>
          <div className="flex flex-wrap gap-2">
            {(ev.sports || []).map(s => (
              <span className="rounded-full bg-green/25 px-3 py-1.5 text-xs font-bold text-green-deep" key={s}>
                {s}
              </span>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── Assessments ──────────────────────────── */}
      <FadeIn delay={0.2}>
        <section className="mt-5">
          <h3 className="mb-2 text-sm font-bold">Assessments Conducted</h3>
          <div className="flex flex-wrap gap-2">
            {(ev.assessments || []).map(a => (
              <span className="rounded-full bg-blue-pale px-3 py-1.5 text-xs font-bold text-blue" key={a}>
                {a}
              </span>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── Registration / QR ─────────────────────── */}
      {registered ? (
        <FadeIn delay={0}>
          <section className="card mt-6 p-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green/25 text-green-deep">
              <Ticket size={24} />
            </div>
            <h3 className="mt-3 font-bold">Registration Confirmed</h3>
            <p className="mt-1 text-xs text-muted">Present this digital pass at the check-in desk</p>
            {/* QR placeholder */}
            <div className="mx-auto mt-4 flex h-36 w-36 items-center justify-center rounded-2xl bg-page-cool text-muted">
              <QrCode size={64} />
            </div>
            <div className="mt-4 space-y-2 text-left text-sm">
              <p><b>Venue:</b> {ev.location}</p>
              <p><b>Requirements:</b> Valid ID proof, standard sports attire</p>
            </div>
          </section>
        </FadeIn>
      ) : (
        <PillButton onClick={handleRegister} variant="amber" className="mt-6 w-full !py-4" disabled={ev.status === 'PAST'}>
          {ev.status === 'PAST' ? 'EVENT COMPLETED' : 'REGISTER FOR EVENT'}
        </PillButton>
      )}
    </main>
  )
}
