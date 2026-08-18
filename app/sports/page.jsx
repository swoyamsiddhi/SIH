import { Header, BottomNav, Progress, HeroCard, FadeIn } from '../../src/components/ui'
import { sportMatches } from '../../src/data/mockData'
import { Trophy, Award, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function Sports() {
  return (
    <main className="phone nav-safe px-5">
      <Header title="Sport potential" back />
      <p className="mb-5 text-sm text-muted">
        Your suitability matches — based on verified assessments, not a guarantee of performance.
      </p>

      {/* Top match gets hero treatment */}
      <FadeIn>
        <Link href={`/sports/${sportMatches[0].sport.toLowerCase()}`}>
          <HeroCard
            title={`#1 MATCH — ${sportMatches[0].sport.toUpperCase()}`}
            subtitle="Strongest Potential Pathway"
            value={`${sportMatches[0].match}%`}
            color="coral"
            icon={<Trophy size={14} className="text-coral-deep inline" />}
          />
        </Link>
      </FadeIn>

      <div className="mt-5 space-y-3">
        {sportMatches.slice(1).map((x, i) => (
          <FadeIn key={x.sport} delay={(i + 1) * 0.08}>
            <Link href={`/sports/${x.sport.toLowerCase()}`} className="card flex items-center gap-4 p-5 transition-all hover:shadow-float">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-page-cool text-xs font-extrabold text-muted">
                #{i + 2}
              </span>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h2 className="font-bold">{x.sport}</h2>
                  <b className="text-lg">{x.match}%</b>
                </div>
                <div className="mt-2">
                  <Progress value={x.match} color={['bg-blue', 'bg-amber', 'bg-green', 'bg-coral'][i]} />
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
