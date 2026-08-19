import { Header, BottomNav, FadeIn } from '../../../src/components/ui'
import { performanceHistory } from '../../../src/data/mockData'
import { ShieldCheck } from 'lucide-react'

export default function History() {
  return (
    <main className="phone nav-safe px-5">
      <Header title="Performance history" back />
      <p className="mb-5 text-sm text-muted">Every test becomes a verified, timestamped record.</p>

      <div className="space-y-3">
        {performanceHistory.map((h, i) => (
          <FadeIn key={i} delay={i * 0.05}>
            <article className="card flex items-center justify-between p-5 transition-all hover:shadow-float">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 flex-col items-center justify-center rounded-2xl bg-blue-pale text-center">
                  <span className="text-[10px] font-bold leading-none text-muted">{h.date.split(' ')[1]}</span>
                  <span className="text-sm font-extrabold leading-none">{h.date.split(' ')[0]}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold">{h.test}</h3>
                  <p className="mt-0.5 text-xs text-muted">{h.result}</p>
                </div>
              </div>
              {h.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green/25 px-2.5 py-1 text-[10px] font-bold text-green-deep">
                  <ShieldCheck size={12} /> Verified
                </span>
              )}
            </article>
          </FadeIn>
        ))}
      </div>

      <BottomNav />
    </main>
  )
}
