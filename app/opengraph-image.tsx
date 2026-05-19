import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export const alt = 'AWS SAA-C03 Study — Solutions Architect Associate exam prep'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          backgroundColor: '#0a0e1a',
          backgroundImage:
            'radial-gradient(ellipse at 8% 18%, rgba(0,212,255,0.14) 0%, transparent 48%), radial-gradient(ellipse at 92% 82%, rgba(124,58,237,0.12) 0%, transparent 48%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: '#0f172a',
              border: '1px solid #1e2d40',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', position: 'relative', width: 36, height: 28 }}>
              <div
                style={{
                  position: 'absolute',
                  left: 2,
                  bottom: 0,
                  width: 22,
                  height: 22,
                  borderRadius: 9999,
                  backgroundColor: '#00d4ff',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 2,
                  bottom: 0,
                  width: 22,
                  height: 22,
                  borderRadius: 9999,
                  backgroundColor: '#00d4ff',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  marginLeft: -11,
                  width: 22,
                  height: 22,
                  borderRadius: 9999,
                  backgroundColor: '#00d4ff',
                }}
              />
            </div>
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#00d4ff',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            AWS SAA Study
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 900 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#e2e8f0',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            AWS SAA-C03 Study
          </div>
          <div
            style={{
              fontSize: 30,
              color: '#94a3b8',
              lineHeight: 1.35,
              maxWidth: 880,
            }}
          >
            Solutions Architect Associate — cheat sheet, deep notes, practice & architecture diagrams
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {[
            { label: 'D1 Secure', color: '#7c3aed' },
            { label: 'D2 Resilient', color: '#10b981' },
            { label: 'D3 Performance', color: '#ff6b35' },
            { label: 'D4 Cost', color: '#facc15' },
          ].map((domain) => (
            <div
              key={domain.label}
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: domain.color,
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 9999,
                padding: '10px 20px',
              }}
            >
              {domain.label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
