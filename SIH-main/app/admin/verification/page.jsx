import { Desk, FadeIn, SegmentedRingCard, Progress } from '../../../src/components/ui'
import { Check, X, ShieldCheck } from 'lucide-react'

const checks = [
  { label: 'Video Integrity', status: true, detail: 'No frame drops or splicing detected' },
  { label: 'Pose Continuity', status: true, detail: 'Consistent skeleton tracking throughout' },
  { label: 'Sensor Signal', status: true, detail: 'IMU data within expected range' },
  { label: 'Timing Consistency', status: true, detail: 'Frame timestamps match sensor clock' },
  { label: 'Device Integrity', status: true, detail: 'No firmware tampering detected' },
]

export default function Verification() {
  return (
    <Desk title="Verification dashboard" subtitle="Assessment authenticity and integrity monitoring" admin>
      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_.5fr]">
        {/* ── Checklist ──────────────────────────── */}
        <FadeIn>
          <div className="card p-6">
            <h2 className="font-bold">Assessment verification protocol</h2>
            <p className="mt-1 text-xs text-muted">
              Every assessment passes through 5 integrity checks before it&apos;s marked as verified.
            </p>
            <div className="mt-6 space-y-4">
              {checks.map((check) => (
                <div key={check.label} className="flex items-start gap-3 rounded-2xl bg-page-cool p-4">
                  <span className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    check.status ? 'bg-green-deep text-white' : 'bg-coral text-white'
                  }`}>
                    {check.status ? <Check size={14} /> : <X size={14} />}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{check.label}</p>
                    <p className="mt-0.5 text-xs text-muted">{check.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── Sidebar: Score + Ring ───────────────── */}
        <div className="space-y-5">
          <FadeIn delay={0.05}>
            <div className="relative overflow-hidden rounded-[28px] bg-green p-6 text-center shadow-float text-ink">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15" />
              <p className="text-xs font-bold tracking-wider">VERIFICATION SCORE</p>
              <p className="mt-3 text-[56px] font-extrabold leading-none">97%</p>
              <p className="mt-2 text-sm font-semibold">All checks passed</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <SegmentedRingCard
              title="Breakdown"
              subtitle="Score composition by check type"
              segments={[
                { label: 'Video', value: 20, color: '#4FA3D1' },
                { label: 'Pose', value: 22, color: '#8FCB9E' },
                { label: 'Sensor', value: 20, color: '#EAB74A' },
                { label: 'Timing', value: 18, color: '#E8735C' },
                { label: 'Device', value: 17, color: '#3FA35A' },
              ]}
            />
          </FadeIn>

          {/* Platform verification stats */}
          <FadeIn delay={0.15}>
            <div className="card p-5">
              <h3 className="text-sm font-bold">Platform stats</h3>
              <div className="mt-3 space-y-3">
                {[
                  ['Average score', '96.2%', 96],
                  ['Pass rate', '99.1%', 99],
                  ['Flagged this month', '0.9%', 1],
                ].map(([label, display, val]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted">{label}</span>
                      <b>{display}</b>
                    </div>
                    <Progress value={val} color={val > 90 ? 'bg-green' : 'bg-coral'} />
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </Desk>
  )
}
