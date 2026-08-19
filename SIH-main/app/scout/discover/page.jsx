'use client'
import { useState, useEffect } from 'react'
import { Desk, FadeIn } from '../../../src/components/ui'
import { discoverScoutAthletes } from '../../../src/lib/api/scouts'
import Link from 'next/link'

export default function Discover() {
  const [filters, setFilters] = useState({ sport: 'All', location: 'All', age: 'All', potential: '80' })
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function search() {
      setLoading(true)
      try {
        const payload = {}
        if (filters.sport !== 'All') payload.sport = filters.sport
        if (filters.location !== 'All') payload.location = filters.location
        if (filters.age !== 'All') {
          if (filters.age === 'U18') payload.max_age = 18
          else payload.min_age = 18
        }
        if (filters.potential) payload.min_potential = Number(filters.potential)

        const res = await discoverScoutAthletes(payload)
        setResults(res)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    search()
  }, [filters])

  const sel = (key, options) => (
    <select
      value={filters[key]}
      onChange={e => setFilters({ ...filters, [key]: e.target.value })}
      className="rounded-xl bg-page-cool px-3 py-2.5 text-xs font-semibold outline-none transition-colors focus:ring-2 focus:ring-blue/30"
    >
      {options.map(x => <option key={x}>{x}</option>)}
    </select>
  )

  return (
    <Desk title="Discover athletes" subtitle="Filter locally verified talent profiles">
      {/* ── Filters ──────────────────────────────── */}
      <FadeIn>
        <section className="card mt-7 flex flex-wrap gap-3 p-4">
          {sel('sport', ['All', 'Sprinting', 'Football', 'Basketball', 'Badminton', 'Long Jump'])}
          {sel('location', ['All', 'Chennai', 'Bengaluru', 'Coimbatore', 'Hyderabad', 'Madurai', 'Pune', 'Mumbai', 'Delhi', 'Kochi'])}
          {sel('age', ['All', 'U18', '18+'])}
          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
            Potential ≥
            {sel('potential', ['0', '80', '85', '90', '95'])}
          </div>
        </section>
      </FadeIn>

      <p className="mt-5 text-sm text-muted">
        <b className="text-ink">{results.length}</b> athletes found {loading && "(Searching...)"}
      </p>

      {/* ── Results Table ─────────────────────────── */}
      <FadeIn delay={0.1}>
        <section className="card mt-3 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-page-cool text-xs text-muted">
              <tr>
                {['Athlete Name', 'Sport (Primary)', 'Potential', 'Growth', 'Verification', 'Age', 'Location', ''].map(h => (
                  <th className="px-5 py-4 font-semibold" key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map(x => {
                const ath = x.athlete;
                return (
                  <tr className="border-t border-track transition-colors hover:bg-page-cool/40" key={ath.id}>
                    <td className="px-5 py-4 font-bold">{ath.name || ath.id}</td>
                    <td>{filters.sport !== 'All' ? filters.sport : ath.primary_sport}</td>
                    <td>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        (x.sport_potential || 0) >= 93 ? 'bg-green/25 text-green-deep' : ''
                      }`}>
                        {x.sport_potential || 0}%
                      </span>
                    </td>
                    <td className="font-semibold text-green-deep">{x.growth_trend === 'improving' ? '↑ Improving' : x.growth_trend || 'None'}</td>
                    <td>{x.verification_score || 0}%</td>
                    <td>{ath.age}</td>
                    <td>{ath.location}</td>
                    <td>
                      <Link
                        className="rounded-full bg-ink px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-ink/80"
                        href={`/scout/athlete/${ath.id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      </FadeIn>
    </Desk>
  )
}
