import { Header, PillButton, Progress, WaveformCard, TickRowCard, SegmentedRingCard, FadeIn } from '../../../../src/components/ui'
import { result } from '../../../../src/data/mockData'

export default function Result() {
  return (
    <main className="phone min-h-screen px-5 pb-10">
      <Header title="Assessment result" back />

      {/* ── Waveform Card — Jump Height ───────────── */}
      <WaveformCard
        title="Jump Height"
        value="47"
        unit="cm"
        comparison="Peak 49 cm"
        color="blue"
      />

      {/* ── Tick Row — Consistency ────────────────── */}
      <FadeIn delay={0.1}>
        <div className="mt-4">
          <TickRowCard
            title="Consistency"
            value="94"
            unit="%"
            ticks={result.consistencyValues}
            color="green"
          />
        </div>
      </FadeIn>

      {/* ── Verification Ring ─────────────────────── */}
      <FadeIn delay={0.15}>
        <div className="mt-4">
          <SegmentedRingCard
            title="Verification score"
            subtitle="Camera, pose and sensor signals agree — 97%"
            segments={[
              { label: 'Video', value: 20, color: '#4FA3D1' },
              { label: 'Pose', value: 22, color: '#8FCB9E' },
              { label: 'Sensor', value: 20, color: '#EAB74A' },
              { label: 'Timing', value: 18, color: '#E8735C' },
              { label: 'Device', value: 17, color: '#3FA35A' },
            ]}
          />
        </div>
      </FadeIn>

      {/* ── Metric Breakdown ──────────────────────── */}
      <FadeIn delay={0.2}>
        <section className="card mt-4 p-5">
          <h2 className="font-bold">Metric breakdown</h2>
          <div className="mt-4 space-y-4">
            {[
              ['Jump height', '47 cm', 91],
              ['Explosive power', '91 percentile', 91],
              ['Form', `${result.form}%`, result.form],
              ['Consistency', `${result.consistency}%`, result.consistency],
              ['Verification', `${result.verification}%`, result.verification],
            ].map(([label, display, val]) => (
              <div key={label}>
                <div className="mb-1.5 flex justify-between text-xs font-semibold">
                  <span>{label}</span>
                  <b>{display}</b>
                </div>
                <Progress value={val} color={val >= 90 ? 'bg-green' : val >= 80 ? 'bg-blue' : 'bg-amber'} />
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── Comparison badges ─────────────────────── */}
      <FadeIn delay={0.25}>
        <div className="mt-4 flex gap-2">
          <span className="flex-1 rounded-2xl bg-blue-pale p-3 text-center text-[10px] font-bold">
            vs Age Group<br /><span className="mt-1 block text-base">Top 8%</span>
          </span>
          <span className="flex-1 rounded-2xl bg-green/25 p-3 text-center text-[10px] font-bold">
            vs Region<br /><span className="mt-1 block text-base">Top 12%</span>
          </span>
          <span className="flex-1 rounded-2xl bg-amber-pale p-3 text-center text-[10px] font-bold">
            vs Cohort<br /><span className="mt-1 block text-base">Top 5%</span>
          </span>
        </div>
      </FadeIn>

      <PillButton href="/dna" variant="amber" className="mt-6 w-full !py-4">
        VIEW ANALYSIS
      </PillButton>
    </main>
  )
}
