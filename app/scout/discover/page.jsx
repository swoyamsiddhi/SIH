'use client'
import { useState } from 'react'
import { Desk, FadeIn } from '../../../src/components/ui'
import { scoutAthletes } from '../../../src/data/mockData'
import Link from 'next/link'

export default function Discover() {
  const [filters, setFilters] = useState({ sport: 'All', location: 'All', age: 'All', potential: '80' })

  const sel = (key, options) => (
    <select
      value={filters[key]}
      onChange={e => setFilters({ ...filters, [key]: e.target.value })}
      className="rounded-xl bg-page-cool px-3 py-2.5 text-xs font-semibold outline-none transition-colors focus:ring-2 focus:ring-blue/30"
    >
      {options.map(x => <option key={x}>{x}</option>)}
    </select>
  )

  const filtered = scoutAthletes.filter(x =>
    (filters.sport === 'All' || x.sport === filters.sport)
    && (filters.location === 'All' || x.location === filters.location)
    && (filters.age === 'All' || (filters.age === 'U18' ? x.age < 18 : x.age >= 18))
    && x.potential >= +filters.potential
  )

  return (
    <Desk title="Discover athletes" subtitle="Filter locally verified talent profiles">
      {/* ── Filters ──────────────────────────────── */}
      <FadeIn>
        <section className="card mt-7 flex flex-wrap gap-3 p-4">
          {sel('sport', ['All', 'Sprint', 'Football', 'Basketball', 'Badminton', 'Long Jump'])}
          {sel('location', ['All', 'Chennai', 'Bengaluru', 'Coimbatore', 'Hyderabad', 'Madurai', 'Pune', 'Mumbai', 'Delhi', 'Kochi'])}
          {sel('age', ['All', 'U18', '18+'])}
          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
            Potential ≥
            {sel('potential', ['80', '85', '90', '95'])}
          </div>
        </section>
      </FadeIn>

      <p className="mt-5 text-sm text-muted">
        <b className="text-ink">{filtered.length}</b> athletes found
      </p>

      {/* ── Results Table ─────────────────────────── */}
      <FadeIn delay={0.1}>
        <section className="card mt-3 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-page-cool text-xs text-muted">
              <tr>
                {['Athlete ID', 'Sport', 'Potential', 'Growth', 'Verification', 'Age', 'Location', ''].map(h => (
                  <th className="px-5 py-4 font-semibold" key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(x => (
                <tr className="border-t border-track transition-colors hover:bg-page-cool/40" key={x.id}>
                  <td className="px-5 py-4 font-bold">{x.id}</td>
                  <td>{x.sport}</td>
                  <td>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      x.potential >= 93 ? 'bg-green/25 text-green-deep' : ''
                    }`}>
                      {x.potential}%
                    </span>
                  </td>
                  <td className="font-semibold text-green-deep">↑ {x.growth}%</td>
                  <td>{x.verification}%</td>
                  <td>{x.age}</td>
                  <td>{x.location}</td>
                  <td>
                    <Link
                      className="rounded-full bg-ink px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-ink/80"
                      href={`/scout/athlete/${x.id}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </FadeIn>
    </Desk>
  )
}
