'use client'

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react'
import Nav from '@/components/Nav'
import GlossaryText from '@/components/GlossaryText'
import SiteFooter from '@/components/SiteFooter'

const tocSections = [
  { id: 'mental-model', label: 'Mental Model' },
  { id: 'vpc-diagram', label: 'VPC Diagram' },
  { id: 'cidr', label: 'CIDR & IP Structure' },
  { id: 'subnets', label: 'Public vs Private' },
  { id: 'sg-nacl', label: 'SG vs NACL' },
  { id: 'flow-logs', label: 'VPC Flow Logs' },
  { id: 'route-tables', label: 'Route Tables' },
  { id: 'traffic', label: 'Traffic Flow' },
  { id: 'nat-flow', label: 'NAT Outbound Flow' },
  { id: 'nat-compare', label: 'NAT GW vs Instance' },
  { id: 'endpoints', label: 'VPC Endpoints' },
  { id: 'connectivity', label: 'Connectivity' },
  { id: 'vpn-dx', label: 'VPN vs Direct Connect' },
  { id: 'anatomy', label: 'Full Anatomy' },
  { id: 'tips', label: 'Memory Tricks' },
  { id: 'exam', label: 'Exam Quick Wins' },
  { id: 'links', label: 'Resources' },
] as const

function SidebarTOC({ activeId }: { activeId: string }) {
  return (
    <nav className="hidden xl:block fixed top-[calc(3.5rem+2rem)] right-[max(1rem,calc((100vw-860px)/2-220px))] w-[200px]">
      <p className="font-space-mono text-[0.55rem] uppercase tracking-[0.15em] text-aws-muted mb-2">On this page</p>
      <div className="border-l border-aws-border/40 space-y-0.5">
        {tocSections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`block pl-3 py-0.5 text-[0.68rem] leading-snug transition-colors ${
              activeId === s.id
                ? 'text-c4 border-l-2 border-c4 -ml-px font-semibold'
                : 'text-aws-muted hover:text-aws-text'
            }`}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

// Floating sticky TOC bar for below-xl — mirrors the Deep Notes / learn page
// (`OnThisPage`) horizontal bar. Stays pinned under the Nav and highlights the
// active section, replacing the static hero pills that used to scroll away.
function FloatingTOCBar({ activeId }: { activeId: string }) {
  return (
    <nav
      aria-label="On this page"
      className="xl:hidden sticky top-14 z-30 -mx-4 mb-8 border-b border-aws-border/60 bg-aws-bg/85 backdrop-blur-md"
    >
      <div className="nav-scroll flex items-center gap-1.5 overflow-x-auto px-4 py-2.5">
        {tocSections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={activeId === s.id ? 'location' : undefined}
            className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 font-space-mono text-[0.6rem] transition-all ${
              activeId === s.id
                ? 'border-c4/50 bg-c4/15 text-c4 font-semibold'
                : 'border-aws-border/50 text-aws-muted hover:text-aws-text hover:bg-white/6'
            }`}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default function VpcPage() {
  const [activeId, setActiveId] = useState('mental-model')
  const observerRef = useRef<IntersectionObserver | null>(null)

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const visible = entries.filter((e) => e.isIntersecting)
    if (visible.length > 0) {
      const sorted = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      setActiveId(sorted[0].target.id)
    }
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    })
    const ids = tocSections.map((s) => s.id)
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [handleIntersect])
  return (
    <>
      <Nav activePage="vpc" />
      <SidebarTOC activeId={activeId} />

      <main id="top" className="max-w-[860px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-20 md:pb-16">

        <FloatingTOCBar activeId={activeId} />

        {/* Hero */}
        <div className="text-center mb-10">
          <span className="font-space-mono text-[0.65rem] uppercase tracking-[0.15em] text-aws-muted">VPC Study Guide</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-2 text-aws-text">
            Master AWS VPC
          </h1>
          <p className="font-space-mono text-[0.78rem] text-aws-muted max-w-lg mx-auto leading-relaxed">
            Topic paling banyak keluar dalam SAA-C03. Faham konsep ni dan banyak soalan lain akan jadi senang.
          </p>
        </div>

        {/* Mental Model */}
        <section className="mb-10">
          <SectionHeader id="mental-model" emoji="🏘️" title="Mental Model — VPC Macam Apa?" />
          <div className="bg-aws-card border border-aws-border rounded-xl p-5 space-y-4">
            <div className="bg-c4/8 border border-c4/20 rounded-lg px-4 py-3">
              <p className="text-[0.88rem] text-aws-text leading-relaxed">
                Bayangkan VPC sebagai <strong className="text-c4">kawasan perumahan gated</strong> kau sendiri dalam AWS cloud —
                kau yang design layout, tentukan IP ranges, decide siapa boleh masuk.
              </p>
              <p className="text-[0.78rem] text-aws-muted mt-2">
                <strong className="text-amber-400">VPC vs Tailscale:</strong> Tailscale buat private overlay network antara devices yang dah wujud (macam Site-to-Site VPN).
                VPC adalah &ldquo;tanah&rdquo; asas dimana AWS resources kau dilahirkan dan hidup — lebih fundamental, bukan sekadar tunnel.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: '🏠', label: 'VPC', desc: 'Kawasan perumahan keseluruhan — kau tentukan boundary (CIDR range)' },
                { icon: '🛤️', label: 'Subnets', desc: 'Jalan-jalan dalam kawasan — public (ada jalan keluar IGW) vs private (lorong dalam je)' },
                { icon: '🚪', label: 'Internet Gateway', desc: 'Pintu pagar utama — kenderaan masuk DAN keluar, free, satu per VPC' },
                { icon: '🔁', label: 'NAT Gateway', desc: 'Pintu belakang — orang dalam boleh keluar (outbound), orang luar tak boleh masuk' },
                { icon: '📋', label: 'Route Tables', desc: 'Papan tanda jalan — arahkan traffic ke mana pergi dalam kawasan' },
                { icon: '💂', label: 'Security Groups', desc: 'Bodyguard setiap rumah (EC2) — stateful, ingat siapa dia bagi masuk' },
                { icon: '🚧', label: 'NACLs', desc: 'Checkpoint kat pintu masuk jalan (subnet) — stateless, check semua kenderaan dua arah' },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 bg-white/3 rounded-lg px-3 py-2.5">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-space-mono text-[0.68rem] font-bold text-c4">{item.label}</p>
                    <p className="text-[0.75rem] text-aws-muted leading-snug"><GlossaryText text={item.desc} /></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VPC Components diagram */}
        <section className="mb-10">
          <SectionHeader id="vpc-diagram" emoji="🗺️" title="VPC Components — Subnets & CIDR" />
          <div className="bg-aws-card border border-aws-border rounded-xl p-5 space-y-4">
            <p className="text-[0.78rem] text-aws-muted leading-relaxed">
              Reference diagram dari lecture{' '}
              <a
                href="https://business.whizlabs.com/learn/course/aws-solutions-architect-associate/153/video?layoutId=40373"
                target="_blank"
                rel="noopener noreferrer"
                className="text-c4 hover:text-aws-text transition-colors"
              >
                AWS VPC Overview: Subnets &amp; CIDR
              </a>
              . Tunjuk bagaimana VPC, subnets, route tables, IGW, NAT, SG dan NACL berhubung.
            </p>
            <figure className="rounded-xl border border-aws-border/80 overflow-hidden bg-white/[0.02]">
              <img
                src="/vpc/vpc-components-subnets-cidr.png"
                alt="AWS VPC diagram: 10.0.0.0/16 VPC with public subnet 10.0.1.0/24, private subnet 10.0.2.0/24, Internet Gateway, NAT Gateway, route tables, security groups, and NACLs"
                loading="lazy"
                className="w-full h-auto"
              />
              <figcaption className="px-4 py-3 border-t border-aws-border/60 font-space-mono text-[0.62rem] text-aws-muted leading-relaxed">
                VPC <code className="text-c4">10.0.0.0/16</code> · Public subnet{' '}
                <code className="text-c4">10.0.1.0/24</code> (route <code className="text-c4">0.0.0.0/0 → IGW</code>) · Private subnet{' '}
                <code className="text-c4">10.0.2.0/24</code> (route <code className="text-c4">0.0.0.0/0 → NAT</code>)
              </figcaption>
            </figure>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[0.75rem]">
              {[
                { label: 'VPC CIDR', value: '10.0.0.0/16 — parent range untuk semua subnets dalam VPC ni' },
                { label: 'Public subnet', value: '10.0.1.0/24 — public server + NAT Gateway; route table ada 0.0.0.0/0 → IGW' },
                { label: 'Private subnet', value: '10.0.2.0/24 — private server; outbound internet via NAT dalam public subnet' },
                { label: 'SG vs NACL', value: 'SG = per instance (stateful). NACL = per subnet boundary (stateless, allow + deny)' },
              ].map((item) => (
                <div key={item.label} className="bg-white/3 border border-aws-border/40 rounded-lg px-3 py-2.5">
                  <p className="font-space-mono text-[0.62rem] font-bold text-c4 mb-0.5">{item.label}</p>
                  <p className="text-aws-text leading-snug"><GlossaryText text={item.value} /></p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CIDR Reference */}
        <section className="mb-10">
          <SectionHeader id="cidr" emoji="🔢" title="CIDR — IP Address Reference" />

          {/* RFC 1918 — where do these numbers come from? */}
          <div className="bg-aws-card border border-aws-border rounded-xl p-5 mb-4">
            <p className="font-space-mono text-[0.65rem] uppercase tracking-[0.12em] text-c4/70 mb-3">Dari mana datang nombor 10.0.0.0 atau 172.31.0.0?</p>
            <p className="text-[0.78rem] text-aws-muted leading-relaxed mb-4">
              Masa create VPC, kau <strong className="text-aws-text">pilih sendiri</strong> IP range dari{' '}
              <strong className="text-c4">RFC 1918 private ranges</strong> — ranges ni <em>tidak boleh di-route</em> kat internet public,
              sebab tu sesuai untuk internal network. Kau tak boleh guna IP public macam <code className="text-c4">89.x.x.x</code> untuk VPC.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                { range: '10.0.0.0/8', desc: 'Terbesar — enterprise, banyak subnets', note: 'e.g. 10.0.0.0/16' },
                { range: '172.16.0.0/12', desc: 'Medium — AWS default VPC guna ini', note: 'AWS default: 172.31.0.0/16', highlight: true },
                { range: '192.168.0.0/16', desc: 'Paling biasa — rumah/pejabat kecil', note: 'e.g. 192.168.0.0/24' },
              ].map((r) => (
                <div key={r.range} className={`rounded-lg px-3 py-2.5 border ${r.highlight ? 'bg-c4/8 border-c4/25' : 'bg-white/3 border-aws-border/40'}`}>
                  <p className={`font-mono font-bold text-[0.82rem] ${r.highlight ? 'text-c4' : 'text-aws-text'}`}>{r.range}</p>
                  <p className="text-[0.72rem] text-aws-muted mt-0.5">{r.desc}</p>
                  <p className={`font-mono text-[0.68rem] mt-1 ${r.highlight ? 'text-c4/80' : 'text-aws-muted/70'}`}>{r.note}</p>
                </div>
              ))}
            </div>
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2.5">
              <p className="text-[0.75rem] text-aws-text mb-2">
                <span className="text-amber-400 font-bold">Apa maksud /16 tu?</span>{' '}
                Nombor selepas slash = <strong className="text-aws-text">berapa bits dikunci</strong> sebagai network prefix — bukan bilangan IPs.
                IPv4 ada 32 bits, baki bits lepas prefix = host bits → tentukan berapa IPs dalam range.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[0.72rem] font-mono">
                {[
                  { prefix: '/16', locked: '16 bits kunci', free: '16 bits bebas', ips: '2¹⁶ = 65,536 IPs' },
                  { prefix: '/24', locked: '24 bits kunci', free: '8 bits bebas', ips: '2⁸ = 256 IPs' },
                  { prefix: '/25', locked: '25 bits kunci', free: '7 bits bebas', ips: '2⁷ = 128 IPs' },
                ].map((b) => (
                  <div key={b.prefix} className="bg-white/3 border border-aws-border/30 rounded px-2.5 py-2">
                    <span className="text-c4 font-bold">{b.prefix}</span>
                    <span className="text-aws-muted"> → {b.locked}, {b.free}</span>
                    <p className="text-aws-text font-semibold mt-0.5">{b.ips}</p>
                  </div>
                ))}
              </div>
              <p className="text-[0.68rem] text-aws-muted mt-2">
                Sebab tu dalam route table kau nampak <code className="text-c4">172.31.0.0/16</code> — itu AWS default VPC range yang kau pilih masa setup.
              </p>
            </div>
          </div>

          {/* Network vs Host Division */}
          <div className="bg-aws-card border border-aws-border rounded-xl p-5 mb-4">
            <p className="font-space-mono text-[0.65rem] uppercase tracking-[0.12em] text-c4/70 mb-3">Structure IP Address — Network vs Host</p>
            <p className="text-[0.78rem] text-aws-muted leading-relaxed mb-4">
              Setiap IPv4 address ada <strong className="text-aws-text">32 bits</strong>, dibahagi kepada 4 kumpulan 8-bit (<GlossaryText text="octet" />).
              Subnet mask tentukan mana bahagian <strong className="text-c2">Network</strong> (prefix) dan mana bahagian <strong className="text-c1">Host</strong>.
            </p>

            {/* Visual octet breakdown */}
            <div className="mb-5">
              <p className="font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted mb-2">Contoh: 192.168.100.10 dengan /24 (255.255.255.0)</p>
              <div className="grid grid-cols-4 gap-1.5 mb-1.5">
                {[
                  { oct: '192', bits: '11000000', part: 'network' },
                  { oct: '168', bits: '10101000', part: 'network' },
                  { oct: '100', bits: '01100100', part: 'network' },
                  { oct: '10',  bits: '00001010', part: 'host' },
                ].map((o, i) => (
                  <div key={i} className={`rounded-lg border text-center py-2.5 px-1 ${o.part === 'network' ? 'bg-c2/10 border-c2/30' : 'bg-c1/10 border-c1/30'}`}>
                    <p className={`font-mono font-bold text-[1rem] leading-none ${o.part === 'network' ? 'text-c2' : 'text-c1'}`}>{o.oct}</p>
                    <p className="font-mono text-[0.55rem] text-aws-muted mt-1 leading-none">{o.bits}</p>
                    <p className="font-space-mono text-[0.5rem] uppercase tracking-wide mt-1.5 text-aws-muted">8 bits</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {[
                  { mask: '255', bits: '11111111', part: 'network' },
                  { mask: '255', bits: '11111111', part: 'network' },
                  { mask: '255', bits: '11111111', part: 'network' },
                  { mask: '0',   bits: '00000000', part: 'host' },
                ].map((m, i) => (
                  <div key={i} className={`rounded-lg border text-center py-2 px-1 ${m.part === 'network' ? 'bg-c2/5 border-c2/20' : 'bg-c1/5 border-c1/20'}`}>
                    <p className={`font-mono text-[0.82rem] font-semibold ${m.part === 'network' ? 'text-c2/80' : 'text-c1/80'}`}>{m.mask}</p>
                    <p className="font-mono text-[0.5rem] text-aws-muted mt-0.5">{m.bits}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 text-[0.72rem]">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-c2/40 border border-c2/40 shrink-0" /><span className="text-c2 font-semibold">Network portion</span><span className="text-aws-muted"><GlossaryText text="— 24 bits (3 octets) dikunci oleh /24" /></span></span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-c1/40 border border-c1/40 shrink-0" /><span className="text-c1 font-semibold">Host portion</span><span className="text-aws-muted"><GlossaryText text="— 8 bits bebas, boleh assign ke devices" /></span></span>
              </div>
            </div>

            {/* Simple rule */}
            <div className="bg-white/3 border border-aws-border/40 rounded-lg px-3 py-2.5 mb-4">
              <p className="font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted mb-1.5">Peraturan mudah</p>
              <p className="text-[0.78rem] text-aws-text leading-relaxed">
                <strong className="text-c4">192.168.100</strong><strong className="text-aws-muted">.</strong><strong className="text-c1">10</strong>
                {' '}— bahagian depan (<span className="text-c2">192.168.100</span>) = <strong>Network Address</strong>, bahagian belakang (<span className="text-c1">10</span>) = <strong>Host Address</strong>.
                Semua devices dalam subnet yang sama berkongsi bahagian Network yang sama.
              </p>
            </div>

            {/* Worked example: find network address */}
            <div className="bg-c4/5 border border-c4/20 rounded-lg px-4 py-3">
              <p className="font-space-mono text-[0.6rem] uppercase tracking-widest text-c4/70 mb-2">Contoh soalan exam: Cari Network Address</p>
              <p className="text-[0.82rem] text-aws-text font-semibold mb-3">
                PC diberi IP <code className="text-c4">192.168.50.191/26</code>. Apa Network Address-nya?
              </p>
              <div className="space-y-2 text-[0.75rem] mb-3">
                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-c4/20 flex items-center justify-center font-space-mono text-[0.6rem] font-bold text-c4 shrink-0">1</span>
                  <p className="text-aws-text"><strong>/26</strong> → 26 bits network, 6 bits host. Subnet mask <GlossaryText text="octet" /> terakhir: 256 − 2⁶ = 256 − 64 = <strong className="text-c4">192</strong> → mask = 255.255.255.<strong className="text-c4">192</strong></p>
                </div>
                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-c4/20 flex items-center justify-center font-space-mono text-[0.6rem] font-bold text-c4 shrink-0">2</span>
                  <p className="text-aws-text"><GlossaryText text="Octet" /> terakhir IP = <strong>191</strong> (<code className="font-mono text-aws-muted">10111111</code>). AND dengan mask 192 (<code className="font-mono text-aws-muted">11000000</code>) = <code className="font-mono text-c1">10000000</code> = <strong className="text-c1">128</strong></p>
                </div>
                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-c4/20 flex items-center justify-center font-space-mono text-[0.6rem] font-bold text-c4 shrink-0">3</span>
                  <p className="text-aws-text">Network Address = <strong className="text-c2">192.168.50</strong>.<strong className="text-c1">128</strong></p>
                </div>
              </div>
              <p className="text-[0.68rem] text-aws-muted">
                Shortcut: /26 = blok saiz 64 (2⁶). Cari gandaan 64 yang ≤ 191 → 0, 64, 128, 192... → <strong className="text-c1">128</strong> ✓
              </p>
            </div>
          </div>

          <div className="bg-aws-card border border-aws-border rounded-xl p-5">
            <div className="bg-c4/8 border border-c4/20 rounded-lg px-4 py-3 mb-4">
              <p className="font-space-mono text-[0.65rem] uppercase tracking-[0.12em] text-c4/70 mb-1">Formula</p>
              <p className="text-[0.9rem] text-aws-text font-mono font-semibold">
                Usable IPs = 2^(32 − prefix) − 5
              </p>
              <p className="text-[0.72rem] text-aws-muted mt-1.5 leading-relaxed">
                AWS reserve <strong className="text-aws-text">5 IPs</strong> setiap subnet:{' '}
                <code className="text-c4">.0</code> network ·{' '}
                <code className="text-c4">.1</code> VPC router ·{' '}
                <code className="text-c4">.2</code> DNS ·{' '}
                <code className="text-c4">.3</code> future ·{' '}
                <code className="text-c4">.255</code> broadcast
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[0.78rem]">
                <thead>
                  <tr className="border-b border-aws-border">
                    {['Prefix', 'Total IPs', 'Usable IPs', 'Common Use'].map((h, i) => (
                      <th key={h} className={`font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted pb-2.5 ${i === 0 || i === 3 ? 'text-left' : 'text-right'} ${i === 3 ? 'pl-3' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { prefix: '/16', total: '65,536', usable: '65,531', use: 'VPC range', hi: false },
                    { prefix: '/20', total: '4,096', usable: '4,091', use: 'Large subnet', hi: false },
                    { prefix: '/24', total: '256', usable: '251', use: 'Standard subnet ⭐', hi: true },
                    { prefix: '/26', total: '64', usable: '59', use: 'Small subnet ⭐', hi: true },
                    { prefix: '/27', total: '32', usable: '27', use: 'Exam favourite ⭐', hi: true },
                    { prefix: '/28', total: '16', usable: '11', use: 'AWS minimum', hi: false },
                  ].map((row) => (
                    <tr key={row.prefix} className={`border-b border-aws-border/40 ${row.hi ? 'bg-c4/5' : ''}`}>
                      <td className={`font-space-mono font-bold py-2.5 ${row.hi ? 'text-c4' : 'text-aws-text'}`}>{row.prefix}</td>
                      <td className="text-right py-2.5 text-aws-muted">{row.total}</td>
                      <td className="text-right py-2.5 font-semibold text-aws-text">{row.usable}</td>
                      <td className="pl-3 py-2.5 text-aws-muted">{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2.5">
              <p className="text-[0.75rem] text-aws-text">
                <span className="text-amber-400 font-bold">Shortcut exam:</span>{' '}
                Hafal /24=251, /26=59, /27=27. Kalau lupa, guna formula: tolak prefix dari 32 → hasilkan 2^x → tolak 5.
              </p>
            </div>
          </div>

          {/* Step-by-step calculation */}
          <div className="mt-4 bg-aws-card border border-aws-border rounded-xl p-5">
            <p className="font-space-mono text-[0.65rem] uppercase tracking-[0.12em] text-c4/70 mb-4">📐 Cara Kira — Step by Step</p>

            {/* Method */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {[
                { step: '1', label: 'Cari host bits', formula: '32 − prefix', eg: '32 − 26 = 6 bits' },
                { step: '2', label: 'Kira total IPs', formula: '2 ^ host bits', eg: '2⁶ = 64 IPs' },
                { step: '3', label: 'Tolak 5 reserved', formula: 'total − 5', eg: '64 − 5 = 59 usable' },
              ].map((s) => (
                <div key={s.step} className="bg-c4/6 border border-c4/15 rounded-lg px-3 py-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-c4/20 flex items-center justify-center font-space-mono text-[0.6rem] font-bold text-c4">{s.step}</span>
                    <span className="font-space-mono text-[0.62rem] uppercase tracking-wide text-aws-muted">{s.label}</span>
                  </div>
                  <p className="font-mono text-[0.82rem] font-semibold text-aws-text">{s.formula}</p>
                  <p className="text-[0.72rem] text-c4 mt-1">{s.eg}</p>
                </div>
              ))}
            </div>

            {/* Worked examples */}
            <p className="font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted mb-2">Contoh pengiraan</p>
            <div className="space-y-2 mb-5">
              {[
                {
                  prefix: '/24', bits: '32−24 = 8', total: '2⁸ = 256', usable: '256−5 = 251',
                  range: '10.0.1.0 – 10.0.1.255', note: 'Standard subnet, exam kerap guna',
                },
                {
                  prefix: '/26', bits: '32−26 = 6', total: '2⁶ = 64', usable: '64−5 = 59',
                  range: '10.0.1.0 – 10.0.1.63', note: 'Small subnet, boleh buat 4 subnet dalam /24',
                },
                {
                  prefix: '/27', bits: '32−27 = 5', total: '2⁵ = 32', usable: '32−5 = 27',
                  range: '10.0.1.0 – 10.0.1.31', note: 'Exam favourite — hafal 27 usable IPs',
                },
                {
                  prefix: '/28', bits: '32−28 = 4', total: '2⁴ = 16', usable: '16−5 = 11',
                  range: '10.0.1.0 – 10.0.1.15', note: 'AWS minimum subnet size',
                },
              ].map((ex) => (
                <div key={ex.prefix} className="grid grid-cols-[2.5rem_1fr] gap-3 bg-white/3 border border-aws-border/40 rounded-lg px-3 py-2.5">
                  <span className="font-space-mono text-[0.85rem] font-bold text-c4 self-center">{ex.prefix}</span>
                  <div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[0.72rem] font-mono mb-1">
                      <span className="text-aws-muted">{ex.bits}</span>
                      <span className="text-aws-muted">→ {ex.total}</span>
                      <span className="font-bold text-aws-text">→ {ex.usable}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[0.68rem]">
                      <span className="text-aws-muted font-mono">{ex.range}</span>
                      <span className="text-aws-muted italic">{ex.note}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 5 reserved IPs — from official AWS docs */}
            <p className="font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted mb-2">
              5 IPs yang AWS reserve setiap subnet{' '}
              <a
                href="https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-c4/60 hover:text-c4 transition-colors normal-case tracking-normal"
              >
                (official docs ↗)
              </a>
            </p>
            <div className="rounded-lg overflow-hidden border border-aws-border/40">
              <table className="w-full text-[0.75rem]">
                <thead>
                  <tr className="bg-white/3 border-b border-aws-border/40">
                    <th className="font-space-mono text-[0.58rem] uppercase tracking-widest text-aws-muted text-left px-3 py-2">IP Address</th>
                    <th className="font-space-mono text-[0.58rem] uppercase tracking-widest text-aws-muted text-left px-3 py-2">Reserved For</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ip: '10.0.0.0', role: 'Network address', note: '' },
                    { ip: '10.0.0.1', role: 'VPC router', note: 'AWS reserved' },
                    { ip: '10.0.0.2', role: 'DNS server', note: 'Base of VPC CIDR + 2' },
                    { ip: '10.0.0.3', role: 'Future use', note: 'AWS reserved' },
                    { ip: '10.0.0.255', role: 'Broadcast address', note: 'Broadcast not supported in VPC' },
                  ].map((r, i) => (
                    <tr key={r.ip} className={`border-b border-aws-border/30 ${i % 2 !== 0 ? 'bg-white/[0.015]' : ''}`}>
                      <td className="font-mono text-[0.75rem] text-c4 font-semibold px-3 py-2">{r.ip}</td>
                      <td className="px-3 py-2 text-aws-text">
                        {r.role}
                        {r.note && <span className="text-aws-muted text-[0.68rem] ml-2">— {r.note}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[0.68rem] text-aws-muted mt-2 leading-relaxed">
              Contoh di atas untuk subnet <code className="text-c4">10.0.0.0/24</code>. IP values berubah mengikut CIDR kau, tapi <strong className="text-aws-text">sentiasa 5 IPs</strong> dikira dari mana-mana subnet.{' '}
              <a href="https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html" target="_blank" rel="noopener noreferrer" className="text-c4/70 hover:text-c4 transition-colors">Sumber: AWS Subnet Sizing docs</a>
            </p>
          </div>
        </section>

        {/* Public vs Private */}
        <section className="mb-10">
          <SectionHeader id="subnets" emoji="🔀" title="Public vs Private Subnet" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-aws-card border border-c4/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🟢</span>
                <h3 className="font-space-mono font-bold text-c4 text-[0.78rem] uppercase tracking-wide">Public Subnet</h3>
              </div>
              <ul className="space-y-2">
                {[
                  'Route table ada 0.0.0.0/0 → IGW',
                  'EC2 mesti ada Public atau Elastic IP',
                  'Internet BOLEH initiate connection masuk',
                  'Guna untuk: web servers, ALB, NAT GW',
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-[0.78rem] text-aws-text leading-snug">
                    <span className="text-c4 shrink-0 mt-0.5">✓</span> <GlossaryText text={item} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-aws-card border border-c3/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🔒</span>
                <h3 className="font-space-mono font-bold text-c3 text-[0.78rem] uppercase tracking-wide">Private Subnet</h3>
              </div>
              <ul className="space-y-2">
                {[
                  'Tiada route ke IGW dalam route table',
                  'EC2 tiada public IP',
                  'Internet TIDAK boleh initiate connection masuk',
                  'Outbound via NAT GW (berbayar, optional)',
                  'Guna untuk: databases, app servers, Lambda',
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-[0.78rem] text-aws-text leading-snug">
                    <span className="text-c3 shrink-0 mt-0.5">✓</span> <GlossaryText text={item} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-3 bg-aws-card border border-aws-border rounded-xl px-4 py-3">
            <p className="text-[0.75rem] text-aws-muted">
              <span className="text-amber-400 font-bold">Ingat:</span>{' '}
              Subnet jadi &ldquo;public&rdquo; kerana ada route ke IGW — bukan kerana namanya &ldquo;public&rdquo;. Kau boleh namakan apa je, yang penting route table kena ada 0.0.0.0/0 → IGW.
            </p>
          </div>
        </section>

        {/* SG vs NACL */}
        <section className="mb-10">
          <SectionHeader id="sg-nacl" emoji="🔐" title="Security Groups vs NACLs — Yang Paling Selalu Confused" />
          <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[0.78rem]">
                <thead>
                  <tr className="border-b border-aws-border">
                    <th className="font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted text-left p-3 w-[30%]">Feature</th>
                    <th className="font-space-mono text-[0.6rem] uppercase tracking-widest text-c2 text-left p-3 bg-c2/5">Security Group (SG)</th>
                    <th className="font-space-mono text-[0.6rem] uppercase tracking-widest text-c5 text-left p-3 bg-c5/5">Network ACL (NACL)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { f: 'Applied at', sg: 'EC2 / ENI (instance level)', nacl: 'Subnet boundary' },
                    { f: 'Stateful?', sg: '✅ YES — reply auto allowed', nacl: '❌ NO — check EVERY packet both ways' },
                    { f: 'Rule types', sg: 'Allow only (no deny)', nacl: 'Allow AND Deny' },
                    { f: 'Can block IPs?', sg: '❌ Cannot deny specific IPs', nacl: '✅ Yes, explicit DENY rules' },
                    { f: 'Default (new)', sg: 'Deny all inbound, allow all out', nacl: 'Default NACL = allow all' },
                    { f: 'Rule evaluation', sg: 'All rules evaluated together', nacl: 'Lowest number first (first match wins)' },
                    { f: 'Scope', sg: 'Only instances SG is attached to', nacl: 'All instances in that subnet' },
                  ].map((row, i) => (
                    <tr key={row.f} className={`border-b border-aws-border/40 ${i % 2 !== 0 ? 'bg-white/[0.015]' : ''}`}>
                      <td className="font-space-mono font-bold text-[0.65rem] text-aws-muted p-3">{row.f}</td>
                      <td className="text-aws-text p-3 bg-c2/[0.03]"><GlossaryText text={row.sg} /></td>
                      <td className="text-aws-text p-3 bg-c5/[0.03]"><GlossaryText text={row.nacl} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-amber-500/5 border-t border-amber-500/15">
              <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-amber-400/70 mb-2">🧠 Cara Mudah Ingat</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <p className="text-[0.78rem] text-aws-text">
                  <span className="text-c2 font-bold">SG</span> = <span className="text-c2">S</span>mart/<span className="text-c2">S</span>tateful.
                  Instance level. Allow only. Guna untuk &ldquo;allow app A talk to app B&rdquo;.
                </p>
                <p className="text-[0.78rem] text-aws-text">
                  <span className="text-c5 font-bold">NACL</span> = <span className="text-c5">N</span>aive/<span className="text-c5">N</span>eeds-both-ways.
                  Subnet level. Can deny. Guna untuk &ldquo;block this IP range&rdquo;.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VPC Flow Logs */}
        <section className="mb-10">
          <SectionHeader id="flow-logs" emoji="🎥" title="VPC Flow Logs — CCTV Network Kau" />
          <div className="bg-aws-card border border-aws-border rounded-xl p-5 space-y-5">

            {/* Mental model */}
            <div className="bg-c3/8 border border-c3/20 rounded-lg px-4 py-3">
              <p className="font-space-mono text-[0.65rem] uppercase tracking-[0.12em] text-c3/70 mb-2">Mental Model</p>
              <p className="text-[0.82rem] text-aws-text leading-relaxed">
                Flow Logs = <strong className="text-c3">CCTV network VPC</strong>. Dia rakam <strong className="text-aws-text">SIAPA cakap dengan SIAPA</strong>{' '}
                (source IP, destination IP, port, ACCEPT/REJECT) — <strong className="text-c2">bukan APA dia cakap</strong> (bukan packet payload/content).
                Nak tengok isi packet sebenar? Itu kerja <GlossaryText text="Traffic Mirroring" />, bukan Flow Logs.
              </p>
              <p className="text-[0.75rem] text-aws-muted leading-relaxed mt-2">
                Data dikumpul <strong className="text-c4">di luar laluan traffic</strong> kau — jadi zero impact pada throughput/latency.
                Tapi <strong className="text-amber-300">bukan real-time</strong>: ambil beberapa minit untuk mula keluar log.
              </p>
            </div>

            {/* Anatomy: capture levels → flow log → destinations */}
            <div>
              <p className="font-space-mono text-[0.65rem] uppercase tracking-[0.12em] text-c3/70 mb-3">Anatomy — Dari Mana ke Mana</p>
              <div className="flex flex-col lg:flex-row items-stretch gap-3">

                {/* Capture levels */}
                <div className="flex-1 rounded-lg border border-c4/25 bg-c4/5 px-3 py-3">
                  <p className="font-space-mono text-[0.6rem] font-bold text-c4 mb-2">1. Capture Level (pilih satu)</p>
                  <div className="space-y-1.5">
                    {[
                      { k: 'VPC', d: 'Monitor SEMUA ENI dalam VPC' },
                      { k: 'Subnet', d: 'Monitor SEMUA ENI dalam subnet itu' },
                      { k: 'ENI', d: 'Monitor satu network interface je' },
                    ].map((x) => (
                      <div key={x.k} className="rounded-md bg-c4/8 border border-c4/20 px-2.5 py-1.5">
                        <p className="font-space-mono text-[0.7rem] font-bold text-c4">{x.k}</p>
                        <p className="text-[0.66rem] text-aws-muted leading-snug">{x.d}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <span aria-hidden className="hidden lg:flex self-center text-aws-muted/60 text-lg shrink-0">→</span>

                {/* Flow log */}
                <div className="flex-1 rounded-lg border border-c3/25 bg-c3/5 px-3 py-3 flex flex-col justify-center">
                  <p className="font-space-mono text-[0.6rem] font-bold text-c3 mb-2">2. Flow Log (filter traffic)</p>
                  <div className="space-y-1.5">
                    {[
                      { k: 'ACCEPT', d: 'Traffic yang SG/NACL benarkan', c: 'text-c4' },
                      { k: 'REJECT', d: 'Traffic yang SG/NACL block', c: 'text-c2' },
                      { k: 'ALL', d: 'Kedua-duanya sekali', c: 'text-c5' },
                    ].map((x) => (
                      <div key={x.k} className="rounded-md bg-c3/8 border border-c3/20 px-2.5 py-1.5">
                        <p className={`font-space-mono text-[0.7rem] font-bold ${x.c}`}>{x.k}</p>
                        <p className="text-[0.66rem] text-aws-muted leading-snug">{x.d}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <span aria-hidden className="hidden lg:flex self-center text-aws-muted/60 text-lg shrink-0">→</span>

                {/* Destinations */}
                <div className="flex-1 rounded-lg border border-c2/25 bg-c2/5 px-3 py-3">
                  <p className="font-space-mono text-[0.6rem] font-bold text-c2 mb-2">3. Destination (hantar ke mana)</p>
                  <div className="space-y-1.5">
                    {[
                      { k: 'CloudWatch Logs', d: 'Search/alarm cepat, real-ish-time monitoring' },
                      { k: 'Amazon S3', d: 'Simpan murah + query guna Athena' },
                      { k: 'Data Firehose', d: 'Stream ke analytics/3rd-party (dulu Kinesis Firehose)' },
                    ].map((x) => (
                      <div key={x.k} className="rounded-md bg-c2/8 border border-c2/20 px-2.5 py-1.5">
                        <p className="font-space-mono text-[0.7rem] font-bold text-c2">{x.k}</p>
                        <p className="text-[0.66rem] text-aws-muted leading-snug">{x.d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Anatomy of a flow log record */}
            <div>
              <p className="font-space-mono text-[0.65rem] uppercase tracking-[0.12em] text-c3/70 mb-3">Anatomy Satu Flow Log Record (default format)</p>
              <div className="rounded-lg overflow-hidden border border-aws-border/40">
                <div className="bg-aws-bg/60 px-3 py-2 border-b border-aws-border/40 overflow-x-auto nav-scroll">
                  <code className="font-mono text-[0.68rem] whitespace-nowrap">
                    <span className="text-aws-muted">2 </span>
                    <span className="text-aws-muted">123456789010 </span>
                    <span className="text-aws-muted">eni-1235b8ca </span>
                    <span className="text-c4 font-bold">172.31.16.139 </span>
                    <span className="text-c2 font-bold">172.31.16.21 </span>
                    <span className="text-c5">20641 </span>
                    <span className="text-c5">22 </span>
                    <span className="text-aws-muted">6 20 4249 1418530010 1418530070 </span>
                    <span className="text-c2 font-bold">REJECT </span>
                    <span className="text-aws-muted">OK</span>
                  </code>
                </div>
                <div className="px-3 py-3 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                  {[
                    { f: 'srcaddr', d: 'IP yang HANTAR', c: 'text-c4' },
                    { f: 'dstaddr', d: 'IP yang TERIMA', c: 'text-c2' },
                    { f: 'srcport / dstport', d: 'Port (22 = SSH)', c: 'text-c5' },
                    { f: 'protocol', d: '6 = TCP, 17 = UDP', c: 'text-aws-text' },
                    { f: 'action', d: 'ACCEPT / REJECT ← verdict SG+NACL', c: 'text-c2' },
                    { f: 'log-status', d: 'OK / NODATA / SKIPDATA', c: 'text-aws-text' },
                  ].map((x) => (
                    <div key={x.f}>
                      <p className={`font-mono text-[0.68rem] font-bold ${x.c}`}>{x.f}</p>
                      <p className="text-[0.64rem] text-aws-muted leading-snug">{x.d}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[0.72rem] text-aws-muted leading-relaxed mt-2">
                Record atas: ada orang cuba <strong className="text-c5">SSH (port 22)</strong> masuk tapi kena{' '}
                <strong className="text-c2">REJECT</strong> — maknanya SG atau NACL kau block. Inilah cara No.1 guna Flow Logs:{' '}
                <strong className="text-aws-text">diagnose SG/NACL terlalu ketat</strong>.
              </p>
            </div>

            {/* ACCEPT vs REJECT troubleshooting decision */}
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg px-4 py-3">
              <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-amber-400/70 mb-2">🔍 Baca REJECT macam mana?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <p className="text-[0.76rem] text-aws-text leading-relaxed">
                  <strong className="text-c2">REJECT pada INBOUND</strong> → request masuk kena block.
                  Suspect: <strong className="text-aws-text">SG inbound rule</strong> tak allow, atau NACL inbound DENY.
                </p>
                <p className="text-[0.76rem] text-aws-text leading-relaxed">
                  <strong className="text-c2">Request OK tapi REJECT pada return</strong> → NACL stateless punya pasal!
                  Tambah <strong className="text-aws-text">NACL outbound rule untuk ephemeral ports</strong> (1024–65535). SG takkan jadi macam ni (stateful).
                </p>
              </div>
            </div>

            {/* Not logged */}
            <div>
              <p className="font-space-mono text-[0.65rem] uppercase tracking-[0.12em] text-c3/70 mb-3">⛔ Yang TAK Di-log (exam suka tanya)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Traffic ke Amazon DNS server (kalau guna DNS sendiri → di-log)',
                  'Windows license activation traffic',
                  '169.254.169.254 — instance metadata',
                  '169.254.169.123 — Amazon Time Sync Service',
                  'DHCP traffic',
                  'Traffic ke reserved IP default VPC router',
                  'Traffic antara ENI endpoint ↔ Network Load Balancer',
                  'ARP (Address Resolution Protocol)',
                ].map((x) => (
                  <div key={x} className="flex gap-2 bg-white/3 border border-aws-border/40 rounded-lg px-3 py-2">
                    <span className="text-c2/70 shrink-0 text-[0.72rem]">✕</span>
                    <p className="text-[0.72rem] text-aws-muted leading-snug"><GlossaryText text={x} /></p>
                  </div>
                ))}
              </div>
            </div>

            {/* Gotchas / memory */}
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg px-4 py-3">
              <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-amber-400/70 mb-2">🧠 Cara Mudah Ingat + Gotchas</p>
              <ul className="space-y-1.5">
                {[
                  'INGAT "CCTV": rakam metadata SIAPA→SIAPA, bukan content. Content = Traffic Mirroring.',
                  'Tak boleh EDIT flow log lepas create — nak tukar format/IAM role/filter? Delete & buat baru.',
                  'Tak boleh enable untuk VPC peered melainkan peer VPC dalam account kau sendiri.',
                  'Nitro-based instance: aggregation interval SENTIASA ≤ 1 minit, walaupun kau set max 10 min.',
                  'Boleh enable untuk ENI service lain juga: ELB, RDS, ElastiCache, Redshift, WorkSpaces, NAT GW, TGW.',
                  'Flow Logs = sumber untuk GuardDuty & VPC Reachability/Detective. S3 + Athena = query SQL murah.',
                ].map((tip) => (
                  <li key={tip} className="text-[0.76rem] text-aws-text leading-relaxed flex gap-2">
                    <span className="text-amber-400/60 shrink-0">→</span>
                    <span><GlossaryText text={tip} /></span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[0.68rem] text-aws-muted">
              Sumber:{' '}
              <a href="https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html" target="_blank" rel="noopener noreferrer" className="text-c3/70 hover:text-c3 transition-colors">VPC Flow Logs docs</a>
              {' · '}
              <a href="https://docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html" target="_blank" rel="noopener noreferrer" className="text-c3/70 hover:text-c3 transition-colors">Flow Log Records</a>
              {' · '}
              <a href="https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-limitations.html" target="_blank" rel="noopener noreferrer" className="text-c3/70 hover:text-c3 transition-colors">Limitations</a>
            </p>
          </div>
        </section>

        {/* Route Tables Deep Dive */}
        <section className="mb-10">
          <SectionHeader id="route-tables" emoji="🗺️" title="Route Tables — Papan Tanda Dalam VPC" />
          <div className="bg-aws-card border border-aws-border rounded-xl p-5 space-y-5">

            {/* DNS vs Route Table analogy */}
            <div className="bg-c4/8 border border-c4/20 rounded-lg px-4 py-3">
              <p className="font-space-mono text-[0.65rem] uppercase tracking-[0.12em] text-c4/70 mb-2">Route Table bukan DNS Records</p>
              <p className="text-[0.82rem] text-aws-text leading-relaxed mb-3">
                Route Table bukan macam DNS records. DNS = <strong className="text-c2">buku telefon</strong> (&ldquo;nama ini → alamat IP ini&rdquo;).
                Route Table = <strong className="text-c4">Waze / Google Maps</strong> (&ldquo;nak pergi rangkaian ini → ikut jalan ini&rdquo;).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-c2/8 border border-c2/20 rounded-lg px-3 py-2.5">
                  <p className="font-space-mono text-[0.62rem] font-bold text-c2 mb-1">DNS Records</p>
                  <p className="text-[0.75rem] text-aws-text"><code className="text-c2">api.example.com</code> → <code className="text-c2">10.0.1.20</code></p>
                  <p className="text-[0.68rem] text-aws-muted mt-1">&ldquo;Rumah Ali berada di alamat Jalan Mawar No. 10&rdquo;</p>
                </div>
                <div className="bg-c4/8 border border-c4/20 rounded-lg px-3 py-2.5">
                  <p className="font-space-mono text-[0.62rem] font-bold text-c4 mb-1">Route Table</p>
                  <p className="text-[0.75rem] text-aws-text"><code className="text-c4">10.0.2.0/24</code> → <code className="text-c4">NAT Gateway</code></p>
                  <p className="text-[0.68rem] text-aws-muted mt-1">&ldquo;Nak pergi ke Jalan Mawar? Keluar simpang A&rdquo;</p>
                </div>
              </div>
            </div>

            {/* Route Table Anatomy */}
            <div>
              <p className="font-space-mono text-[0.65rem] uppercase tracking-[0.12em] text-c4/70 mb-3">Anatomy Route Table</p>
              <p className="text-[0.78rem] text-aws-muted leading-relaxed mb-3">
                Setiap route ada dua bahagian: <strong className="text-aws-text">Destination</strong> (CIDR — ke mana nak pergi) dan{' '}
                <strong className="text-aws-text">Target</strong> (through mana — gateway/connection mana).
                AWS auto-buat <strong className="text-c4">local route</strong> untuk semua traffic dalam VPC — tak boleh delete.
              </p>

              {/* Example route table */}
              <div className="rounded-lg overflow-hidden border border-aws-border/40 mb-3">
                <div className="bg-c4/10 border-b border-c4/20 px-3 py-2">
                  <p className="font-space-mono text-[0.62rem] font-bold text-c4">Contoh: Public Subnet Route Table</p>
                </div>
                <table className="w-full text-[0.78rem]">
                  <thead>
                    <tr className="bg-white/3 border-b border-aws-border/40">
                      <th className="font-space-mono text-[0.58rem] uppercase tracking-widest text-aws-muted text-left px-3 py-2">Destination</th>
                      <th className="font-space-mono text-[0.58rem] uppercase tracking-widest text-aws-muted text-left px-3 py-2">Target</th>
                      <th className="font-space-mono text-[0.58rem] uppercase tracking-widest text-aws-muted text-left px-3 py-2">Maksud</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { dest: '10.0.0.0/16', target: 'local', meaning: 'Traffic dalam VPC → hantar terus (auto, tak boleh delete)', hi: true },
                      { dest: '0.0.0.0/0', target: 'igw-abc123', meaning: 'Semua destination lain → keluar melalui Internet Gateway', hi: false },
                    ].map((r, i) => (
                      <tr key={i} className={`border-b border-aws-border/30 ${r.hi ? 'bg-c4/5' : ''}`}>
                        <td className="font-mono text-[0.75rem] text-c4 font-semibold px-3 py-2">{r.dest}</td>
                        <td className="font-mono text-[0.75rem] text-aws-text px-3 py-2">{r.target}</td>
                        <td className="text-[0.72rem] text-aws-muted px-3 py-2">{r.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-lg overflow-hidden border border-aws-border/40 mb-3">
                <div className="bg-c3/10 border-b border-c3/20 px-3 py-2">
                  <p className="font-space-mono text-[0.62rem] font-bold text-c3">Contoh: Private Subnet Route Table</p>
                </div>
                <table className="w-full text-[0.78rem]">
                  <thead>
                    <tr className="bg-white/3 border-b border-aws-border/40">
                      <th className="font-space-mono text-[0.58rem] uppercase tracking-widest text-aws-muted text-left px-3 py-2">Destination</th>
                      <th className="font-space-mono text-[0.58rem] uppercase tracking-widest text-aws-muted text-left px-3 py-2">Target</th>
                      <th className="font-space-mono text-[0.58rem] uppercase tracking-widest text-aws-muted text-left px-3 py-2">Maksud</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { dest: '10.0.0.0/16', target: 'local', meaning: 'Traffic dalam VPC → hantar terus', hi: true },
                      { dest: '0.0.0.0/0', target: 'nat-xyz789', meaning: 'Outbound internet → melalui NAT Gateway (private IP ditranslate)', hi: false },
                      { dest: 'pl-s3xxxxx', target: 'vpce-s3abc', meaning: 'S3 traffic → Gateway Endpoint (shortcut, free, tak perlu NAT)', hi: false },
                    ].map((r, i) => (
                      <tr key={i} className={`border-b border-aws-border/30 ${r.hi ? 'bg-c3/5' : ''}`}>
                        <td className="font-mono text-[0.75rem] text-c3 font-semibold px-3 py-2">{r.dest}</td>
                        <td className="font-mono text-[0.75rem] text-aws-text px-3 py-2">{r.target}</td>
                        <td className="text-[0.72rem] text-aws-muted px-3 py-2">{r.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Concepts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Main Route Table', desc: 'Auto-cipta bila buat VPC. Control routing untuk subnet yang tak explicitly associate dengan route table lain.', icon: '📋' },
                { label: 'Custom Route Table', desc: 'Kau buat sendiri untuk granular control. Contoh: satu untuk public subnets, satu lagi untuk private subnets.', icon: '✏️' },
                { label: 'Local Route', desc: 'Sentiasa ada: VPC CIDR → local. Membolehkan semua resources dalam VPC communicate antara satu sama lain. Tak boleh delete.', icon: '🏠' },
                { label: 'Most Specific Route Wins', desc: '10.0.1.0/24 lebih specific dari 0.0.0.0/0. AWS pilih route paling specific yang match destination IP.', icon: '🎯' },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 bg-white/3 border border-aws-border/40 rounded-lg px-3 py-2.5">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-space-mono text-[0.62rem] font-bold text-c4 mb-0.5">{item.label}</p>
                    <p className="text-[0.72rem] text-aws-muted leading-snug"><GlossaryText text={item.desc} /></p>
                  </div>
                </div>
              ))}
            </div>

            {/* What makes a subnet public? */}
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg px-4 py-3">
              <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-amber-400/70 mb-2">Apa yang jadikan subnet &ldquo;Public&rdquo;?</p>
              <p className="text-[0.78rem] text-aws-text leading-relaxed">
                <strong className="text-amber-300">Satu je syarat:</strong> Route table ada entry <code className="text-c4">0.0.0.0/0 → igw-id</code>.
                Tanpa route ini, walaupun kau namakan &ldquo;public-subnet&rdquo;, ia tetap private — tak ada jalan ke internet.
                EC2 juga mesti ada Public IP atau Elastic IP untuk internet boleh reply balik.
              </p>
            </div>

            <p className="text-[0.68rem] text-aws-muted">
              Sumber:{' '}
              <a href="https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html" target="_blank" rel="noopener noreferrer" className="text-c4/70 hover:text-c4 transition-colors">AWS Route Tables docs</a>
              {' · '}
              <a href="https://docs.aws.amazon.com/vpc/latest/userguide/RouteTables.html" target="_blank" rel="noopener noreferrer" className="text-c4/70 hover:text-c4 transition-colors">Route Table Concepts</a>
            </p>
          </div>
        </section>

        {/* Traffic Flow */}
        <section className="mb-10">
          <SectionHeader id="traffic" emoji="📡" title="Traffic Flow — Journey Request melalui VPC" />
          <div className="bg-aws-card border border-aws-border rounded-xl p-5">
            <p className="text-[0.78rem] text-aws-muted mb-4">User dari internet buat HTTP request ke EC2 web server dalam public subnet:</p>
            <div className="space-y-1">
              {[
                { step: '1', label: 'Internet', desc: 'User hantar request dari browser', color: 'text-aws-muted', bg: 'bg-white/3', border: 'border-white/8' },
                { step: '2', label: 'Internet Gateway (IGW)', desc: 'AWS entry point — check VPC route table ada route ke subnet', color: 'text-c4', bg: 'bg-c4/8', border: 'border-c4/20' },
                { step: '3', label: 'NACL — Inbound Check', desc: 'Subnet checkpoint (stateless). Rules diproses ikut nombor. Ada DENY rule? Stop. Allow? Teruskan.', color: 'text-c5', bg: 'bg-c5/8', border: 'border-c5/20' },
                { step: '4', label: 'Subnet', desc: 'Traffic masuk ke public subnet', color: 'text-aws-muted', bg: 'bg-white/3', border: 'border-white/8' },
                { step: '5', label: 'Security Group — Inbound Check', desc: 'Instance bodyguard (stateful). Allow port 80/443? Kalau tak ada rule, BLOCK.', color: 'text-c2', bg: 'bg-c2/8', border: 'border-c2/20' },
                { step: '6', label: 'EC2 Instance', desc: 'Request sampai ke application! 🎉', color: 'text-c1', bg: 'bg-c1/8', border: 'border-c1/20' },
              ].map((item, i) => (
                <div key={item.step} className="flex items-stretch gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-7 h-7 rounded-full border flex items-center justify-center ${item.border} ${item.bg}`}>
                      <span className={`font-space-mono text-[0.6rem] font-bold ${item.color}`}>{item.step}</span>
                    </div>
                    {i < 5 && <div className="w-px flex-1 bg-aws-border/30 my-0.5" />}
                  </div>
                  <div className={`flex-1 rounded-lg px-3 py-2 border mb-1 ${item.bg} ${item.border}`}>
                    <span className={`font-space-mono font-bold text-[0.68rem] ${item.color}`}>{item.label}</span>
                    <p className="text-[0.72rem] text-aws-muted leading-snug"><GlossaryText text={item.desc} /></p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-white/3 border border-aws-border/40 rounded-lg px-3 py-2.5">
              <p className="font-space-mono text-[0.58rem] uppercase tracking-[0.12em] text-aws-muted mb-1.5">↩ Reply / Response Path</p>
              <p className="text-[0.78rem] text-aws-text leading-relaxed">
                EC2 →{' '}
                <span className="text-c2 font-semibold">SG outbound</span> (stateful: auto allow reply — no rule needed) →{' '}
                <span className="text-c5 font-semibold">NACL outbound</span> (stateless: kena ada explicit rule untuk ephemeral ports 1024–65535!) →{' '}
                IGW → Internet
              </p>
              <p className="text-[0.72rem] text-amber-400/80 mt-1">
                <GlossaryText text="⚠ NACL stateless = kena explicit outbound rule. SG stateful = auto allow reply. Ini selalu keluar dalam exam!" />
              </p>
            </div>
          </div>
        </section>

        {/* NAT Gateway Outbound Flow */}
        <section className="mb-10">
          <SectionHeader id="nat-flow" emoji="🔁" title="NAT Gateway — Private Subnet Outbound Flow" />
          <div className="bg-aws-card border border-aws-border rounded-xl p-5 space-y-5">
            <p className="text-[0.78rem] text-aws-muted">EC2 dalam private subnet nak download patches atau call external API:</p>

            {/* Step-by-step flow */}
            <div className="space-y-1">
              {[
                { step: '1', label: 'EC2 Instance (Private Subnet)', desc: 'Initiate outbound request — ada Private IP sahaja, internet tak kenal IP ni', color: 'text-c1', bg: 'bg-c1/8', border: 'border-c1/20' },
                { step: '2', label: 'Private Route Table', desc: '0.0.0.0/0 → nat-gateway-id — traffic keluar dihalakan ke NAT Gateway dalam public subnet', color: 'text-c3', bg: 'bg-c3/8', border: 'border-c3/20' },
                { step: '3', label: 'NAT Gateway (Public Subnet)', desc: 'Translate Private IP → Elastic IP. Internet nampak Elastic IP sahaja, bukan IP EC2 sebenar.', color: 'text-c2', bg: 'bg-c2/8', border: 'border-c2/20' },
                { step: '4', label: 'Public Route Table', desc: '0.0.0.0/0 → igw-id — traffic dari NAT GW keluar ke internet melalui Internet Gateway', color: 'text-c4', bg: 'bg-c4/8', border: 'border-c4/20' },
                { step: '5', label: 'Internet Gateway → Internet', desc: 'Request sampai ke internet. Reply balik melalui path yang sama (EC2 ← NAT ← IGW ← Internet).', color: 'text-aws-muted', bg: 'bg-white/3', border: 'border-white/8' },
              ].map((item, i, arr) => (
                <div key={item.step} className="flex items-stretch gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-7 h-7 rounded-full border flex items-center justify-center ${item.border} ${item.bg}`}>
                      <span className={`font-space-mono text-[0.6rem] font-bold ${item.color}`}>{item.step}</span>
                    </div>
                    {i < arr.length - 1 && <div className="w-px flex-1 bg-aws-border/30 my-0.5" />}
                  </div>
                  <div className={`flex-1 rounded-lg px-3 py-2 border mb-1 ${item.bg} ${item.border}`}>
                    <span className={`font-space-mono font-bold text-[0.68rem] ${item.color}`}>{item.label}</span>
                    <p className="text-[0.72rem] text-aws-muted leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Route table comparison from the diagram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-c4/5 border border-c4/20 rounded-xl p-3">
                <p className="font-space-mono text-[0.6rem] uppercase tracking-widest text-c4 font-bold mb-2">Public Subnet Route Table</p>
                <table className="w-full text-[0.72rem]">
                  <thead>
                    <tr className="text-aws-muted font-space-mono text-[0.6rem]">
                      <th className="text-left pb-1 font-normal">Destination</th>
                      <th className="text-left pb-1 font-normal">Target</th>
                    </tr>
                  </thead>
                  <tbody className="text-aws-text">
                    <tr><td className="py-0.5 pr-3 font-mono">172.31.0.0/16</td><td className="py-0.5 text-aws-muted">local</td></tr>
                    <tr><td className="py-0.5 pr-3 font-mono">0.0.0.0/0</td><td className="py-0.5 text-c4 font-mono">igw-id</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-c3/5 border border-c3/20 rounded-xl p-3">
                <p className="font-space-mono text-[0.6rem] uppercase tracking-widest text-c3 font-bold mb-2">Private Subnet Route Table</p>
                <table className="w-full text-[0.72rem]">
                  <thead>
                    <tr className="text-aws-muted font-space-mono text-[0.6rem]">
                      <th className="text-left pb-1 font-normal">Destination</th>
                      <th className="text-left pb-1 font-normal">Target</th>
                    </tr>
                  </thead>
                  <tbody className="text-aws-text">
                    <tr><td className="py-0.5 pr-3 font-mono">172.31.0.0/16</td><td className="py-0.5 text-aws-muted">local</td></tr>
                    <tr><td className="py-0.5 pr-3 font-mono">0.0.0.0/0</td><td className="py-0.5 text-c3 font-mono">nat-gateway-id</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* No inbound + bastion note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-red-500/8 border border-red-500/25 rounded-xl px-3 py-2.5">
                <p className="font-space-mono text-[0.6rem] uppercase tracking-widest text-red-400/80 font-bold mb-1">⛔ Tiada Inbound</p>
                <p className="text-[0.75rem] text-aws-text leading-relaxed">Internet TIDAK BOLEH initiate connection ke private subnet — tiada route dari IGW ke private subnet. NAT GW = outbound only.</p>
              </div>
              <div className="bg-amber-500/8 border border-amber-500/25 rounded-xl px-3 py-2.5">
                <p className="font-space-mono text-[0.6rem] uppercase tracking-widest text-amber-400/80 font-bold mb-1">🏰 Bastion / Jump Host</p>
                <p className="text-[0.75rem] text-aws-text leading-relaxed">Nak SSH ke private instance? Letak EC2 (bastion host) dalam public subnet. Connect ke bastion dulu, then SSH ke private instance dari dalam.</p>
              </div>
            </div>
          </div>
        </section>

        {/* NAT Gateway vs NAT Instance */}
        <section className="mb-10">
          <SectionHeader id="nat-compare" emoji="⚖️" title="NAT Gateway vs NAT Instance — Comparison Table" />
          <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden">
            <div className="p-4 pb-2">
              <p className="text-[0.78rem] text-aws-muted leading-relaxed">
                AWS <strong className="text-aws-text">recommends NAT Gateway</strong> — better availability, bandwidth, dan zero maintenance.
                NAT Instance masih ada dalam exam sebagai distractor atau untuk edge cases (port forwarding, bastion).
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[0.78rem]">
                <thead>
                  <tr className="border-b border-aws-border">
                    <th className="font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted text-left p-3 w-[25%]">Feature</th>
                    <th className="font-space-mono text-[0.6rem] uppercase tracking-widest text-c4 text-left p-3 bg-c4/5">NAT Gateway</th>
                    <th className="font-space-mono text-[0.6rem] uppercase tracking-widest text-c5 text-left p-3 bg-c5/5">NAT Instance</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { f: 'Managed by', gw: 'AWS (fully managed)', inst: 'Kau sendiri (patching, updates, failover)' },
                    { f: 'Availability', gw: 'HA within AZ (redundant). Buat satu per AZ untuk full HA.', inst: 'Kena script sendiri untuk failover' },
                    { f: 'Bandwidth', gw: 'Scale up to 100 Gbps', inst: 'Bergantung pada instance type' },
                    { f: 'Security Groups', gw: '❌ Tak boleh attach SG pada NAT GW', inst: '✅ Boleh attach SG' },
                    { f: 'Port Forwarding', gw: '❌ Tak support', inst: '✅ Boleh configure manually' },
                    { f: 'Bastion Server', gw: '❌ Tak support', inst: '✅ Boleh guna sebagai bastion' },
                    { f: 'Public IP', gw: 'Elastic IP (pilih masa create)', inst: 'Elastic IP atau Public IP' },
                    { f: 'Cost', gw: 'Per hour + per GB processed', inst: 'EC2 pricing (instance + EBS)' },
                    { f: 'Timeout', gw: 'RST packet (clean reset)', inst: 'FIN packet (graceful close)' },
                  ].map((row, i) => (
                    <tr key={row.f} className={`border-b border-aws-border/40 ${i % 2 !== 0 ? 'bg-white/[0.015]' : ''}`}>
                      <td className="font-space-mono font-bold text-[0.65rem] text-aws-muted p-3">{row.f}</td>
                      <td className="text-aws-text p-3 bg-c4/[0.03]"><GlossaryText text={row.gw} /></td>
                      <td className="text-aws-text p-3 bg-c5/[0.03]"><GlossaryText text={row.inst} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-amber-500/5 border-t border-amber-500/15">
              <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-amber-400/70 mb-2">Exam Tips</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[0.78rem]">
                <p className="text-aws-text">
                  <span className="text-amber-300 font-bold">Default answer = NAT Gateway.</span> Kalau soalan mention &ldquo;managed&rdquo;, &ldquo;highly available&rdquo;, atau &ldquo;least operational overhead&rdquo; → NAT Gateway.
                </p>
                <p className="text-aws-text">
                  <span className="text-amber-300 font-bold">NAT Instance bila:</span> soalan mention &ldquo;port forwarding&rdquo;, &ldquo;bastion host&rdquo;, atau &ldquo;security group on NAT&rdquo; — tapi ini jarang keluar.
                </p>
              </div>
            </div>
            <div className="px-4 py-2 border-t border-aws-border/40">
              <p className="text-[0.68rem] text-aws-muted">
                Sumber: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-comparison.html" target="_blank" rel="noopener noreferrer" className="text-c4/70 hover:text-c4 transition-colors">AWS Compare NAT gateways and NAT instances</a>
              </p>
            </div>
          </div>
        </section>

        {/* VPC Endpoints Deep Dive */}
        <section className="mb-10">
          <SectionHeader id="endpoints" emoji="🔗" title="VPC Endpoints — Gateway vs Interface" />
          <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden space-y-0">
            <div className="p-4 pb-2">
              <p className="text-[0.78rem] text-aws-muted leading-relaxed">
                VPC Endpoint = shortcut untuk EC2 access AWS services <strong className="text-aws-text">tanpa keluar ke internet</strong>.
                Traffic stays within AWS network (AWS private backbone) — bukan lalu IGW / NAT / public internet.
                Sebab tu ia jawapan classic untuk <strong className="text-aws-text">&ldquo;low latency + high security&rdquo;</strong>:
                fewer hops = lower latency, tak terdedah ke internet = higher security (bonus: tak perlu NAT = jimat kos). Dua jenis utama — pilih ikut service.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[0.78rem]">
                <thead>
                  <tr className="border-b border-aws-border">
                    <th className="font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted text-left p-3 w-[22%]">Feature</th>
                    <th className="font-space-mono text-[0.6rem] uppercase tracking-widest text-c2 text-left p-3 bg-c2/5">Gateway Endpoint</th>
                    <th className="font-space-mono text-[0.6rem] uppercase tracking-widest text-c5 text-left p-3 bg-c5/5">Interface Endpoint (PrivateLink)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { f: 'Services', gw: '🟢 S3 dan DynamoDB sahaja', iface: 'Hampir semua AWS services lain (CloudWatch, SSM, ECR, SQS, dll)' },
                    { f: 'How it works', gw: 'Entry dalam route table → prefix list', iface: 'ENI (network interface) dalam subnet kau dengan private IP' },
                    { f: 'Cost', gw: '✅ FREE — tiada charges', iface: '💰 Berbayar — per hour + per GB processed' },
                    { f: 'Security', gw: 'Endpoint policy (IAM)', iface: 'Endpoint policy + Security Groups pada ENI' },
                    { f: 'DNS', gw: 'Tak perlu — route table handle', iface: 'Private DNS name resolve ke private IP (enable Private DNS)' },
                    { f: 'Cross-region', gw: '❌ Same region sahaja', iface: '❌ Same region sahaja' },
                    { f: 'Access from on-prem', gw: '❌ Tak boleh', iface: '✅ Boleh via VPN/Direct Connect' },
                  ].map((row, i) => (
                    <tr key={row.f} className={`border-b border-aws-border/40 ${i % 2 !== 0 ? 'bg-white/[0.015]' : ''}`}>
                      <td className="font-space-mono font-bold text-[0.65rem] text-aws-muted p-3">{row.f}</td>
                      <td className="text-aws-text p-3 bg-c2/[0.03]"><GlossaryText text={row.gw} /></td>
                      <td className="text-aws-text p-3 bg-c5/[0.03]"><GlossaryText text={row.iface} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-amber-500/5 border-t border-amber-500/15">
              <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-amber-400/70 mb-2">Cara Mudah Ingat</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[0.78rem]">
                <p className="text-aws-text">
                  <span className="text-c2 font-bold">&ldquo;GD Free&rdquo;</span> — <span className="text-c2">G</span>ateway endpoint untuk S3 + <span className="text-c2">D</span>ynamoDB = <span className="text-c2">Free</span>.
                  Letak dalam route table, bukan dalam subnet.
                </p>
                <p className="text-aws-text">
                  <span className="text-c5 font-bold">Interface = ENI</span> — buat network interface baru dalam subnet kau.
                  Boleh attach Security Group. Berbayar tapi support hampir semua services.
                </p>
              </div>
            </div>
            <div className="px-4 py-2 border-t border-aws-border/40">
              <p className="text-[0.68rem] text-aws-muted">
                Sumber:{' '}
                <a href="https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html" target="_blank" rel="noopener noreferrer" className="text-c4/70 hover:text-c4 transition-colors">AWS PrivateLink Concepts</a>
                {' · '}
                <a href="https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html" target="_blank" rel="noopener noreferrer" className="text-c4/70 hover:text-c4 transition-colors">Gateway Endpoints</a>
              </p>
            </div>
          </div>
        </section>

        {/* Connectivity Options */}
        <section className="mb-10">
          <SectionHeader id="connectivity" emoji="🤝" title="VPC Connectivity — Pilih Yang Mana?" />
          <div className="space-y-3">
            {[
              {
                title: 'VPC Peering',
                icon: '🤝',
                color: 'text-c2',
                border: 'border-c2/25',
                when: '2 VPCs je — simple, murah, cross-account/cross-region boleh',
                caveat: 'Non-transitive (A↔B, B↔C ≠ A↔C). IP ranges tak boleh overlap.',
                cost: 'Free (standard data transfer rates)',
              },
              {
                title: 'Transit Gateway (TGW)',
                icon: '🌐',
                color: 'text-c3',
                border: 'border-c3/25',
                when: '3+ VPCs atau on-premises. Transitive routing. Cross-region.',
                caveat: 'Kos per attachment + per GB. Overkill untuk 2 VPCs.',
                cost: 'Berbayar — per attachment + data',
              },
              {
                title: 'VPC Endpoints',
                icon: '🔗',
                color: 'text-c4',
                border: 'border-c4/25',
                when: 'EC2 nak access S3/DynamoDB (Gateway, free) atau AWS services lain (Interface)',
                caveat: 'Bukan untuk connect VPC-ke-VPC. Untuk EC2-to-AWSservice sahaja.',
                cost: 'Gateway = Free. Interface = Berbayar',
              },
              {
                title: 'Site-to-Site VPN',
                icon: '🔒',
                color: 'text-c6',
                border: 'border-c6/25',
                when: 'On-premises ke VPC — quick setup, guna internet yang dah ada',
                caveat: 'Latency tak konsisten (traverse internet public). Bandwidth terhad.',
                cost: 'Per VPN connection + data transfer',
              },
              {
                title: 'Direct Connect',
                icon: '📡',
                color: 'text-c1',
                border: 'border-c1/25',
                when: 'On-premises ke VPC — consistent latency, high bandwidth, compliance',
                caveat: 'Setup lambat (weeks/months), mahal. Guna untuk serious workloads.',
                cost: 'Mahal — dedicated physical connection',
              },
            ].map((item) => (
              <div key={item.title} className={`bg-aws-card border ${item.border} rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span>{item.icon}</span>
                  <h3 className={`font-space-mono font-bold text-[0.78rem] ${item.color}`}>{item.title}</h3>
                  <span className="ml-auto font-space-mono text-[0.58rem] text-aws-muted bg-white/3 px-2 py-0.5 rounded-full border border-aws-border/40">{item.cost}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[0.75rem]">
                  <p><span className="text-c4 font-semibold">Guna bila: </span><span className="text-aws-text"><GlossaryText text={item.when} /></span></p>
                  <p><span className="text-aws-muted font-semibold">Tapi: </span><span className="text-aws-muted"><GlossaryText text={item.caveat} /></span></p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* VPN vs Direct Connect */}
        <section className="mb-10">
          <SectionHeader id="vpn-dx" emoji="📡" title="Site-to-Site VPN vs Direct Connect — Detailed Comparison" />
          <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[0.78rem]">
                <thead>
                  <tr className="border-b border-aws-border">
                    <th className="font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted text-left p-3 w-[22%]">Feature</th>
                    <th className="font-space-mono text-[0.6rem] uppercase tracking-widest text-c6 text-left p-3 bg-c6/5">Site-to-Site VPN</th>
                    <th className="font-space-mono text-[0.6rem] uppercase tracking-widest text-c1 text-left p-3 bg-c1/5">AWS Direct Connect</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { f: 'Connection type', vpn: 'Encrypted tunnel over public internet', dx: 'Dedicated private physical connection' },
                    { f: 'Setup time', vpn: 'Minit ke jam — quick', dx: 'Minggu ke bulan — lambat (physical install)' },
                    { f: 'Bandwidth', vpn: 'Up to 1.25 Gbps per tunnel', dx: '1 Gbps, 10 Gbps, atau 100 Gbps' },
                    { f: 'Latency', vpn: 'Tak konsisten (traverse internet)', dx: 'Konsisten dan rendah (dedicated line)' },
                    { f: 'Encryption', vpn: '✅ IPsec encrypted by default', dx: '❌ Tak encrypted by default (tambah VPN on top untuk encryption)' },
                    { f: 'Cost', vpn: 'Murah — per connection hour + data', dx: 'Mahal — port hour + data out' },
                    { f: 'Redundancy', vpn: '2 tunnels per connection (active/passive)', dx: 'Kena buat 2 connections ke different locations' },
                    { f: 'Use case', vpn: 'Quick setup, backup, testing, small workloads', dx: 'Production, compliance, large data transfer, hybrid cloud' },
                  ].map((row, i) => (
                    <tr key={row.f} className={`border-b border-aws-border/40 ${i % 2 !== 0 ? 'bg-white/[0.015]' : ''}`}>
                      <td className="font-space-mono font-bold text-[0.65rem] text-aws-muted p-3">{row.f}</td>
                      <td className="text-aws-text p-3 bg-c6/[0.03]"><GlossaryText text={row.vpn} /></td>
                      <td className="text-aws-text p-3 bg-c1/[0.03]"><GlossaryText text={row.dx} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-amber-500/5 border-t border-amber-500/15">
              <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-amber-400/70 mb-2">Exam Pattern</p>
              <div className="space-y-2 text-[0.78rem]">
                <p className="text-aws-text">
                  <span className="text-amber-300 font-bold">&ldquo;Consistent latency&rdquo; / &ldquo;dedicated&rdquo; / &ldquo;compliance&rdquo;</span> → Direct Connect.
                </p>
                <p className="text-aws-text">
                  <span className="text-amber-300 font-bold">&ldquo;Quick setup&rdquo; / &ldquo;encrypted&rdquo; / &ldquo;backup connection&rdquo;</span> → Site-to-Site VPN.
                </p>
                <p className="text-aws-text">
                  <span className="text-amber-300 font-bold">&ldquo;Encrypted + consistent latency&rdquo;</span> → <strong className="text-c4">Direct Connect + VPN</strong> (DX for private line, VPN on top untuk encryption).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Full VPC Anatomy */}
        <section className="mb-10">
          <SectionHeader id="anatomy" emoji="🏗️" title="Full VPC Anatomy — Semua Components Dalam Satu Gambar" />
          <div className="bg-aws-card border border-aws-border rounded-xl p-5 space-y-5">

            <p className="text-[0.78rem] text-aws-muted leading-relaxed">
              Ni macam &ldquo;peta sebenar&rdquo; — semua VPC components dan hubungan antara satu sama lain. Exam suka tanya &ldquo;mana kena letak apa&rdquo;.
            </p>

            {/* AWS-style nested architecture diagram */}
            <div className="bg-[#0d1117] border border-aws-border/60 rounded-xl p-3 sm:p-5 overflow-x-auto">
              <div className="min-w-[300px] space-y-3">

                {/* AWS Cloud boundary */}
                <div className="rounded-lg border border-aws-border bg-white/[0.015] p-2.5 sm:p-3">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#242F3E] shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 18a4 4 0 0 1 .3-8 5 5 0 0 1 9.5-1.4A3.5 3.5 0 1 1 17 18H6.5z" /></svg>
                    </span>
                    <span className="font-space-mono text-[0.6rem] font-bold text-aws-muted tracking-wide">AWS Cloud</span>
                    <span className="ml-auto font-space-mono text-[0.55rem] text-aws-muted/70">Region · ap-southeast-1</span>
                  </div>

                  {/* VPC boundary */}
                  <div className="rounded-lg border border-[#8C4FFF]/50 bg-[#8C4FFF]/[0.04] p-2.5 sm:p-3">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <AwsIcon kind="vpc" size={22} />
                      <span className="font-space-mono text-[0.62rem] font-bold text-[#B794FF]">Virtual Private Cloud</span>
                      <span className="ml-auto font-space-mono text-[0.58rem] text-[#B794FF]/80">10.0.0.0/16</span>
                    </div>

                    {/* Availability Zone boundary */}
                    <div className="rounded-lg border border-dashed border-[#00A4A6]/50 p-2.5 sm:p-3">
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <span className="inline-block h-3 w-3 rounded-sm border border-dashed border-[#00A4A6] shrink-0" />
                        <span className="font-space-mono text-[0.58rem] font-semibold text-[#4FD0D2]">Availability Zone A</span>
                      </div>

                      {/* Public subnet */}
                      <div className="rounded-md border border-[#7AA116]/45 bg-[#7AA116]/[0.07] p-2.5 mb-2.5">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2.5">
                          <span className="font-space-mono text-[0.58rem] font-bold text-[#A6CE39]">Public Subnet</span>
                          <span className="font-space-mono text-[0.55rem] text-aws-muted">10.0.1.0/24</span>
                          <span className="ml-auto font-space-mono text-[0.5rem] text-[#A6CE39] bg-[#7AA116]/15 px-1.5 py-0.5 rounded">0.0.0.0/0 → IGW</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <ServiceTile kind="alb" label="Application Load Balancer" />
                          <ServiceTile kind="nat" label="NAT Gateway" sub="+ Elastic IP" />
                        </div>
                      </div>

                      {/* Private subnet */}
                      <div className="rounded-md border border-[#147EBA]/55 bg-[#147EBA]/[0.07] p-2.5">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2.5">
                          <span className="font-space-mono text-[0.58rem] font-bold text-[#3FA9E0]">Private Subnet</span>
                          <span className="font-space-mono text-[0.55rem] text-aws-muted">10.0.2.0/24</span>
                          <span className="ml-auto font-space-mono text-[0.5rem] text-[#3FA9E0] bg-[#147EBA]/15 px-1.5 py-0.5 rounded">0.0.0.0/0 → NAT GW</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <ServiceTile kind="ec2" label="App Server" sub="EC2" />
                          <ServiceTile kind="rds" label="Database" sub="RDS" />
                        </div>
                      </div>
                    </div>

                    {/* Internet Gateway at VPC edge */}
                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      <AwsIcon kind="igw" size={22} />
                      <span className="font-space-mono text-[0.56rem] text-[#B794FF]">Internet Gateway · 1 per VPC · free</span>
                    </div>
                  </div>
                </div>

                {/* connector */}
                <div className="flex justify-center"><div className="h-4 w-px bg-aws-border" /></div>

                {/* external connectivity */}
                <div className="grid grid-cols-3 gap-2">
                  <ExternalTile kind="users" label="Internet Users" sub="public" />
                  <ExternalTile kind="vpngw" label="Site-to-Site VPN" sub="IPsec tunnel" />
                  <ExternalTile kind="dx" label="Direct Connect" sub="dedicated line" />
                </div>
                <p className="text-center font-space-mono text-[0.55rem] text-aws-muted leading-relaxed">
                  ↑ VPN &amp; Direct Connect link the VPC to your On-Premises Data Center
                </p>
              </div>
            </div>

            {/* Component Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { label: 'IGW', desc: '1 per VPC, free, bidirectional', color: 'text-c4', bg: 'bg-c4/8 border-c4/20' },
                { label: 'NAT GW', desc: 'Public subnet, outbound only, berbayar', color: 'text-c2', bg: 'bg-c2/8 border-c2/20' },
                { label: 'SG', desc: 'Instance level, stateful, allow only', color: 'text-c2', bg: 'bg-c2/8 border-c2/20' },
                { label: 'NACL', desc: 'Subnet level, stateless, allow + deny', color: 'text-c5', bg: 'bg-c5/8 border-c5/20' },
                { label: 'Route Table', desc: 'Destination → Target per subnet', color: 'text-c3', bg: 'bg-c3/8 border-c3/20' },
                { label: 'VPC Endpoint', desc: 'Shortcut ke S3/DynamoDB (free) atau services lain', color: 'text-c4', bg: 'bg-c4/8 border-c4/20' },
              ].map((item) => (
                <div key={item.label} className={`rounded-lg border px-2.5 py-2 ${item.bg}`}>
                  <p className={`font-space-mono text-[0.62rem] font-bold ${item.color}`}>{item.label}</p>
                  <p className="text-[0.65rem] text-aws-muted leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Placement Rules */}
            <div className="bg-c4/5 border border-c4/15 rounded-xl p-4">
              <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-c4/70 mb-3">Exam Cheat: Apa Letak Mana?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[0.75rem]">
                <div>
                  <p className="text-c4 font-bold font-space-mono text-[0.62rem] mb-1.5">PUBLIC SUBNET</p>
                  <ul className="space-y-1 text-aws-text">
                    {['ALB / NLB', 'NAT Gateway', 'Bastion Host / Jump Box', 'Web servers (with public IP)'].map((item) => (
                      <li key={item} className="flex gap-1.5"><span className="text-c4 shrink-0">•</span> {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-c3 font-bold font-space-mono text-[0.62rem] mb-1.5">PRIVATE SUBNET</p>
                  <ul className="space-y-1 text-aws-text">
                    {['Application servers', 'Databases (RDS, Aurora, DynamoDB)', 'Lambda functions (VPC-connected)', 'ElastiCache clusters'].map((item) => (
                      <li key={item} className="flex gap-1.5"><span className="text-c3 shrink-0">•</span> {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Multi-AZ diagram note */}
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg px-4 py-3">
              <p className="text-[0.78rem] text-aws-text leading-relaxed">
                <span className="text-amber-400 font-bold">Production best practice:</span> Duplicate structure across 2+ AZs —
                setiap AZ ada public + private subnet sendiri, dengan NAT Gateway sendiri.
                Kalau satu AZ down, traffic failover ke AZ lain. Ini yang dimaksudkan &ldquo;zone-independent architecture&rdquo;.
              </p>
            </div>
          </div>
        </section>

        {/* Memory Tricks */}
        <section className="mb-10">
          <SectionHeader id="tips" emoji="🧠" title="Memory Tricks — Cara Mudah Ingat" />
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
            <div className="space-y-3">
              {[
                { label: 'CIDR — IP Dari Mana?', tip: 'Kau pilih sendiri dari RFC 1918 private ranges: 10.x, 172.16–31.x, 192.168.x. Bukan public IP. AWS default VPC guna 172.31.0.0/16.' },
                { label: 'Slash bukan bilangan IP', tip: '/16 bukan 16 IPs — ia 16 bits dikunci. 32−16=16 bits bebas → 2^16 = 65,536 IPs. /24 = 256 IPs, /27 = 32 IPs.' },
                { label: 'Network vs Host', tip: '192.168.100.10/24 → 192.168.100 = Network (3 octets, 24 bits), .10 = Host. Semua devices dalam subnet sama berkongsi network portion yang sama.' },
                { label: 'Cari Network Address', tip: 'IP/26: blok saiz 64. Cari gandaan 64 ≤ last octet. 191 → 128 ✓. Atau AND binary: 10111111 AND 11000000 = 10000000 = 128.' },
                { label: 'CIDR Formula', tip: '32 − prefix = bits. 2^bits = total. Tolak 5 = usable. Hafal: /24=251, /26=59, /27=27' },
                { label: 'IGW vs NAT', tip: 'IGW = dua arah (in + out), free. NAT = outbound je, berbayar. NAT DUDUK DALAM PUBLIC SUBNET!' },
                { label: 'SG = Stateful', tip: '"SG ingat siapa dia bagi masuk — reply auto OK". NACL = "check tiap packet dua arah, kena ada explicit rules"' },
                { label: 'SG tak boleh deny', tip: 'SG = allow only. Nak block specific IP address? → Guna NACL Deny rule' },
                { label: 'NACL outbound trap', tip: 'NACL stateless → kena ada outbound rule untuk ephemeral ports 1024–65535 untuk replies boleh keluar' },
                { label: 'VPC Peering = non-transitive', tip: 'A↔B dan B↔C, tapi A tak reach C. Macam "kawan kawan bukan kawan aku". Guna TGW kalau 3+ VPCs' },
                { label: 'Gateway Endpoint = Free', tip: '"GD Free" — Gateway untuk S3 + DynamoDB = percuma. Interface Endpoint (semua lain) = berbayar' },
                { label: 'Default NACL vs Custom NACL', tip: 'Default NACL = allow all (generous). Custom NACL = deny all by default (strict — kena add rules sendiri)' },
                { label: 'Route table troubleshoot', tip: 'No internet? Check: (1) ada 0.0.0.0/0 route ke IGW? (2) subnet associate route table betul? (3) EC2 ada public IP?' },
                { label: 'Peering vs TGW', tip: '2 VPCs = Peering (simpler, cheaper). 3+ VPCs semua nak communicate = Transit Gateway (transitive)' },
                { label: 'VPC macam Tailscale?', tip: 'Lebih tepat: VPC = "tanah" AWS resources kau wujud. Tailscale/Site-to-Site VPN = tunnel yang connect places yang dah wujud.' },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <span className="text-amber-400 shrink-0 font-bold mt-0.5">→</span>
                  <div>
                    <span className="font-space-mono font-bold text-[0.68rem] text-amber-300/90">{item.label}: </span>
                    <span className="text-[0.78rem] text-aws-text"><GlossaryText text={item.tip} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exam Quick Wins */}
        <section className="mb-10">
          <SectionHeader id="exam" emoji="🎯" title="Exam Quick Wins — Scenario → Jawapan" />
          <div className="bg-aws-card border border-aws-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-2 border-b border-aws-border">
              <div className="font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted px-4 py-2">Scenario</div>
              <div className="font-space-mono text-[0.6rem] uppercase tracking-widest text-aws-muted px-4 py-2 border-l border-aws-border">Jawapan</div>
            </div>
            {[
              { s: 'Private subnet EC2 perlu download patches dari internet', a: 'NAT Gateway (letak dalam public subnet)', c: 'text-c2' },
              { s: 'Block specific IP address dari masuk ke subnet', a: 'NACL — tambah Deny rule (SG tak boleh deny)', c: 'text-c5' },
              { s: 'Subnet tak dapat access internet walaupun ada IGW', a: 'Check route table: ada 0.0.0.0/0 → IGW? Subnet associate?', c: 'text-c4' },
              { s: 'EC2 private subnet access S3 tanpa NAT (jimat kos)', a: 'S3 Gateway VPC Endpoint (percuma)', c: 'text-c4' },
              { s: 'EC2 private subnet write ke S3 — low latency + high security', a: 'S3 Gateway VPC Endpoint — traffic stays dalam AWS backbone, tak lalu internet, free', c: 'text-c4' },
              { s: 'Connect 10 VPCs dan 3 on-premises data centers', a: 'Transit Gateway (TGW)', c: 'text-c3' },
              { s: 'Connect 2 VPCs dari different accounts', a: 'VPC Peering (pastikan IP ranges tak overlap!)', c: 'text-c2' },
              { s: 'High bandwidth, consistent low latency, on-prem ke AWS', a: 'Direct Connect', c: 'text-c1' },
              { s: 'VPC A boleh reach B, B boleh reach C, tapi A tak boleh reach C', a: 'Non-transitive peering — buat A↔C peering atau guna TGW', c: 'text-c3' },
              { s: 'Berapa usable IPs dalam /27?', a: '2^(32−27) − 5 = 32 − 5 = 27 usable IPs', c: 'text-c6' },
              { s: 'Access SSM, ECR dari private subnet secara private', a: 'Interface VPC Endpoint (PrivateLink) — berbayar', c: 'text-c4' },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-2 border-b border-aws-border/40 ${i % 2 !== 0 ? 'bg-white/[0.015]' : ''}`}>
                <div className="px-4 py-2.5 text-[0.75rem] text-aws-muted"><GlossaryText text={row.s} /></div>
                <div className={`px-4 py-2.5 text-[0.75rem] font-semibold border-l border-aws-border/40 ${row.c}`}><GlossaryText text={row.a} /></div>
              </div>
            ))}
          </div>
        </section>

        {/* Official Resources */}
        <section className="mb-10">
          <SectionHeader id="links" emoji="📎" title="Official Resources" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-aws-card border border-aws-border rounded-xl p-4">
              <h3 className="font-space-mono font-bold text-[0.7rem] uppercase tracking-widest text-aws-muted mb-3 flex items-center gap-1.5">
                <span>📄</span> AWS Documentation
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'VPC User Guide', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html' },
                  { label: 'VPC CIDR Blocks', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html' },
                  { label: 'Security Groups', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html' },
                  { label: 'Network ACLs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html' },
                  { label: 'Internet Gateways', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html' },
                  { label: 'NAT Gateways', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html' },
                  { label: 'Route Tables', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html' },
                  { label: 'VPC Peering Guide', url: 'https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html' },
                  { label: 'VPC Endpoints (PrivateLink)', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html' },
                  { label: 'Transit Gateway', url: 'https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html' },
                ].map((link) => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[0.75rem] text-aws-muted hover:text-c4 transition-colors group">
                    <span className="text-aws-border group-hover:text-c4 transition-colors shrink-0">→</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="bg-aws-card border border-aws-border rounded-xl p-4">
              <h3 className="font-space-mono font-bold text-[0.7rem] uppercase tracking-widest text-aws-muted mb-3 flex items-center gap-1.5">
                <span>🎓</span> AWS Official Resources
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'VPC FAQs', url: 'https://aws.amazon.com/vpc/faqs/' },
                  { label: 'VPC Pricing', url: 'https://aws.amazon.com/vpc/pricing/' },
                  { label: 'AWS Networking Blog', url: 'https://aws.amazon.com/blogs/networking-and-content-delivery/' },
                  { label: 'SAA-C03 Exam Guide (PDF)', url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/' },
                  { label: 'NAT Gateway Pricing', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html' },
                ].map((link) => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[0.75rem] text-aws-muted hover:text-c4 transition-colors group">
                    <span className="text-aws-border group-hover:text-c4 transition-colors shrink-0">→</span>
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-aws-border/60">
                <p className="font-space-mono text-[0.62rem] uppercase tracking-widest text-aws-muted mb-2">Also in this app</p>
                <div className="space-y-1.5">
                  <a href="/visual" className="flex items-center gap-2 text-[0.75rem] text-c4 hover:text-aws-text transition-colors">
                    <span>→</span> VPC Subnets & CIDR Diagram (Visual page)
                  </a>
                  <a href="/learn#d1-vpc" className="flex items-center gap-2 text-[0.75rem] text-c4 hover:text-aws-text transition-colors">
                    <span>→</span> VPC Deep Notes (Learn page)
                  </a>
                  <a href="/practice" className="flex items-center gap-2 text-[0.75rem] text-c4 hover:text-aws-text transition-colors">
                    <span>→</span> VPC Practice Questions (Practice page)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter tagline="AWS SAA-C03 · VPC Study Guide · Semoga faham dan boleh score! 💪" />

      </main>
    </>
  )
}

function SectionHeader({ id, emoji, title }: { id: string; emoji: string; title: string }) {
  return (
    <div id={id} className="flex items-center gap-2 mb-4 pb-3 border-b border-aws-border scroll-mt-20">
      <span className="text-xl">{emoji}</span>
      <h2 className="font-space-mono text-[0.75rem] font-extrabold uppercase tracking-[0.05em] text-c4">
        {title}
      </h2>
      <a href="#top" className="ml-auto font-space-mono text-[0.65rem] text-aws-muted hover:text-aws-text transition-colors">
        ↑ Top
      </a>
    </div>
  )
}

// AWS official icon palette — category gradients matching the AWS Architecture Icons toolkit
const NET = 'linear-gradient(135deg,#8C4FFF,#5A30C7)' // Networking & Content Delivery (purple)
const COMPUTE = 'linear-gradient(135deg,#F58536,#C75A0E)' // Compute (orange)
const DB = 'linear-gradient(135deg,#4D72F5,#2E27AD)' // Database (blue)

type AwsIconKind = 'vpc' | 'igw' | 'nat' | 'alb' | 'ec2' | 'rds' | 'vpngw' | 'dx' | 'users'

const awsIconMeta: Record<AwsIconKind, { bg: string; glyph: ReactNode }> = {
  vpc: { bg: NET, glyph: (<><rect x="4" y="5" width="16" height="14" rx="1.5" /><path d="M4 10h16M9.5 5v14" /></>) },
  igw: { bg: NET, glyph: (<><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M12 7v10M12 7l-3 3M12 7l3 3M12 17l-3-3M12 17l3 3" /></>) },
  nat: { bg: NET, glyph: (<><rect x="3.5" y="4" width="17" height="16" rx="2" /><path d="M6.5 9.5h8M6.5 9.5l2.5-2.5M6.5 9.5l2.5 2.5M17.5 14.5h-8M17.5 14.5l-2.5-2.5M17.5 14.5l-2.5 2.5" /></>) },
  alb: { bg: NET, glyph: (<><circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="12" cy="19" r="2" /><circle cx="19" cy="19" r="2" /><path d="M12 7v3M5 17v-3h14v3M12 14v3" /></>) },
  ec2: { bg: COMPUTE, glyph: (<><rect x="6" y="6" width="12" height="12" rx="1" /><rect x="9" y="9" width="6" height="6" rx="0.5" /><path d="M9 6V3.5M12 6V3.5M15 6V3.5M9 20.5V18M12 20.5V18M15 20.5V18M6 9H3.5M6 12H3.5M6 15H3.5M20.5 9H18M20.5 12H18M20.5 15H18" /></>) },
  rds: { bg: DB, glyph: (<><ellipse cx="12" cy="6" rx="7" ry="2.5" /><path d="M5 6v12c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5V6" /><path d="M5 12c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5" /></>) },
  vpngw: { bg: NET, glyph: (<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2" /></>) },
  dx: { bg: NET, glyph: (<><path d="M9 15l6-6" /><path d="M11 7.5l1-1a3.4 3.4 0 0 1 4.8 4.8l-1 1" /><path d="M13 16.5l-1 1a3.4 3.4 0 0 1-4.8-4.8l1-1" /></>) },
  users: { bg: DB, glyph: (<><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>) },
}

function AwsIcon({ kind, size = 30 }: { kind: AwsIconKind; size?: number }) {
  const meta = awsIconMeta[kind]
  const inner = Math.round(size * 0.6)
  return (
    <span
      className="inline-flex items-center justify-center rounded-md shrink-0 shadow-sm"
      style={{ width: size, height: size, background: meta.bg }}
      aria-hidden
    >
      <svg width={inner} height={inner} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        {meta.glyph}
      </svg>
    </span>
  )
}

function ServiceTile({ kind, label, sub }: { kind: AwsIconKind; label: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 w-[74px] text-center">
      <AwsIcon kind={kind} size={34} />
      <span className="font-space-mono text-[0.52rem] leading-tight text-aws-text">{label}</span>
      {sub && <span className="font-space-mono text-[0.46rem] leading-tight text-aws-muted">{sub}</span>}
    </div>
  )
}

function ExternalTile({ kind, label, sub }: { kind: AwsIconKind; label: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-aws-border bg-white/[0.02] px-2 py-2.5 text-center">
      <AwsIcon kind={kind} size={30} />
      <span className="font-space-mono text-[0.52rem] leading-tight text-aws-text">{label}</span>
      {sub && <span className="font-space-mono text-[0.46rem] leading-tight text-aws-muted">{sub}</span>}
    </div>
  )
}
