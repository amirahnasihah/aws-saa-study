'use client'

import { useEffect, useState } from 'react'

type InstallState = 'idle' | 'available' | 'installed' | 'unsupported'

export default function PWAInstallProbe() {
  const [state, setState] = useState<InstallState>('idle')
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setState('installed')
      return
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setState('available')
    }

    const onInstalled = () => {
      setState('installed')
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    const timer = window.setTimeout(() => {
      setState((current) => (current === 'idle' ? 'unsupported' : current))
    }, 2000)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

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
        Draft manifest is linked on /pwa only — rest of site unchanged until you wire it globally.
      </p>
    </div>
  )
}
