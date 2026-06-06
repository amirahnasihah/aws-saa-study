import { needsByokKey, type AIProvider } from '@/lib/ai/providers'

export function buildAIRequestHeaders(
  provider: AIProvider,
  byokKey: string | null
): Record<string, string> {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'x-ai-provider': provider,
  }
  if (needsByokKey(provider) && byokKey) {
    headers['x-api-key'] = byokKey
  }
  return headers
}
