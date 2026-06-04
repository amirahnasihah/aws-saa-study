'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

type InstallState = 'idle' | 'available' | 'installed' | 'unsupported'

function subscribeStandalone(onStoreChange: () => void) {
  const mq = window.matchMedia('(display-mode: standalone)')
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

function getStandaloneSnapshot() {
  return window.matchMedia('(display-mode: standalone)').matches
}

export default function PWAInstallProbe() {
  const isStandalone = useSyncExternalStore(
    subscribeStandalone,
    getStandaloneSnapshot,
    () => false,
  )
  const [promptState, setPromptState] = useState<'idle' | 'available' | 'unsupported'>('idle')
  const [appInstalled, setAppInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (isStandalone) return

    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setPromptState('available')
    }

    const onInstalled = () => {
      setAppInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    const timer = window.setTimeout(() => {
      setPromptState((current) => (current === 'idle' ? 'unsupported' : current))
    }, 2000)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [isStandalone])

  const state: InstallState =
    isStandalone || appInstalled ? 'installed' : promptState

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  const statusMessage: Record<InstallState, string> = {
    idle: 'Checking install support on this browser…',
    available: 'Chrome/Edge install prompt is available on this device.',
    installed: 'Already running as an installed app (standalone display mode).',
    unsupported:
      'No automatic install banner here — use Share → Add to Home Screen (Safari) or menu → Install (Chrome).',
  }

  return (
    <div className="rounded-xl border border-c1/20 bg-c1/5 p-4 space-y-3">
      <p className="font-space-mono text-[0.65rem] uppercase tracking-widest text-c1/70">
        Live install test (this page only)
      </p>
      <p className="font-space-mono text-[0.72rem] text-aws-text leading-relaxed">{statusMessage[state]}</p>
      {state === 'available' && (
        <button
          type="button"
          onClick={() => void handleInstall()}
          className="inline-flex font-space-mono text-[0.62rem] font-bold px-3 py-2 rounded-lg border border-c1/40 text-c1 bg-c1/10 hover:bg-c1/20 transition-colors"
        >
          Trigger install prompt
        </button>
      )}
      <p className="font-space-mono text-[0.58rem] text-aws-muted/70">
        Site-wide manifest is live — this block only tests the browser install API on /pwa.
      </p>
    </div>
  )
}
