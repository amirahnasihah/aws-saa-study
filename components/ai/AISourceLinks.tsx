import AWSDocsLink from '@/components/ai/AWSDocsLink'

interface AISourceLinksProps {
  awsDocsUrl: string
  awsDocsTitle?: string
  youtubeQuery: string
}

export default function AISourceLinks({
  awsDocsUrl,
  awsDocsTitle,
  youtubeQuery,
}: AISourceLinksProps) {
  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeQuery)}`

  return (
    <div className="space-y-2">
      <AWSDocsLink awsDocsUrl={awsDocsUrl} awsDocsTitle={awsDocsTitle} />

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
