interface AWSDocsLinkProps {
  awsDocsUrl: string
  awsDocsTitle?: string
}

function docsLabel(url: string, title?: string): string {
  if (title?.trim()) return title.trim()
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'AWS Documentation'
  }
}

export default function AWSDocsLink({ awsDocsUrl, awsDocsTitle }: AWSDocsLinkProps) {
  return (
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
          {docsLabel(awsDocsUrl, awsDocsTitle)}
        </p>
      </div>
      <span className="ml-auto text-aws-muted/40 group-hover:text-aws-text group-hover:translate-x-0.5 transition-all duration-150 text-xs shrink-0">
        →
      </span>
    </a>
  )
}
