export const PWA_DRAFT = {
  name: 'AWS SAA-C03 Study',
  shortName: 'SAA Study',
  themeColor: '#0a0e1a',
  backgroundColor: '#0a0e1a',
  startUrl: '/',
  display: 'standalone' as const,
}

export const ICON_SIZES = [
  { size: 29, label: 'iOS notification' },
  { size: 60, label: 'iOS @2x' },
  { size: 80, label: 'Android mdpi' },
  { size: 120, label: 'iOS @3x' },
  { size: 192, label: 'Android / manifest' },
  { size: 512, label: 'Splash / store' },
] as const
