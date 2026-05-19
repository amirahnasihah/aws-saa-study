import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export const alt = 'AWS SAA-C03 Study — Solutions Architect Associate exam prep'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const domains = [
  { label: 'D1 Secure', color: '#7c3aed' },
  { label: 'D2 Resilient', color: '#10b981' },
  { label: 'D3 Performance', color: '#ff6b35' },
  { label: 'D4 Cost', color: '#facc15' },
] as const

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0e1a',
          backgroundImage:
            'radial-gradient(ellipse at 50% 20%, rgba(0,212,255,0.14) 0%, transparent 55%), radial-gradient(ellipse at 50% 80%, rgba(124,58,237,0.12) 0%, transparent 55%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 28,
            maxWidth: 720,
            padding: '0 48px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: '#0f172a',
                border: '1px solid #1e2d40',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ display: 'flex', position: 'relative', width: 30, height: 24 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 1,
                    bottom: 0,
                    width: 18,
                    height: 18,
                    borderRadius: 9999,
                    backgroundColor: '#00d4ff',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 1,
                    bottom: 0,
                    width: 18,
                    height: 18,
                    borderRadius: 9999,
                    backgroundColor: '#00d4ff',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    marginLeft: -9,
                    width: 18,
                    height: 18,
                    borderRadius: 9999,
                    backgroundColor: '#00d4ff',
                  }}
                />
              </div>
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#00d4ff',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              AWS SAA Study
            </div>
          </div>

          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: '#e2e8f0',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
            }}
          >
            AWS SAA-C03 Study
          </div>

          <div
            style={{
              fontSize: 24,
              color: '#94a3b8',
              lineHeight: 1.35,
            }}
          >
            Solutions Architect Associate
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {domains.map((domain) => (
              <div
                key={domain.label}
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: domain.color,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 9999,
                  padding: '8px 16px',
                }}
              >
                {domain.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
