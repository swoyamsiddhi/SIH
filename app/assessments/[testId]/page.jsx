'use client'
import { useState, useEffect } from 'react'
import { Header, PillButton, FadeIn, StatChip } from '../../../src/components/ui'
import { Check, Camera, Smartphone, Watch, User, Activity, Repeat } from 'lucide-react'

const steps = [
  { label: 'Place phone 3m away at waist level', Icon: Smartphone },
  { label: 'Connect wearable motion sensor', Icon: Watch },
  { label: 'Stand centered in camera frame', Icon: User },
]

export default function Test() {
  const [live, setLive] = useState(false)
  const [reps, setReps] = useState(0)
  const [form, setForm] = useState(87)

  useEffect(() => {
    if (!live) return
    const x = setInterval(() => {
      setReps(n => n < 12 ? n + 1 : n)
      setForm(f => Math.min(96, f + Math.floor(Math.random() * 3)))
    }, 800)
    return () => clearInterval(x)
  }, [live])

  return (
    <main className="phone min-h-screen px-5 pb-8">
      <Header title="Vertical Jump" back />

      {/* ── Setup Steps ──────────────────────────── */}
      <div className="space-y-2.5">
        {steps.map((s, i) => {
          const StepIcon = s.Icon
          return (
            <FadeIn key={s.label} delay={i * 0.08}>
              <div className={`flex items-center gap-3 rounded-2xl p-3.5 transition-colors ${
                live || i < 2 ? 'bg-green/25' : 'bg-white'
              }`}>
                <span className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  live || i < 2 ? 'bg-green-deep text-white' : 'bg-track text-muted'
                }`}>
                  {live || i < 2 ? <Check size={14} /> : <StepIcon size={14} />}
                </span>
                <p className="text-sm font-semibold">{s.label}</p>
              </div>
            </FadeIn>
          )
        })}
      </div>

      {/* ── Camera Preview ────────────────────────── */}
      <FadeIn delay={0.2}>
        <div className="grid-bg relative mt-6 flex h-72 items-center justify-center overflow-hidden rounded-[28px] bg-ink text-center text-white shadow-float">
          {/* Status badges */}
          <div className="absolute left-4 right-4 top-4 flex justify-center gap-2">
            {['Pose Active', 'Sensor Synced', 'Lighting Optimal'].map(x => (
              <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm" key={x}>
                <span className="h-1.5 w-1.5 rounded-full bg-green" /> {x}
              </span>
            ))}
          </div>

          {/* Center content */}
          <div>
            <Camera className="mx-auto mb-3 opacity-60" size={40} />
            <b className="text-sm">Real-Time Pose Tracking Ready</b>
            <p className="mt-1 text-[10px] text-white/50">Camera viewport active</p>
          </div>

          {/* Live overlay */}
          {live && (
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white p-4 text-left text-ink shadow-float">
              <div className="flex justify-between text-xs font-bold">
                <span>Form Accuracy</span>
                <span className="text-green-deep">{form}%</span>
              </div>
              <p className="mt-2 text-[36px] font-extrabold leading-none">
                {reps}<span className="ml-1.5 text-sm font-semibold text-muted">completed</span>
              </p>
            </div>
          )}
        </div>
      </FadeIn>

      {/* ── Live Assessment Metrics ───────────────── */}
      {live && (
        <FadeIn delay={0}>
          <div className="card mt-5 p-4">
            <p className="mb-3 text-xs font-bold text-muted uppercase tracking-wider">LIVE TELEMETRY</p>
            <div className="grid grid-cols-2 gap-2.5">
              {['Pose Skeleton', 'IMU Accelerometer', 'Movement Velocity', 'Camera Stability', 'Lighting Consistency'].map(x => (
                <span className="flex items-center gap-1.5 text-xs font-semibold" key={x}>
                  <Check size={13} className="text-green-deep" /> {x}
                </span>
              ))}
            </div>
          </div>

          {/* Stat row */}
          <div className="mt-3 flex gap-3">
            <StatChip icon={<Activity size={16} />} value={`${form}%`} label="Form Score" tone="bg-green/25" />
            <StatChip icon={<Repeat size={16} />} value={String(reps)} label="Repetitions" tone="bg-blue-pale" />
          </div>
        </FadeIn>
      )}

      {/* ── CTA ──────────────────────────────────── */}
      {live ? (
        <PillButton href="/assessments/vertical-jump/result" variant="amber" className="mt-6 w-full !py-4">
          Complete Assessment
        </PillButton>
      ) : (
        <PillButton onClick={() => setLive(true)} variant="amber" className="mt-6 w-full !py-4">
          START TEST
        </PillButton>
      )}
    </main>
  )
}
