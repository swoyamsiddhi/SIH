import { Header, BottomNav, PillButton, FadeIn } from '../../src/components/ui'
import { events } from '../../src/data/mockData'
import { MapPin, Calendar, Users, Trophy } from 'lucide-react'
import Link from 'next/link'

export default function Events() {
  return (
    <main className="phone nav-safe px-5">
      <Header title="Talent events" back />
      <p className="mb-5 text-sm text-muted">Discover nearby assessment events and talent trials.</p>

      <div className="space-y-4">
        {events.map((ev, i) => (
          <FadeIn key={ev.id} delay={i * 0.08}>
            <Link href={`/events/${ev.id}`} className="card block p-5 transition-all hover:shadow-float">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-bold">{ev.name}</h2>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {ev.date}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> Age {ev.ageRange}</span>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  ev.status === 'Upcoming' ? 'bg-green/25 text-green-deep' : 'bg-blue-pale text-blue'
                }`}>
                  {ev.status}
                </span>
              </div>

              {/* Sports tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {ev.sports.map(s => (
                  <span className="rounded-full bg-page-cool px-2.5 py-1 text-[10px] font-semibold" key={s}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Capacity bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-muted">
                  <span>{ev.registered} registered</span>
                  <span>{ev.capacity} capacity</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-track">
                  <div
                    className="h-full rounded-full bg-blue"
                    style={{ width: `${(ev.registered / ev.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>

      <BottomNav />
    </main>
  )
}
