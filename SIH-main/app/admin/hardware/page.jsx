'use client'
import { useState, useEffect } from 'react'
import { Desk, FadeIn, KpiCard } from '../../../src/components/ui'
import { api } from '../../../src/lib/api'
import { Cpu, Wifi, WifiOff, Wrench, Battery, Check, X, ShieldCheck } from 'lucide-react'

export default function Hardware() {
  const [hardwareKits, setHardwareKits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHardware() {
      const data = await api.hardware.getAll()
      setHardwareKits(data)
      setLoading(false)
    }
    fetchHardware()
  }, [])

  const onlineCount = hardwareKits.filter(k => k.status === 'Online').length

  if (loading) return <div className="p-8 text-center text-muted">Loading hardware telemetry...</div>

  return (
    <Desk title="Hardware infrastructure" subtitle="Testing kit telemetry and status" admin>
      {/* ── Overview KPIs ─────────────────────────── */}
      <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total kits deployed" value={hardwareKits.length} tone="bg-blue-pale" chip="412 centers" icon={Cpu} />
        <KpiCard label="Online & active" value={onlineCount} tone="bg-green/30" chip={`${Math.round((onlineCount / hardwareKits.length) * 100)}% uptime`} icon={Wifi} />
        <KpiCard label="Needs maintenance" value={1} tone="bg-coral-pale" chip="Action required" icon={Wrench} />
        <KpiCard label="Avg battery level" value="78%" tone="bg-amber-pale" chip="Healthy" icon={Battery} />
      </section>

      {/* ── Kit Cards ─────────────────────────────── */}
      <FadeIn delay={0.1}>
        <section className="mt-8">
          <h2 className="mb-4 font-bold">Deployed hardware kits</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hardwareKits.map(kit => {
              const isOnline = kit.status === 'Online'
              const isMaint = kit.status === 'Maintenance'
              const Icon = isOnline ? Wifi : isMaint ? Wrench : WifiOff

              return (
                <div className="card overflow-hidden" key={kit.id}>
                  {/* Status header */}
                  <div className={`flex items-center justify-between p-4 ${
                    isOnline ? 'bg-green/25' : isMaint ? 'bg-amber-pale' : 'bg-coral-pale'
                  }`}>
                    <div>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isOnline ? 'bg-green-deep text-white' : isMaint ? 'bg-amber text-ink' : 'bg-coral text-white'
                      }`}>
                        <Icon size={11} /> {kit.status}
                      </span>
                      <h3 className="mt-2 text-lg font-extrabold">{kit.id}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-extrabold">{kit.battery}%</span>
                      <p className="text-[10px] text-muted font-bold">BATTERY</p>
                    </div>
                  </div>

                  {/* Telemetry details */}
                  <div className="divide-y divide-track p-4">
                    {[
                      ['Sensor Hub', kit.sensor ? 'MPU6050 Operational' : 'Sensor Disconnected', kit.sensor],
                      ['Bluetooth LE', kit.bluetooth ? 'Connected' : 'Inactive', kit.bluetooth],
                      ['Firmware', kit.firmware, true],
                      ['Last Sync', kit.lastSync, true],
                    ].map(([label, val, ok]) => (
                      <div className="flex items-center justify-between py-2.5 text-xs" key={label}>
                        <span className="text-muted">{label}</span>
                        <span className={`font-semibold flex items-center gap-1 ${ok ? 'text-ink' : 'text-coral'}`}>
                          {typeof ok === 'boolean' && (
                            ok ? <Check size={12} className="text-green-deep" /> : <X size={12} className="text-coral" />
                          )}
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </FadeIn>
    </Desk>
  )
}
