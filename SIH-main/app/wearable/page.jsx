'use client'
import { useState } from 'react'
import { Header, BottomNav, PillButton, FadeIn } from '../../src/components/ui'
import { BatteryCharging, Watch, Sliders, Radio, Check, Sparkles } from 'lucide-react'

export default function Wearable() {
  const [connected, setConnected] = useState(false)

  return (
    <main className="phone nav-safe px-5">
      <Header title="Your wearable" back />

      <h2 className="mb-6 text-3xl font-extrabold leading-tight">
        Track your<br />movement.
      </h2>

      {/* ── 2-column: Battery + Device ────────────── */}
      <FadeIn>
        <section className="grid grid-cols-2 gap-4">
          {/* Battery card */}
          <div className="relative overflow-hidden rounded-[24px] bg-green p-5 shadow-float text-ink">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/15" />
            <BatteryCharging size={28} className="text-ink" />
            <p className="mt-8 text-[36px] font-extrabold leading-none">86%</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider">Battery Level</p>
          </div>
          {/* Device card */}
          <div className="card flex flex-col justify-between p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-pale text-blue">
              <Watch size={28} />
            </div>
            <div>
              <p className="text-xs font-bold">KHEL Motion Band</p>
              <p className="mt-0.5 text-[10px] text-muted">ESP32 + MPU6050</p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── Customize ─────────────────────────────── */}
      <FadeIn delay={0.1}>
        <section className="mt-4 rounded-[24px] bg-amber-pale p-5 text-ink">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber/40 text-ink">
              <Sliders size={20} />
            </span>
            <div>
              <h3 className="font-bold text-sm">Hardware Configuration</h3>
              <p className="mt-0.5 text-xs text-muted">Sampling rate, prompts &amp; vibration</p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── Device specs ──────────────────────────── */}
      <FadeIn delay={0.15}>
        <section className="card mt-4 divide-y divide-track px-5">
          {[
            ['Status', connected ? 'Connected' : 'Disconnected', connected ? 'text-green-deep' : 'text-coral'],
            ['Bluetooth LE', connected ? 'Active' : 'Standby', ''],
            ['Firmware', 'v2.1.4 (Latest)', ''],
            ['Last Sync', connected ? 'Just now' : 'Never', ''],
            ['Sensor Pipeline', '6-Axis IMU (MPU6050)', ''],
          ].map(([label, val, cls]) => (
            <div className="flex justify-between py-3.5 text-sm" key={label}>
              <span className="text-muted">{label}</span>
              <b className={cls}>{val}</b>
            </div>
          ))}
        </section>
      </FadeIn>

      {/* ── Connect CTA ──────────────────────────── */}
      <FadeIn delay={0.2}>
        <PillButton
          onClick={() => setConnected(!connected)}
          variant="amber"
          className="mt-6 w-full !py-4"
        >
          {connected ? 'CONNECTED (SYNC READY)' : 'PAIR DEVICE NOW'}
        </PillButton>
      </FadeIn>

      <BottomNav />
    </main>
  )
}
