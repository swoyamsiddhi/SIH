import { Header, BottomNav, PillButton, FadeIn } from '../../src/components/ui'
import { assessments } from '../../src/data/mockData'
import { Dumbbell, Zap, Timer, Activity, Target, ArrowUpRight } from 'lucide-react'

const getTestIcon = (id) => {
  switch (id) {
    case 'vertical-jump': return Activity
    case 'squat': return Dumbbell
    case 'push-up': return Dumbbell
    case 'sprint': return Activity
    case 'shuttle-run': return Target
    case 'balance': return Target
    case 'reaction-test': return Zap
    case 'coordination-test': return Target
    default: return Activity
  }
}

export default function Assessments() {
  const categories = ['Physical', 'Reaction']

  return (
    <main className="phone nav-safe px-5">
      <Header title="Assessments" back />

      <p className="mb-6 text-sm text-muted">
        Choose a standardized test to update your Athlete DNA profile.
      </p>

      {categories.map((group, gi) => (
        <FadeIn key={group} delay={gi * 0.1}>
          <section className="mb-7">
            <h2 className="mb-3 font-bold">{group} tests</h2>
            <div className="space-y-3">
              {assessments.filter(x => x.category === group).map((x) => {
                const IconComponent = getTestIcon(x.id)
                return (
                  <article className="card flex gap-3.5 p-4 transition-all hover:shadow-float" key={x.id}>
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      group === 'Physical' ? 'bg-blue-pale text-blue' : 'bg-amber-pale text-amber'
                    }`}>
                      <IconComponent size={22} />
                    </span>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold">{x.name}</h3>
                      <p className="mt-1 text-xs text-muted">{x.measures}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="flex items-center gap-1 rounded-full bg-page-cool px-2 py-0.5 text-[10px] font-semibold text-muted">
                          <Timer size={10} /> {x.time}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          x.difficulty === 'Easy' ? 'bg-green/25 text-green-deep'
                            : x.difficulty === 'Hard' ? 'bg-coral-pale text-coral'
                            : 'bg-amber-pale text-amber'
                        }`}>
                          {x.difficulty}
                        </span>
                      </div>
                    </div>
                    <PillButton href={`/assessments/${x.id}`} className="self-center !px-3.5 !py-2.5">
                      Start
                    </PillButton>
                  </article>
                )
              })}
            </div>
          </section>
        </FadeIn>
      ))}

      <BottomNav />
    </main>
  )
}
