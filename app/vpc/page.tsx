import Nav from '@/components/Nav'
import GlossaryText from '@/components/GlossaryText'

export const metadata = {
  title: 'AWS SAA-C03 — VPC Study Guide',
  description: 'Master AWS VPC: CIDR, subnets, SG vs NACL, traffic flow, memory tricks, and official docs for the SAA-C03 exam',
}

export default function VpcPage() {
  return (
    <>
      <Nav activePage="vpc" />

      <main id="top" className="max-w-[860px] mx-auto px-4 pt-[calc(3.5rem+1.5rem)] pb-16">

        {/* Hero */}
        <div className="text-center mb-10">
          <span className="font-space-mono text-[0.65rem] uppercase tracking-[0.15em] text-aws-muted">VPC Study Guide</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-2 text-aws-text">
            Master AWS VPC
          </h1>
          <p className="font-space-mono text-[0.78rem] text-aws-muted max-w-lg mx-auto leading-relaxed">
            Topic paling banyak keluar dalam SAA-C03. Faham konsep ni dan banyak soalan lain akan jadi senang.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {[
              { href: '#mental-model', label: 'Mental Model' },
              { href: '#cidr', label: 'CIDR & IP Structure' },
              { href: '#subnets', label: 'Subnets' },
              { href: '#sg-nacl', label: 'SG vs NACL' },
              { href: '#traffic', label: 'Traffic Flow' },
              { href: '#nat-flow', label: 'NAT Flow' },
              { href: '#connectivity', label: 'Connectivity' },
              { href: '#tips', label: 'Memory Tricks' },
              { href: '#exam', label: 'Exam Wins' },
              { href: '#links', label: 'Resources' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-space-mono text-[0.6rem] uppercase tracking-widest px-2.5 py-1 rounded-full border border-c4/30 text-c4 hover:bg-c4/10 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
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

        {/* Connectivity Options */}
        <section className="mb-10">
          <SectionHeader id="connectivity" emoji="🔗" title="VPC Connectivity — Pilih Yang Mana?" />
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
                  <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
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
                  { label: 'NAT Gateway Pricing', url: 'https://aws.amazon.com/vpc/pricing/' },
                ].map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
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

        <footer className="text-center font-space-mono text-[0.65rem] text-aws-muted pt-6 border-t border-aws-border">
          AWS SAA-C03 · VPC Study Guide · Semoga faham dan boleh score! 💪
        </footer>

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
