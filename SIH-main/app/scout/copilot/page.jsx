'use client'
import { useState } from 'react'
import { Desk, PillButton, Progress, FadeIn } from '../../../src/components/ui'
import { VoiceInput } from '../../../src/components/ui/VoiceInput'
import { scoutAthletes } from '../../../src/data/mockData'
import { Sparkles, Search, Bot, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { parseCopilotQuery, discoverScoutAthletes } from '../../../src/lib/api/scouts'

const suggestions = [
  'Under-18 sprinters near Chennai with potential above 90',
  'Football athletes with 15%+ growth in last 3 months',
  'Top 5 verified athletes in Tamil Nadu',
  'Basketball players aged 16-18 in Maharashtra',
]

export default function Copilot() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const search = async (q) => {
    setQuery(q)
    setLoading(true)
    try {
      // 1. Parse NLP to structured filters
      const parsed = await parseCopilotQuery(q)
      console.log("Parsed explanation: ", parsed.explanation)
      
      // 2. Feed structured filters into discovery engine
      const results = await discoverScoutAthletes(parsed.filters)
      
      // 3. Format results to match UI expectations
      const formatted = results.map(x => ({
          ...x.athlete,
          potential: x.sport_potential || 0,
          growth: x.growth_trend === 'improving' ? 10 : 0,
          verification: x.verification_score || 0
      }))
      
      setResults(formatted)
    } catch(err) {
      console.error(err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceResult = (transcript) => {
    setQuery(transcript)
    search(transcript)
  }

  return (
    <Desk title="AI Scout Copilot" subtitle="Natural-language talent discovery engine">
      {/* ── Search ────────────────────────────────── */}
      <FadeIn>
        <section className="card mt-7 p-5">
          <p className="mb-3 text-xs font-bold text-muted uppercase tracking-wider">NATURAL LANGUAGE SEARCH</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && query && search(query)}
              placeholder="e.g. Find under-18 sprinters near Chennai with potential above 90..."
              className="flex-1 rounded-2xl bg-page-cool px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue/30"
            />
            <VoiceInput 
              onResult={handleVoiceResult} 
            />
            <PillButton onClick={() => query && search(query)} variant="dark" className="!px-5">
              Query
            </PillButton>
          </div>

          {/* Suggestion chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => search(s)}
                className="rounded-full bg-blue-pale px-3 py-1.5 text-[10px] font-semibold text-ink transition-colors hover:bg-blue/20"
              >
                {s}
              </button>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── Loading ──────────────────────────────── */}
      {loading && (
        <div className="mt-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue border-t-transparent" />
          <p className="mt-3 text-sm text-muted">Analyzing athlete database...</p>
        </div>
      )}

      {/* ── Results ──────────────────────────────── */}
      {results && !loading && (
        <FadeIn delay={0}>
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                <b>{results.length}</b> verified athletes matched
              </p>
              <span className="flex items-center gap-1.5 rounded-full bg-amber-pale px-3 py-1 text-[10px] font-bold text-ink">
                <Sparkles size={12} className="text-amber" /> KHEL-NET Engine
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((x, i) => (
                <Link
                  href={`/scout/athlete/${x.id}`}
                  key={x.id}
                  className="card p-5 transition-all hover:-translate-y-0.5 hover:shadow-float"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-pale text-xs font-bold text-blue">
                      #{i + 1}
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      x.potential >= 93 ? 'bg-green/25 text-green-deep' : 'bg-page-cool text-muted'
                    }`}>
                      {x.potential}% Potential
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-bold">{x.id}</p>
                  <p className="mt-1 text-xs text-muted">{x.sport} · {x.location} · Age {x.age}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="font-bold text-green-deep">+{x.growth}%</span>
                    <span className="text-muted">growth</span>
                    <span className="ml-auto text-muted">{x.verification}% verified</span>
                  </div>
                  <div className="mt-2">
                    <Progress value={x.potential} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ── Empty state ──────────────────────────── */}
      {!results && !loading && (
        <FadeIn delay={0.2}>
          <div className="mt-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-pale text-blue">
              <Sparkles size={28} />
            </div>
            <h3 className="mt-4 text-lg font-bold">Natural Language Talent Filtering</h3>
            <p className="mt-2 text-sm text-muted max-w-md mx-auto">
              Type queries with sport, age group, state, and potential thresholds. The system parses criteria and surfaces verified athlete matches.
            </p>
          </div>
        </FadeIn>
      )}
    </Desk>
  )
}
