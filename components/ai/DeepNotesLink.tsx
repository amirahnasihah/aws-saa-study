interface DeepNotesLinkProps {
  deepNotesUrl: string
  deepNotesTitle: string
  deepNotesSection: string
  sectionIcon?: string
}

export default function DeepNotesLink({
  deepNotesUrl,
  deepNotesTitle,
  deepNotesSection,
  sectionIcon = '📖',
}: DeepNotesLinkProps) {
  return (
    <a
      href={deepNotesUrl}
      className="group flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-c1/5 border border-c1/15 hover:bg-c1/10 hover:border-c1/30 transition-all duration-150"
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-c1/10 border border-c1/20 text-base shrink-0">
        {sectionIcon}
      </span>
      <div className="min-w-0">
        <p className="font-space-mono text-[0.65rem] font-bold text-c1 leading-none mb-1">
          Deep Notes
        </p>
        <p className="font-space-mono text-[0.58rem] text-aws-muted truncate">
          {deepNotesTitle} · {deepNotesSection}
        </p>
      </div>
      <span className="ml-auto text-c1/40 group-hover:text-c1 group-hover:translate-x-0.5 transition-all duration-150 text-xs shrink-0">
        →
      </span>
    </a>
  )
}
