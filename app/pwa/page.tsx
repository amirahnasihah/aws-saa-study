import Link from 'next/link'
import Nav from '@/components/Nav'
import SiteFooter from '@/components/SiteFooter'
import PhoneFrame from '@/components/pwa/PhoneFrame'
import PWAIconTile from '@/components/pwa/PWAIconTile'
import PWAInstallProbe from '@/components/pwa/PWAInstallProbe'
import { ICON_SIZES, PWA_DRAFT } from '@/data/pwaPreview'

function HomeScreenGrid() {
  const slots = ['Photos', 'Maps', 'Mail', 'SAA Study', 'Notes', 'Settings', 'Calendar', 'Safari']
  return (
    <div className="px-4 pb-6">
      <div className="grid grid-cols-4 gap-x-3 gap-y-5 pt-2">
        {slots.map((name) => {
          const isApp = name === 'SAA Study'
          return (
            <div key={name} className="flex flex-col items-center gap-1">
              {isApp ? (
                <div className="w-[60px] h-[60px] rounded-[14px] overflow-hidden shadow-md ring-2 ring-c1/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icon.svg" alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-[60px] h-[60px] rounded-[14px] bg-white/10 border border-white/10" />
              )}
              <span
                className={`font-space-mono text-[0.5rem] text-center leading-tight max-w-[64px] truncate ${
                  isApp ? 'text-c1 font-bold' : 'text-white/50'
                }`}
              >
                {name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function IOSAddSheet() {
  return (
    <div className="mx-3 mb-3 rounded-2xl bg-zinc-800/95 border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-[0.8rem] font-semibold text-white truncate">{PWA_DRAFT.shortName}</p>
          <p className="text-[0.65rem] text-white/50 truncate">aws.amrhnshh.com</p>
        </div>
      </div>
      <div className="px-4 py-3 space-y-2">
        <p className="text-[0.72rem] text-white/80">Add to Home Screen</p>
        <p className="text-[0.62rem] text-white/45 leading-relaxed">
          Opens full screen without Safari toolbar — good for study sessions.
        </p>
      </div>
      <div className="px-4 py-3 border-t border-white/10 flex justify-end gap-2">
        <span className="text-[0.7rem] text-cyan-400 font-medium">Add</span>
        <span className="text-[0.7rem] text-white/40">Cancel</span>
      </div>
    </div>
  )
}

function AndroidInstallBanner() {
  return (
    <div className="mx-3 mt-2 mb-2 rounded-xl bg-zinc-800 border border-white/10 px-3 py-2.5 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon.svg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[0.68rem] font-medium text-white">Install {PWA_DRAFT.shortName}</p>
        <p className="text-[0.58rem] text-white/45">Add to home screen</p>
      </div>
      <span className="text-[0.62rem] font-bold text-emerald-400 px-2 py-1 rounded-md bg-emerald-400/10">
        Install
      </span>
    </div>
  )
}

function StandaloneChrome() {
  return (
    <div className="mx-3 mt-3 rounded-xl overflow-hidden border border-aws-border/60 shadow-xl">
      <div className="h-6 bg-[#0a0e1a] flex items-center justify-center">
        <span className="font-space-mono text-[0.45rem] text-white/40">9:41</span>
      </div>
      <div className="bg-aws-bg px-3 py-2.5 border-b border-aws-border/50 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" className="w-full h-full" />
        </div>
        <span className="font-space-mono text-[0.58rem] font-bold text-aws-text">{PWA_DRAFT.shortName}</span>
      </div>
      <div className="bg-aws-bg px-4 py-6 space-y-2">
        <p className="font-space-mono text-[0.55rem] uppercase tracking-widest text-c1/60">Practice</p>
        <div className="h-2 rounded-full bg-white/6 overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-c1 to-c5 rounded-full" />
        </div>
        <div className="rounded-lg border border-aws-border/50 bg-aws-card p-3">
          <p className="text-[0.65rem] text-aws-muted leading-relaxed">
            Standalone mode — no browser URL bar; feels like a native app shell.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PWAPreviewPage() {
  return (
    <>
      <Nav />

      <main className="max-w-5xl mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-16">
        <div className="mb-8">
          <span className="font-space-mono text-[0.6rem] uppercase tracking-widest text-amber-400/80">
            Hidden preview · not in nav
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-aws-text mt-2 mb-2">PWA preview</h1>
          <p className="font-space-mono text-[0.75rem] text-aws-muted max-w-xl leading-relaxed">
            See how the home-screen icon and installed app chrome could look before wiring PWA site-wide.
            Uses current <code className="text-c1/80">/icon.svg</code> — production usually needs PNG 192 &amp; 512.
          </p>
          <p className="font-space-mono text-[0.65rem] text-aws-muted/60 mt-2">
            URL: <Link href="/pwa" className="text-c1 hover:underline">/pwa</Link>
          </p>
        </div>

        <div className="mb-10">
          <PWAInstallProbe />
        </div>

        <section className="mb-12">
          <h2 className="font-space-mono text-[0.65rem] uppercase tracking-widest text-aws-muted mb-6">
            Home screen mockups
          </h2>
          <div className="flex flex-wrap justify-center gap-10 lg:gap-14">
            <PhoneFrame label="iOS home screen" platform="ios">
              <HomeScreenGrid />
            </PhoneFrame>
            <PhoneFrame label="Android + install banner" platform="android">
              <AndroidInstallBanner />
              <HomeScreenGrid />
            </PhoneFrame>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-space-mono text-[0.65rem] uppercase tracking-widest text-aws-muted mb-6">
            Install flows
          </h2>
          <div className="flex flex-wrap justify-center gap-10">
            <PhoneFrame label="Safari · Add to Home Screen" platform="ios">
              <div className="h-32 bg-gradient-to-b from-sky-900/40 to-transparent" />
              <IOSAddSheet />
            </PhoneFrame>
            <PhoneFrame label="Installed · standalone" platform="ios">
              <StandaloneChrome />
            </PhoneFrame>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-space-mono text-[0.65rem] uppercase tracking-widest text-aws-muted mb-4">
            Icon at common sizes
          </h2>
          <p className="font-space-mono text-[0.62rem] text-aws-muted/70 mb-6 max-w-lg">
            Dashed circle on 192px = Android maskable safe zone. SVG scales cleanly; ship PNGs for best store/install support.
          </p>
          <div className="flex flex-wrap gap-6 justify-center items-end p-6 rounded-xl bg-aws-card border border-aws-border">
            {ICON_SIZES.map(({ size, label }) => (
              <PWAIconTile
                key={size}
                size={size}
                label={label}
                showMaskableGuide={size === 192}
              />
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-aws-border bg-aws-card/50 p-5 space-y-3">
          <h2 className="font-space-mono text-[0.65rem] uppercase tracking-widest text-aws-muted">
            Draft manifest
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-space-mono text-[0.68rem]">
            <div>
              <dt className="text-aws-muted/60">name</dt>
              <dd className="text-aws-text">{PWA_DRAFT.name}</dd>
            </div>
            <div>
              <dt className="text-aws-muted/60">short_name</dt>
              <dd className="text-aws-text">{PWA_DRAFT.shortName}</dd>
            </div>
            <div>
              <dt className="text-aws-muted/60">theme_color</dt>
              <dd className="text-aws-text flex items-center gap-2">
                <span
                  className="inline-block w-4 h-4 rounded border border-white/20"
                  style={{ backgroundColor: PWA_DRAFT.themeColor }}
                />
                {PWA_DRAFT.themeColor}
              </dd>
            </div>
            <div>
              <dt className="text-aws-muted/60">display</dt>
              <dd className="text-aws-text">{PWA_DRAFT.display}</dd>
            </div>
          </dl>
          <p className="font-space-mono text-[0.58rem] text-aws-muted/60">
            Live manifest (site-wide):{' '}
            <a href="/manifest.webmanifest" className="text-c1 hover:underline">
              /manifest.webmanifest
            </a>
            {' · '}
            <a href="/icon-192.png" className="text-c1 hover:underline">
              icon-192.png
            </a>
            {' · '}
            <a href="/icon-512.png" className="text-c1 hover:underline">
              icon-512.png
            </a>
          </p>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/practice"
            className="font-space-mono text-[0.62rem] px-3 py-2 rounded-lg border border-aws-border text-aws-muted hover:text-aws-text transition-colors"
          >
            ← Practice
          </Link>
          <Link
            href="/"
            className="font-space-mono text-[0.62rem] px-3 py-2 rounded-lg border border-aws-border text-aws-muted hover:text-aws-text transition-colors"
          >
            Home
          </Link>
        </div>

        <SiteFooter tagline="PWA design lab · install MVP is site-wide" />
      </main>
    </>
  )
}
