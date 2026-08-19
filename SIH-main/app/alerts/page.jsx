import { Header, BottomNav, FadeIn } from '../../src/components/ui'
import { scoutAlerts } from '../../src/data/mockData'
import { Bell, Shield, Building2, Lock, ArrowUpRight } from 'lucide-react'

export default function Alerts() {
  return (
    <main className="phone nav-safe px-5">
      <Header title="Scout activity" back />
      <p className="mb-5 text-sm text-muted">
        Sports organizations viewing or shortlisting your profile.
      </p>

      <div className="space-y-4">
        {scoutAlerts.map((alert, i) => (
          <FadeIn key={alert.id} delay={i * 0.08}>
            <article className={`card relative overflow-hidden p-5 ${!alert.read ? 'ring-2 ring-coral/40' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted">{alert.date}</span>
                {!alert.read && (
                  <span className="rounded-full bg-coral px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                    New Interest
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-bold text-sm">
                {!alert.read ? 'Scout Evaluation Request' : 'Profile Viewed'}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{alert.reason}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-pale text-blue">
                  <Building2 size={16} />
                </span>
                <span className="text-xs font-bold">{alert.organization}</span>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>

      {/* Privacy note */}
      <FadeIn delay={0.3}>
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-page-cool p-4 text-xs leading-relaxed text-muted">
          <Lock size={16} className="mt-0.5 text-muted flex-shrink-0" />
          <p>
            Your profile visibility is governed by data privacy settings. Scouts only see anonymized metrics (Athlete ID, attribute scores, verification status) until explicit access is granted.
          </p>
        </div>
      </FadeIn>

      <BottomNav />
    </main>
  )
}
