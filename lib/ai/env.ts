import { getRequestContext } from '@cloudflare/next-on-pages'

export function readGroqApiKey(): string {
  try {
    const { env } = getRequestContext()
    return (env as CloudflareEnv).GROQ_API_KEY?.trim() ?? ''
  } catch {
    return ''
  }
}

export function readGatewayBase(): string | undefined {
  try {
    const { env } = getRequestContext()
    const base = (env as CloudflareEnv).AI_GATEWAY_BASE_URL?.trim()
    return base || undefined
  } catch {
    return undefined
  }
}
