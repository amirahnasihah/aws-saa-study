interface AISourceLinksProps {
  awsDocsUrl: string
  awsDocsTitle?: string
  youtubeQuery: string
}

function docsDisplayLabel(url: string, title?: string): string {
  if (title?.trim()) return title.trim()
  try {
    const host = new URL(url).hostname
    return host.replace(/^www\./, '')
  } catch {
    return 'AWS Documentation'
  }
}

export default function AISourceLinks({
  awsDocsUrl,
  awsDocsTitle,
  youtubeQuery,
}: AISourceLinksProps) {
  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeQuery)}`
  const docsLabel = docsDisplayLabel(awsDocsUrl, awsDocsTitle)

  return (
    <div className="space-y-2">
      <a
        href={awsDocsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-white/3 border border-aws-border/40 hover:bg-white/6 hover:border-aws-border transition-all duration-150"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/6 border border-aws-border/40 text-base shrink-0">
          📋
        </span>
        <div className="min-w-0">
          <p className="font-space-mono text-[0.65rem] font-bold text-aws-text leading-none mb-1">
            AWS Documentation
          </p>
          <p className="font-space-mono text-[0.58rem] text-aws-muted truncate">
            {docsLabel}
          </p>
        </div>
        <span className="ml-auto text-aws-muted/40 group-hover:text-aws-text group-hover:translate-x-0.5 transition-all duration-150 text-xs shrink-0">
          →
        </span>
      </a>

      <a
        href={ytUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-red-500/5 border border-red-500/15 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-150"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-base shrink-0">
          ▶
        </span>
        <div className="min-w-0">
          <p className="font-space-mono text-[0.65rem] font-bold text-red-400 leading-none mb-1">
            YouTube Tutorial
          </p>
          <p className="font-space-mono text-[0.58rem] text-aws-muted truncate">
            {youtubeQuery}
          </p>
        </div>
        <span className="ml-auto text-red-400/40 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all duration-150 text-xs shrink-0">
          →
        </span>
      </a>
    </div>
  )
}
