'use client'
import { useState, useEffect } from 'react'
import { Desk, FadeIn } from '../../../src/components/ui'
import { getScoutShortlists } from '../../../src/lib/api/scouts'
import Link from 'next/link'

export default function Shortlists() {
  const [shortlists, setShortlists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getScoutShortlists()
        setShortlists(res)
      } catch(e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Desk title="Shortlists"><div className="p-8 text-center">Loading...</div></Desk>

  return (
    <Desk title="Shortlists" subtitle="Organized athlete groups for evaluation">
      <section className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shortlists.map((list, i) => (
          <FadeIn key={list.name} delay={i * 0.08}>
            <div className="card overflow-hidden">
              {/* Header */}
              <div className={`p-5 ${['bg-blue-pale', 'bg-green/25', 'bg-amber-pale'][i % 3]}`}>
                <p className="text-xs font-bold text-muted">{list.age_group}</p>
                <h3 className="mt-1 text-lg font-extrabold">{list.name}</h3>
                <p className="mt-2 text-3xl font-extrabold">{list.athletes?.length || 0}</p>
                <p className="text-xs text-muted">athletes</p>
              </div>
              {/* Preview athletes */}
              <div className="divide-y divide-track px-5">
                {list.athletes?.slice(0, 3).map(x => (
                    <Link
                      href={`/scout/athlete/${x.id}`}
                      className="flex items-center justify-between py-3 transition-colors hover:bg-page-cool/50"
                      key={x.id}
                    >
                      <div>
                        <p className="text-sm font-bold">{x.id}</p>
                        <p className="text-[10px] text-muted">{x.sport} · {x.location}</p>
                      </div>
                      <span className="text-sm font-bold">{x.potential}%</span>
                    </Link>
                  ))}
              </div>
              <div className="p-4">
                <Link href="/scout/discover" className="text-xs font-bold text-blue">
                  View all →
                </Link>
              </div>
            </div>
          </FadeIn>
        ))}
      </section>
    </Desk>
  )
}
