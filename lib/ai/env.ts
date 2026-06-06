import { getRequestContext } from '@cloudflare/next-on-pages'

type ServerSecretKey = 'GROQ_API_KEY' | 'GEMINI_API_KEY' | 'ILMU_API_KEY' | 'AI_GATEWAY_BASE_URL'

function readEnvString(name: ServerSecretKey): string {
  try {
    const { env } = getRequestContext()
    const fromBinding = (env as CloudflareEnv)[name]?.trim() ?? ''
    if (fromBinding) return fromBinding
  } catch {
    // Fall through — local dev may not have Cloudflare context yet
  }
  return process.env[name]?.trim() ?? ''
}

export function readGroqApiKey(): string {
  return readEnvString('GROQ_API_KEY')
}

export function readIlmuApiKey(): string {
  return readEnvString('ILMU_API_KEY')
}

export function readGeminiApiKey(): string {
  return readEnvString('GEMINI_API_KEY')
}

export function readGatewayBase(): string | undefined {
  const base = readEnvString('AI_GATEWAY_BASE_URL')
  return base || undefined
}
